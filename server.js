const mysql = require('mysql2/promise');
const table = require('console.table');
const inquirer = require('inquirer');

//Add a new database entry
async function addNewDatabaseEntry(connection, answers) {
    console.log('add', answers);

    //Case depends on whether the user chose to update a department, role or employee
    switch (answers.type) {
        case 'DEPARTMENT':
            //prompt user for department name
            const newDepartment = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Department name:',
                    name: 'name',
                },
            ]);

            try {
                //Insert the new department into the database
                const results = await connection.query(
                    'INSERT INTO departments (department_name) VALUES (?)',
                    [newDepartment.name],
                );
                //log how many entries have been added (sanity check)
                console.log('Entries added:', results[0].affectedRows);
            } catch (error) {
                console.error(error);
            }
            break;

        case 'ROLE':
            //Need to add what department the role belongs to. In order to do that, first have to get current departments from database
            let departmentsObject = await connection.query(
                'SELECT * from departments'
            );
            //Map query results into an array. This will be used for "choices" in one of the Inquirer prompts
            //As per Inquirer documentation, "choices" can take an object containing a name and a value. The name gets displayed to the user, and the value is saved in the answers object
            let departmentsArray = departmentsObject[0].map(item => ({
                name: item.department_name,
                value: item.department_id,
            }));
            //Prompt for role title, department it is associated with, and salary
            const newRole = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Role title:',
                    name: 'title',
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
                },
            ]);

            try {
                //Insert the new role into the database
                const results = await connection.query(
                    'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
                    [newRole.title, newRole.salary, newRole.dept],
                );
                //log how many entries have been added (sanity check)
                console.log('Entries added:', results[0].affectedRows);
            } catch (error) {
                console.error(error);
            }
            break;

        case 'EMPLOYEE':
            //get all roles from database
            let rolesObject = await connection.query('SELECT * from roles');

            //map query results into an array
            let rolesArray = rolesObject[0].map(item => ({
                name: item.title,
                value: item.role_id,
            }));

            //get all managers from database
            let managersObject = await connection.query(
                'SELECT * from employees WHERE manager_status = 1'
            );

            //map query results to array
            let managerArray = managersObject[0].map(item => ({
                name: `${item.first_name} ` + `${item.last_name}`,
                value: item.employee_id,
            }));

            //prompt for first name, last name, role, whether they ARE a manager, whether they HAVE a manager, and if so what the manager's name is
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
                        return newEmployee.managerStatus === true;
                    },
                },
                {
                    type: 'list',
                    message: 'Manager:',
                    choices: managerArray,
                    name: 'manager',
                    when(newEmployee) {
                        return newEmployee.hasManager === true;
                    },
                },
            ]);

            try {
                //Insert the new employee into the database
                const results = await connection.query(
                    'INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status) VALUES (?, ?, ?, ?, ?)',
                    [
                        newEmployee.firstName,
                        newEmployee.lastName,
                        newEmployee.role,
                        newEmployee.manager,
                        newEmployee.managerStatus,
                    ]
                );
                //log how many entries have been added (sanity check)
                console.log('Entries added:', results[0].affectedRows);
            } catch (error) {
                console.error(error);
            }
            break;
    }
    connection.end();
}

function updateDatabaseEntry(connection, answers) {
    console.log('update', answers);
    connection.end();
}

function viewDatabaseEntries(connection, answers) {
    console.log('view', answers);
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
