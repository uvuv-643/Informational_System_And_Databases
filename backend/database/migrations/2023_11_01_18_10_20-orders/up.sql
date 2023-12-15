CREATE TABLE orders (
    id serial unique,
    description text NOT NULL CHECK ( LENGTH(description) > 5 ),
    location_id integer NOT NULL,
    user_id integer NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);