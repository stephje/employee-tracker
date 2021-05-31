INSERT INTO departments (department_name)
VALUES ('IT');

INSERT INTO departments (department_name)
VALUES ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES ('Network Administrator', 60000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Systems Administrator', 60000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Lead Engineer', 90000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Accountant', 80000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_status)
VALUES ('John', 'Doe', 2, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_status)
VALUES ('Jane', 'Smith', 4, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status)
VALUES ('Stephanie', 'Jenkins', 1, 1, 0);

INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status)
VALUES ('Juliette', 'Fielding', 1, 2, 0);






