const mysql = require('mysql2/promise');
const table = require('console.table');
const inquirer = require('inquirer');

//Add a new database entry
async function addNewDatabaseEntry(connection, answers) {
    console.log("add", answers);

    //Case depends on whether the user chose to update a department, role or employee
    switch (answers.type) {
        case 'DEPARTMENT':
            const newDepartment = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Department name:',
                    name: 'name',
                },
            ]);

            try {
                //Insert the new role into the database
                const results = await connection.query(
                    "INSERT INTO departments (department_name) VALUES (?)",
                    [newDepartment.name],
                    function (err, results) {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log("Department added", results)
                        }
                    }
                );
                console.log("Rows added:", results[0].affectedRows);
            } catch (error) {
                console.error(error);
            };
            break;

        case 'ROLE':
            let departmentsObject = await connection.query(
                'SELECT * from departments'
            );
            let departmentsArray = departmentsObject[0].map(item => ({ name: item.department_name, value: item.department_id }));
            const newRole = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Role title:',
                    name: 'title'
                },
                {
                    type: 'list',
                    message: 'Which department is this role associated with?',
                    choices: departmentsArray,
                    name: 'dept',
                },
                {
                    type: 'input',
                    message: 'What is the salary for this role?',
                    name: 'salary',
                }
            ]);
            console.log(newRole);

            try {
                //Insert the new role into the database
                const results = await connection.query(
                    "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
                    [newRole.title, newRole.salary, newRole.dept],
                    function (err, results) {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log("Role added", results)
                        }
                    }
                );
                console.log("Rows added:", results[0].affectedRows);
            } catch (error) {
                console.error(error);
            };
            break;

        case 'EMPLOYEE':

            let rolesObject = await connection.query(
                'SELECT * from roles'
            );

            console.log(rolesObject[0])

            let rolesArray = rolesObject[0].map(item => ({ name: item.title, value: item.role_id }));

            console.log(rolesArray)

            let managersObject = await connection.query(
                'SELECT * from employees WHERE manager_status = 1'
            );

            console.log(managersObject[0])

            let managerArray = managersObject[0].map(item => ({ name: (`${item.first_name} ` + `${item.last_name}`), value: item.employee_id }));

            console.log(managerArray)

            const newEmployee = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'First Name:',
                    name: 'firstName',
                },
                {
                    type: 'input',
                    message: 'Last Name:',
                    name: 'lastName',
                },
                {
                    type: 'list',
                    message: 'Role:',
                    choices: rolesArray,
                    name: 'role',
                },
                {
                    type: 'confirm',
                    message: 'Is this employee a manager?',
                    name: 'managerStatus',
                },
                {
                    type: 'confirm',
                    message: 'Does this employee have a manager?',
                    name: 'hasManager',
                    when(newEmployee) {
                        return newEmployee.managerStatus !== false;
                    }
                },
                {
                    type: 'list',
                    message: 'Manager:',
                    choices: managerArray,
                    name: 'manager',
                    when(newEmployee) {
                        return newEmployee.hasManager !== false;
                    }
                },
            ]);

            console.log(newEmployee);

            try {
                //Insert the new role into the database
                const results = await connection.query(
                    "INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status) VALUES (?, ?, ?, ?, ?)",
                    [newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.manager, newEmployee.managerStatus],
                    function (err, results) {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log("Employee added", results)
                        }
                    }
                );
                console.log("Rows added:", results[0].affectedRows);
            } catch (error) {
                console.error(error);
            };
            break;
    }
    connection.end();
}

function updateDatabaseEntry(connection, answers) {
    console.log("update", answers);
    connection.end();

}

function viewDatabaseEntries(connection, answers) {
    console.log("view", answers);
    connection.end();

}

async function initiate(connection) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            choices: ['ADD', 'VIEW', 'UPDATE'],
            name: 'action',
        },
        {
            type: 'list',
            message: 'What type of entry?',
            choices: ['EMPLOYEE', 'ROLE', 'DEPARTMENT'],
            name: 'type',
            when: answers =>
                answers.action === 'ADD' || answers.action === 'UPDATE',
        },
    ]);

    switch (answers.action) {
        case 'ADD':
            console.log('add');
            addNewDatabaseEntry(connection, answers);
            break;
        case 'VIEW':
            console.log('view');
            viewDatabaseEntries(connection, answers);
            break;
        case 'UPDATE':
            console.log('update');
            updateDatabaseEntry(connection, answers);
            break;
    }
}

//main function is invoked on start 
async function main() {

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'Delphinius1',
        database: 'employeeDB',
    });

    initiate(connection);
}

// invoke main on start
main();

//Rough breakdown of steps below:
//Create database based on README instructions -- DONE
//Create DB connection -- DONE
//ask user if they want to view or update db entries -- DONE
// Add departments, roles, employees -- DONE

// View (departments, roles, employees)
//prompt user to choose dept, role or employee
//based on user choice, get list of depts, roles or employees from database

// Update employee roles
//prompt user for name of employee to update
//ask them which field they want to update (first name, last name, manager name, role title)
//prompt user to enter new value for that field
//update db entry with user input