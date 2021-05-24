const inquirer = require('inquirer');
const connection = require('./db/connection');
const table = require('console.table');

//connect to database
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.message);
        return;
    } else {
        console.log('connected as id ' + connection.threadId);
        initiate();
    }
});

async function initiate() {

    const answers = await inquirer.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            choices: ['ADD', 'VIEW', 'UPDATE'],
            name: 'action',
        },
        {
            type: 'list',
            message: 'What type of entry do you want to add?',
            choices: ['EMPLOYEE', 'ROLE', 'DEPARTMENT'],
            name: 'type',
            when: answers =>
                answers.action === 'ADD' || answers.action === 'UPDATE',
        },
    ]);

    switch (answers.action) {
        case 'ADD':
            console.log('add');
            addNewDatabaseEntry(answers);
            break;
        case 'VIEW':
            console.log('view');
            viewDatabaseEntries(answers);
            break;
        case 'UPDATE':
            console.log('update');
            updateDatabaseEntry(answers);
            break;
    }
}

async function addNewDatabaseEntry(answers) {
    console.log(answers)

    switch (answers.type) {
        case 'EMPLOYEE':
            console.log('EMPLOYEE');
            addEmployee();
            break;
        case 'ROLE':
            console.log('ROLE');
            addRole();
            break;
        case 'DEPARTMENT':
            console.log('DEPARTMENT');
            addDepartment();
            break;
    }

    async function addEmployee() {
        //first name last name role manager
        const answers = await inquirer.prompt([
            {
                type: 'input',
                message: 'First Name:',
                name: 'firstname',
            },
            {
                type: 'input',
                message: 'Last Name:',
                name: 'lastname',
            },
            {
                type: 'input',
                message: 'Role Title:',
                name: 'role',
            },
            {
                type: 'input',
                message: 'Manager Name:',
                name: 'managername',
            },
        ]);

        connection.query(
            "INSERT INTO employees (first_name, last_name, roles, manager_id) VALUES (?, ?, ?, ?)",
            [answers.firstname, answers.lastname, answers.role, answers.managername],
            function (err, results) {
                if (err) {
                    console.error(err)
                } else {
                    console.log(results)
                    console.log("Employee added.")
                }
            }
        );

        connection.end();
    }
}

function updateDatabaseEntry(answers) { }

function viewDatabaseEntries(answers) { }

//Rough breakdown of steps below:1
// create database based on README instructions -- DONE
//Create DB connection -- DONE
//ask user if they want to view or update db entries -- DONE

// Add departments, roles, employees
//when creating a new employee:
//prompt for employee first name, last name, manager name, role title
//based on manager name, get manager id
//based on role title, get role id
//isert record into database

//when creating a new role
//prompt for role name and department name
//based on department name, get department ID
//insert record into database

// View (departments, roles, employees)
//prompt user to choose dept, role or employee
//based on user choice, get list of depts, roles or employees from database

// Update employee roles
//prompt user for name of employee to update
//ask them which field they want to update (first name, last name, manager name, role title)
//prompt user to enter new value for that field
//update db entry with user input
