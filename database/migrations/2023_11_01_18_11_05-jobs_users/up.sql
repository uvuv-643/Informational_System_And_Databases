CREATE TABLE jobs_users (
    job_id integer not null,
    user_id integer not null,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (job_id, user_id)
);