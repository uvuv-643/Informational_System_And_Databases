CREATE TABLE jobs (
    id serial unique,
    order_id integer,
    job_status_id integer,
    started_at timestamp,
    finished_at timestamp,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (job_status_id) REFERENCES job_statuses(id)
);