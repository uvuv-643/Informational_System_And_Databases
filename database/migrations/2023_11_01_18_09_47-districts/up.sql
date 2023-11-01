CREATE TABLE districts (
    id serial unique,
    name varchar(255),
    city_id integer,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);