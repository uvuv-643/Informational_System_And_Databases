CREATE TABLE chats (
    id serial unique,
    order_id integer,
    user1_id integer,
    user2_id integer,
    created_at timestamp,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);