CREATE TABLE users (
    id serial unique,
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    district_id integer,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);