CREATE SCHEMA IF NOT EXISTS  company_db (
SET search path to company_db

CREATE TABLE departments(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(10, 2) UNIQUE NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY(department_id) 
	REFERENCES departments(id)
	ON DELETE SET NULL
);

CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTERGER NOT NULL,
    manager_id INTERGER,
    FOREIGN KEY(role_id) REFERENCES roles(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id)
);

INSERT INTO departments (typeof)
VALUES 
('claims'),
('underwriting')

INSERT INTO roles (job, available)
('adjuster', true, 2)
('claims lead', true, 1)
('underwriter', true, 2)
('senior underwriter', true, 2)


