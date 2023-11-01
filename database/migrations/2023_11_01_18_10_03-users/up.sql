CREATE TABLE users (
    id serial unique,
    name varchar(255),
    password varchar(255),
    district_id integer,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);