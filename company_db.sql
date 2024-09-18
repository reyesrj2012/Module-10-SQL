CREATE SCHEMA IF NOT EXISTS  company_db;
SET search_path to company_db;

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
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY(role_id) REFERENCES roles(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id)
);

INSERT INTO departments (name)
VALUES 
('claims'),
('underwriting');

INSERT INTO roles (title, salary, department_id) VALUES
('adjuster',50000, 1),
('claims lead', 70000, 1),
('underwriter', 100000, 2),
('senior underwriter', 120000, 2);


