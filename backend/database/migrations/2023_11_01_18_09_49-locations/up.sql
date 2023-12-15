CREATE TABLE locations (
    id serial unique,
    full_address varchar(255) NOT NULL,
    district_id integer NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE 
);