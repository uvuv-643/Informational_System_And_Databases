CREATE TABLE chat_messages (
    id serial unique,
    chat_id integer not null,
    sender_id integer not null,
    content text not null,
    created_at timestamp not null,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);