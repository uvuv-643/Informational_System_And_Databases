CREATE TABLE votings (
    id serial unique,
    order_id integer,
    voting_status_id integer,
    started_at timestamp,
    finished_at timestamp,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (voting_status_id) REFERENCES voting_statuses(id)
);