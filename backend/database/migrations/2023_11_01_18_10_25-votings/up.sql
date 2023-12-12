CREATE TABLE votings (
    id serial unique,
    order_id integer NOT NULL,
    voting_status_id integer NOT NULL,
    started_at timestamp NOT NULL,
    finished_at timestamp CHECK (finished_at > votings.started_at),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (voting_status_id) REFERENCES voting_statuses(id)
);