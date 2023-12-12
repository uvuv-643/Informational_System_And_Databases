CREATE TABLE locations (
    id serial unique,
    street varchar(255) NOT NULL,
    house varchar(255) NOT NULL,
    district_id integer NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);