INSERT INTO departments (department_name)
VALUES ('IT');

INSERT INTO departments (department_name)
VALUES ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES ('Network Administrator', 1234, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Systems Administrator', 1234, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Network Engineer', 5678, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ('Team Leader', 4567, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_status)
VALUES ('John', 'Doe', 2, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_status)
VALUES ('Jane', 'Smith', 4, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status)
VALUES ('Stephanie', 'Jenkins', 1, 1, 0);

INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status)
VALUES ('Juliette', 'Fielding', 1, 2, 0);






