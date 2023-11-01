CREATE TABLE locations (
    id serial unique,
    street varchar(255),
    house varchar(255),
    district_id integer,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);