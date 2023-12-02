CREATE TABLE districts (
    id serial unique,
    name varchar(255) NOT NULL,
    city_id integer NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);