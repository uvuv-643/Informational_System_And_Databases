CREATE TABLE photos(
    id serial unique,
    photo_path varchar(255) NOT NULL,
    temp_order varchar(255) NOT NULL,
    photo_id varchar(255) NOT NULL,
    longitude double precision NOT NULL,
    latitude double precision NOT NULL
);