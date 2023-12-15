CREATE OR REPLACE FUNCTION create_user(_name varchar(256), _password varchar(256), _district_id integer,
                                       _email varchar(255)) RETURNS void AS
$$
DECLARE
    u_id integer;
BEGIN
    INSERT INTO users(name, password, district_id, email)
    VALUES (_name, _password, _district_id, _email)
    RETURNING id INTO u_id;
    INSERT INTO users_roles (user_id, role_id)
    VALUES (u_id, (SELECT id FROM roles WHERE name = 'admin'));

END;
$$ LANGUAGE plpgsql;

DROP function create_order;
CREATE OR REPLACE FUNCTION create_order(_description text, _user_id integer, _full_address varchar(255),
                                        _district_id integer, _order_temp_id varchar(255)) RETURNS void AS
$$
DECLARE
    v_id integer;
    o_id integer;
BEGIN
    INSERT INTO locations (full_address, district_id)
    VALUES (_full_address, _district_id)
    RETURNING id INTO v_id;
    INSERT INTO orders(description, location_id, user_id)
    VALUES (_description, v_id, _user_id)
    RETURNING id INTO o_id;
    INSERT INTO orders_photos (order_id, photo_id)
    SELECT o_id, id FROM photos WHERE temp_order = _order_temp_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION make_vote(_user_id integer, _voting_id integer, _vote boolean) RETURNS void AS
$$
BEGIN
    IF (SELECT 1 FROM votes WHERE user_id = _user_id AND voting_id = _voting_id) THEN
        RAISE EXCEPTION 'Уже проголосовали';
    ELSE
        INSERT INTO votes(user_id, voting_id, vote, created_at)
        VALUES (_user_id, _voting_id, _vote::bool, NOW());
    END IF;
END;
$$ LANGUAGE plpgsql;

--
CREATE OR REPLACE FUNCTION create_job(_order_id integer) RETURNS void AS
$$
BEGIN
    INSERT INTO jobs(order_id, job_status_id, started_at, finished_at)
    VALUES (_order_id, (SELECT id FROM job_statuses WHERE name = 'на согласовании'), NOW(), NULL);
END ;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION create_voting(_order_id integer) RETURNS void AS
$$
DECLARE
    v_id integer;
BEGIN
    INSERT INTO votings(order_id, voting_status_id, started_at, finished_at)
    VALUES (_order_id, (SELECT id FROM voting_statuses WHERE name = 'на голосовании'), NOW(), NULL)
    RETURNING id INTO v_id;
    INSERT INTO votes(user_id, voting_id, vote, created_at)
    VALUES ((SELECT user_id FROM orders WHERE orders.id = _order_id),
            v_id,
            true,
            NOW());
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION finish_voting_and_get_result(_voting_id integer) RETURNS bool AS
$$
BEGIN
    UPDATE votings
    SET finished_at      = NOW(),
        voting_status_id = (SELECT id FROM voting_statuses WHERE name = 'завершено')
    WHERE id = _voting_id;
    RETURN (SELECT avg(vote) > 0.5 FROM votes WHERE voting_id = _voting_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION finish_job(_job_id integer) RETURNS bool AS
$$
BEGIN
    UPDATE jobs
    SET finished_at   = NOW(),
        job_status_id = (SELECT id FROM job_statuses WHERE name = 'завершено')
    WHERE id = _job_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_time_on_job(_job_id integer) RETURNS bool AS
$$
BEGIN
    IF (SELECT * FROM jobs WHERE finished_at IS NOT NULL AND id = _job_id) THEN
        RETURN (SELECT finished_at - started_at FROM jobs WHERE id = _job_id);
    ELSE
        RETURN (SELECT NOW() - started_at FROM jobs WHERE id = _job_id);
    end if;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION send_message(_order_id integer, sender_id integer, receiver_id integer,
                                        _content text) RETURNS void AS
$$
BEGIN

    if ((SELECT id
         FROM chats
         WHERE (chats.order_id = _order_id)
           AND (user1_id = sender_id AND user2_id = receiver_id
             OR user2_id = sender_id AND user1_id = receiver_id)
         LIMIT 1) IS NOT NULL) then

        INSERT INTO chats(order_id, user1_id, user2_id, created_at)
        VALUES (order_id, sender_id, receiver_id, NOW());
    END IF;

    INSERT INTO chat_messages(chat_id, sender_id, content, created_at)
    VALUES ((SELECT id
             FROM chats
             WHERE (chats.order_id = _order_id)
               AND (user1_id = sender_id AND user2_id = receiver_id
                 OR user2_id = sender_id AND user1_id = receiver_id)), sender_id, _content, NOW());

END;
$$ LANGUAGE plpgsql;


create or replace function check_user_has_access_to_chat_handle() returns trigger as
$$
begin
    IF (SELECT id
        FROM chats
        WHERE (NEW.sender_id = user1_id OR NEW.sender_id = user2_id)
          AND NEW.chat_id = id) THEN
        return NEW;
    END IF;
    raise exception 'Пользователь не имеет доступа к чату';
end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION check_vote_after_finishing_handle() RETURNS trigger AS
$$
begin
    IF (SELECT 1 FROM votings WHERE NEW.voting_id = id AND finished_at IS NULL) THEN
        return NEW;
    END IF;
    raise exception 'Голосование уже было завершено';
end;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION check_user_who_make_vote_for_district_handle() RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT 1
        FROM votings
                 INNER JOIN orders ON votings.order_id = orders.id
                 INNER JOIN locations ON orders.location_id = locations.id
        WHERE locations.district_id = (SELECT users.district_id
                                       FROM users
                                       WHERE id = NEW.user_id)
          AND NEW.voting_id = votings.id
          AND votings.finished_at IS NULL
        LIMIT 1) THEN
        RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Данное голосование проводится не в вашем районе.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION create_job_after_finishing_voting_handle() RETURNS trigger AS
$$
begin
    IF (NEW.finished_at <> OLD.finished_at AND OLD.finished_at IS NULL) THEN
        SELECT create_job(OLD.order_id);
    END IF;
    RETURN NEW;
end;
$$ language plpgsql;

DROP function select_admins;

CREATE OR REPLACE FUNCTION select_admins()
    RETURNS TABLE
            (
                id   integer,
                name varchar(255)
            )
AS
$$
begin
    RETURN QUERY
        SELECT users.id, users.name
        FROM users
                 INNER JOIN users_roles ON users.id = users_roles.user_id
                 INNER JOIN roles ON role_id = roles.id
        WHERE roles.name = 'admin';
end;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION select_user_roles(_id integer)
    RETURNS TABLE
            (
                name varchar(255)
            )
AS
$$
begin
    RETURN QUERY
        SELECT roles.name
        FROM users
                 INNER JOIN users_roles ON users.id = users_roles.user_id
                 INNER JOIN roles ON role_id = roles.id
        WHERE users.id = _id;
end;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION add_user_role_after_registration_handle() RETURNS trigger AS
$$
BEGIN
    INSERT INTO users_roles (user_id, role_id) VALUES (NEW.id, 1);
    IF (NEW.name LIKE '%admin%') THEN
        INSERT INTO users_roles (user_id, role_id) VALUES (NEW.id, 2);
        INSERT INTO users_roles (user_id, role_id) VALUES (NEW.id, 3);
    END IF;
    return NEW;
end;
$$ language plpgsql;

DROP FUNCTION get_voting_information;
CREATE OR REPLACE FUNCTION get_voting_information(_order_id integer)
    RETURNS TABLE
            (
                id      integer,
                status  varchar(255),
                ffor    integer,
                against integer
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT votings.id                                             as id,
               voting_statuses.name                                   as status,
               sum(CASE WHEN vote = true THEN 1 ELSE 0 END)::integer  AS ffor,
               sum(CASE WHEN vote = false THEN 1 ELSE 0 END)::integer AS against
        FROM votings
                 INNER JOIN voting_statuses ON votings.voting_status_id = voting_statuses.id
                 LEFT JOIN votes ON votings.id = votes.voting_id
        WHERE votings.order_id = _order_id
        GROUP BY votings.id, voting_statuses.name;
END;
$$ LANGUAGE plpgsql;

DROP function get_voting_information_by_id;
CREATE OR REPLACE FUNCTION get_voting_information_by_id(_voting_id integer)
    RETURNS TABLE
            (
                id                integer,
                status            varchar(255),
                ffor              integer,
                against           integer,
                order_description text
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT votings.id                                             as id,
               voting_statuses.name                                   as status,
               sum(CASE WHEN vote = true THEN 1 ELSE 0 END)::integer  AS ffor,
               sum(CASE WHEN vote = false THEN 1 ELSE 0 END)::integer AS against,
               orders.description                                     as order_description
        FROM votings
                 INNER JOIN voting_statuses ON votings.voting_status_id = voting_statuses.id
                 LEFT JOIN votes ON votings.id = votes.voting_id
                 LEFT JOIN orders ON votings.order_id = orders.id
        WHERE votings.id = _voting_id
        GROUP BY votings.id, voting_statuses.name, orders.description;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_jobs_information(_order_id integer)
    RETURNS TABLE
            (
                id     integer,
                status varchar(255)
            )
AS
$$
begin
    RETURN QUERY
        SELECT jobs.id           as id,
               job_statuses.name as status
        FROM jobs
                 INNER JOIN job_statuses ON jobs.job_status_id = job_statuses.id
        WHERE jobs.order_id = _order_id;
end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION get_photos_information(_order_id integer)
    RETURNS TABLE
            (
                id   integer,
                path varchar(255)
            )
AS
$$
begin
    RETURN QUERY
        SELECT photos.id         as id,
               photos.photo_path as path
        FROM orders_photos
                 INNER JOIN photos ON orders_photos.photo_id = photos.id
        WHERE orders_photos.order_id = _order_id;
end;
$$ language plpgsql;


DROP FUNCTION get_location_information;
CREATE OR REPLACE FUNCTION get_location_information(_order_id integer)
    RETURNS TABLE
            (
                full_address varchar(255),
                district     varchar(255)
            )
AS
$$
begin
    RETURN QUERY
        SELECT locations.full_address as full_address,
               districts.name         as district
        FROM orders
                 INNER JOIN locations ON orders.location_id = locations.id
                 INNER JOIN districts ON districts.id = locations.district_id
        WHERE orders.id = _order_id;
end;
$$ language plpgsql;


DROP function get_orders_from_user_district;
CREATE OR REPLACE FUNCTION get_orders_from_user_district(_user_id integer)
    RETURNS TABLE
            (
                id          integer,
                description text
            )
AS
$$
begin
    RETURN QUERY
        SELECT DISTINCT orders.id          as id,
               orders.description as description
        FROM orders
                 INNER JOIN users ON orders.user_id = users.id
                 INNER JOIN locations ON locations.id = orders.location_id
        WHERE (SELECT users.district_id FROM users WHERE users.id = _user_id) = locations.district_id;
end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION change_voting_status(_order_id integer)
    RETURNS void
AS
$$
begin
    IF EXISTS (SELECT 1 FROM votings WHERE order_id = _order_id) THEN
        UPDATE votings SET voting_status_id = 1, finished_at = NOW() WHERE id = (SELECT id FROM votings WHERE order_id = _order_id);
        RETURN;
    ELSE
        INSERT INTO votings (order_id, voting_status_id, started_at, finished_at)
        VALUES (_order_id, 2, NOW(), NULL);
    END IF;
    RETURN;

end;
$$ language plpgsql;

