CREATE TABLE orders_photos (
    order_id integer,
    photo_id integer,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (photo_id) REFERENCES photos(id),
    primary key (order_id, photo_id)
);