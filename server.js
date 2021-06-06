const table = require('console.table');
const inquirer = require('inquirer');
const { displayRoles } = require('./src/queries.js');
const Queries = require('./src/queries.js')

// add a new database entry
async function addNewDatabaseEntry(answers) {

    // case depends on whether the user chose to update a department, role or employee
    switch (answers.type) {
        case 'DEPARTMENT':
            // prompt user for department name
            const newDepartment = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'Department name:',
                    name: 'name',
                },
            ]);

            try {
                // insert the new department into the database
                const results = await Queries.addDepartment([newDepartment.name]);
                // log how many entries have been added (sanity check)
                console.log('Entries added:', results.affectedRows);
            } catch (error) {
                console.error(error);
            }
            break;

        case 'ROLE':
            // need to add what department the role belongs to. In order to do that, first have to get current departments from database
            let departmentsObject = await Queries.getDepartments();
            // map query results into an array. This will be used for "choices" in one of the Inquirer prompts
            // as per Inquirer documentation, "choices" can take an object containing a name and a value. The name gets displayed to the user, and the value is saved in the answers object
            let departmentsArray = departmentsObject.map(item => ({
                name: item.department_name,
                value: item.department_id,
            }));
            // prompt for role title, department it is associated with, and salary
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
                    validate(value) {
                        // workaround for inquirer.js issue #866, see README
                        let booleanValue = !isNaN(value)
                        if (booleanValue === true) {
                            return true;
                        }
                        return 'Please enter salary as a number';
                    },
                },
            ]);

            try {
                // Insert the new role into the database
                const results = await Queries.addRole([newRole.title, newRole.salary, newRole.dept]);
                // log how many entries have been added (sanity check)
                console.log('Entries added:', results.affectedRows);
            } catch (error) {
                console.error(error);
            }
            break;

        case 'EMPLOYEE':
            // get all roles from database
            let rolesObject = await Queries.getRoles();

            // map query results into an array
            let rolesArray = rolesObject.map(item => ({
                name: item.title,
                value: item.role_id,
            }));

            // get all managers from database
            let managersObject = await Queries.getManagers();

            // map query results to array
            let managerArray = managersObject.map(item => ({
                name: `${item.first_name} ${item.last_name}`,
                value: item.employee_id,
            }));

            // prompt for first name, last name, role, whether they ARE a manager, whether they HAVE a manager, and if so what the manager's name is
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
                    when: newEmployee =>
                        newEmployee.managerStatus === true,
                },
                {
                    type: 'list',
                    message: 'Please select employee\'s Manager:',
                    choices: managerArray,
                    name: 'manager',
                    when: newEmployee => (newEmployee.managerStatus === false || newEmployee.hasManager === true),
                },
            ]);

            try {
                // insert the new employee into the database
                const results = await Queries.addEmployee([
                    newEmployee.firstName,
                    newEmployee.lastName,
                    newEmployee.role,
                    newEmployee.manager,
                    newEmployee.managerStatus,
                ]);
                
                // log how many entries have been added (sanity check)
                console.log('Entries added:', results.affectedRows);
            } catch (error) {
                console.error(error);
            }
            break;
    };
    main();
}

// view database entries
async function viewDatabaseEntries(answers) {

    switch (answers.type) {
        case 'DEPARTMENT':
            try {
                // get whole department table from database
                const results = await Queries.displayDepartments();
                console.table(results);
            } catch (error) {
                console.error(error);
            }
            break;

        case 'ROLE':
            try {
                // get whole results table from database
                const results = await Queries.displayRoles();
                console.table(results);
            } catch (error) {
                console.error(error);
            }
            break;

        case 'EMPLOYEE':
            try {
                // get whole employee table from database
                const results = await Queries.displayEmployees();
                console.table(results);
            } catch (error) {
                console.error(error);
            }
            break;
    };
    main();
}

// update database entries
async function updateDatabaseEntry(connection, answers) {
    // get all roles from database
    let rolesObject = await Queries.getRoles();

    // map query results into an array
    let rolesArray = rolesObject.map(item => ({
        name: item.title,
        value: item.role_id,
    }));

    // get all roles from database
    let employeeObject = await Queries.getEmployees();

    // map query results into an array
    let employeeArray = employeeObject.map(item => ({
        name: `${item.first_name} ${item.last_name}`,
        value: item.employee_id,
    }));

    // prompt user to choose user to update and role to change to
    const newEmployeeRole = await inquirer.prompt([
        {
            type: 'list',
            choices: employeeArray,
            message: 'Which employee do you want to update?',
            name: 'employeeId',
        },
        {
            type: 'list',
            choices: rolesArray,
            message: 'Change to which role?',
            name: 'roleId',
        },
    ]);

    try {
        // update the employee role
        const results = await Queries.updateEmployeeRole([newEmployeeRole.roleId, newEmployeeRole.employeeId]);
        // log how many entries have been updated (sanity check)
        console.log('Entries updated:', results.affectedRows);
    } catch (error) {
        console.error(error);
    }

    main();
}

async function main() {
    // prompt user for what they want to do, and what time of entry to do it to
    const answers = await inquirer.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            choices: ['ADD', 'VIEW', 'UPDATE', 'QUIT'],
            name: 'action',
        },
        {
            type: 'list',
            message: 'What type of entry?',
            choices: ['EMPLOYEE', 'ROLE', 'DEPARTMENT'],
            name: 'type',
            when: answers => (answers.action === 'ADD' || answers.action === 'VIEW'),
        },
    ]);

    switch (answers.action) {
        case 'ADD':
            addNewDatabaseEntry(answers);
            break;
        case 'VIEW':
            viewDatabaseEntries(answers);
            break;
        case 'UPDATE':
            updateDatabaseEntry(answers);
            break;
        case 'QUIT':
            Queries.quit();
            break;
    }
}

// invoke main on start
main();