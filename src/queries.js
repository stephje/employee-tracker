const connection = require('./connection');

class Queries {
    constructor(connection) {
        this.connection = connection;
    }

    addDepartment(array) {
        return this.connection.query(
            'INSERT INTO departments (department_name) VALUES (?)',
            array,
        );
    }

    addRole(array) {
        return this.connection.query(
            'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
            array,
        );
    }

    addEmployee(array) {
        return this.connection.query(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status) VALUES (?, ?, ?, ?, ?)',
            array,
        );
    }

    displayDepartments() {
        return this.connection.query('SELECT department_id as ID, department_name as department from departments');
    }

    displayRoles() {
        return this.connection.query('SELECT roles.role_id as ID, roles.title, roles.salary, departments.department_name as department FROM roles LEFT JOIN departments on (roles.department_id = departments.department_id);');
    }

    displayEmployees() {
        return this.connection.query('SELECT e.employee_id as ID, e.first_name, e.last_name, r.title, d.department_name FROM employees as e LEFT JOIN roles as r on (e.role_id = r.role_id) LEFT JOIN departments as d on (r.department_id = d.department_id);');
    }

    getDepartments() {
        return this.connection.query('SELECT * from departments');
    }

    getRoles() {
        return this.connection.query('SELECT * from roles');
    }

    getEmployees() {
        return this.connection.query('SELECT * from employees');
    }

    getManagers() {
        return this.connection.query(
            'SELECT * from employees WHERE manager_status = 1'
        );
    }

    updateEmployeeRole(array) {
        return this.connection.query(
            'UPDATE employees SET role_id = ? WHERE employee_id = ?',
            array,
        );
    }

    quit() {
        return this.connection.end();
    }
}

module.exports = new Queries(connection);