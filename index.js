const inquirer = require("inquirer");
const connection = require("./db/connection");
const table = require("console.table")

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

function initiate() {
    console.log("success");
    connection.end();
}

//Rough breakdown of steps below: 
// create database based on README instructions -- DONE

//Create DB connection -- DONE

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

//ask user if they want to view or update db entries

// View (departments, roles, employees)
    //prompt user to choose dept, role or employee
    //based on user choice, get list of depts, roles or employees from database

// Update employee roles
    //prompt user for name of employee to update
    //ask them which field they want to update (first name, last name, manager name, role title)
    //prompt user to enter new value for that field
    //update db entry with user input

