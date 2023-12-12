CREATE TABLE votes (
    id serial unique,
    user_id integer not null,
    voting_id integer not null,
    vote boolean not null,
    created_at timestamp not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (voting_id) REFERENCES votings(id)
);