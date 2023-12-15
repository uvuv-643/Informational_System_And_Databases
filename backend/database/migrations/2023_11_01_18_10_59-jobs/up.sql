CREATE TABLE jobs (
    id serial unique primary key ,
    order_id integer,
    job_status_id integer NOT NULL,
    started_at timestamp NOT NULL,
    finished_at timestamp,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (job_status_id) REFERENCES job_statuses(id) ON DELETE CASCADE
);