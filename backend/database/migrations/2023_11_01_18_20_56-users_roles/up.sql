CREATE TABLE users_roles (
    user_id integer not null,
    role_id integer not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);