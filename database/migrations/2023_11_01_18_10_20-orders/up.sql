CREATE TABLE orders (
    id serial unique,
    description text,
    location_id integer,
    user_id integer,
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);