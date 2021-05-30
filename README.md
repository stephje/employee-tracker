# employee-tracker

## Description

A Content Management System (CMS) for managing a company's employees using node, inquirer, and MySQL.


## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Notes](#notes)
-   [Questions](#questions)
-   [Walkthrough](#walkthrough)


## Installation

NOTE: This application requires node.js to be installed. 
To check if you have node.js installed, type "node -v" in a bash terminal (if you see a version number returned, then node is installed)

1. Open a bash terminal and navigate to the employee-tracker folder
2. Run  ```run npm -i``` to install dependencies
3. Update ".env.EXAMPLE" file and rename to ".env"


## Usage

1. Open a bash terminal and navigate to the employee-tracker folder
2. Run  ```npm start``` to initialize program

## Notes

### Credits

Design of validate option for salary in Inquirer.js prompts had to work around significant limitations outlined in [Inquirer.js Issue #866](https://github.com/SBoudrias/Inquirer.js/issues/866). 

A number of different function designs for the validate option were attempted, however only the implementation suggested as a workaround in the linked issue thread was successful. As such, that solution/workaround was implemented (credit to GitHub user [letanure](https://github.com/letanure)). 

### For Future Development

Add functionality to:
-   Update employee managers
-   View employees by manager
-   Delete departments, roles, and employees
-   View the total utilized budget of a department

Refactor: 
- Convert SQL queries to functions and move to separate file, possibly using a constructor function or class

## Questions

For any questions pertaining to this project, please reach out via any of the contact methods listed below.
Please ensure that you include the name of this project ("employee-tracker") in any communications.

-   [GitHub](https://github.com/stephje)
-   [Email](mailto:s.jenkins3018@gmail.com)


## Walkthrough

