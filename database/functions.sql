CREATE OR REPLACE FUNCTION create_user(_name varchar(256), _password varchar(256), _district_id integer) RETURNS void AS
$$
BEGIN
    INSERT INTO users(name, password, district_id)
    VALUES (_name, _password, _district_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION create_order(_description text, _location_id integer, _user_id integer) RETURNS void AS
$$
BEGIN
    INSERT INTO orders(description, location_id, user_id)
    VALUES (_description, _location_id, _user_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION make_vote(_user_id integer, _voting_id integer, _vote boolean) RETURNS void AS
$$
BEGIN
    INSERT INTO votes(user_id, voting_id, vote, created_at)
    VALUES (_user_id, _voting_id, _vote, NOW());
END;
$$ LANGUAGE plpgsql;

--
CREATE OR REPLACE FUNCTION create_job(_order_id integer, _job_status_id integer, _started_at timestamp,
                                      _finished_at timestamp) RETURNS void AS
$$
BEGIN
    INSERT INTO jobs(order_id, job_status_id, started_at, finished_at)
    VALUES (_order_id, _job_status_id, _started_at, _finished_at);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION create_voting(_order_id integer, _voting_status_id integer, _started_at timestamp,
                                         _finished_at timestamp default null) RETURNS void AS
$$
DECLARE
    v_id integer;
BEGIN
    INSERT INTO votings(order_id, voting_status_id, started_at, finished_at)
    VALUES (_order_id, _voting_status_id, _started_at, _finished_at) RETURNING id INTO v_id;
    INSERT INTO votes(user_id, voting_id, vote, created_at)
    VALUES (
        (SELECT user_id FROM orders WHERE orders.id = _order_id),
        v_id,
        true,
        NOW()
    );
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
                    OR user2_id = sender_id AND user1_id = receiver_id)LIMIT 1) IS NOT NULL) then

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


CREATE OR REPLACE FUNCTION finish_voting_and_get_result(_voting_id integer) RETURNS bool AS
$$
BEGIN
    UPDATE votings
    SET finished_at = NOW()
    WHERE id = _voting_id;
    RETURN (SELECT avg(vote) > 0.5 FROM votes WHERE voting_id = _voting_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION finish_job(_job_id integer) RETURNS bool AS
$$
BEGIN
    UPDATE jobs
    SET finished_at = NOW()
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
    IF (SELECT * FROM votings WHERE NEW.voting_id = id AND finished_at IS NULL) THEN
        return NEW;
    END IF;
    raise exception 'Голосование уже было завершено';
end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION check_user_who_make_vote_for_district_handle() RETURNS trigger AS
$$
begin
    IF (SELECT votings.id
        FROM votings
             INNER JOIN orders ON votings.order_id = orders.id
             INNER JOIN locations ON orders.location_id = locations.id
        WHERE locations.district_id = (SELECT users.district_id
                                       FROM users
                                       WHERE id = NEW.user_id)
          AND NEW.voting_id = votings.id
          AND votings.finished_at IS NULL) THEN
        return NEW;
    END IF;
    raise exception 'Данное голосование проводится не в вашем районе. % %', NEW.voting_id, (SELECT users.district_id
                                                                                     FROM users
                                                                                     WHERE id = NEW.user_id);
end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION create_job_after_finishing_voting_handle() RETURNS trigger AS
$$
begin
    IF (NEW.finished_at <> OLD.finished_at AND OLD.finished_at IS NULL) THEN
        INSERT INTO jobs(order_id, job_status_id, started_at, finished_at)
        VALUES (OLD.order_id, 1, NOW(), NULL);
    END IF;
end;
$$ language plpgsql;

