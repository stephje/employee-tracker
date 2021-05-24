DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  salary DECIMAL(8, 2) NOT NULL,
  department_id INT NOT NULL,
  -- FOREIGN KEY (department_id) REFERENCES departments(id),
  PRIMARY KEY (id)
);
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  roles VARCHAR(100) NOT NULL,
  manager VARCHAR(100) NOT NULL,
  -- role_id INT NOT NULL,
  -- FOREIGN KEY (role_id) REFERENCES roles(id),
  -- manager_id INT NOT NULL,
  -- FOREIGN KEY (manager_id) REFERENCES employees(id),
  PRIMARY KEY (id)
);