CREATE TABLE votes (
    id serial unique,
    user_id integer,
    voting_id integer,
    vote boolean,
    created_at timestamp,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (voting_id) REFERENCES votings(id)
);