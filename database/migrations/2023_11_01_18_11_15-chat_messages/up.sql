CREATE TABLE chat_messages (
    id serial unique,
    chat_id integer,
    sender_id integer,
    content text,
    created_at timestamp,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);