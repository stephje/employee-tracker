require('dotenv').config();
const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employeeDB',
});

connection.connect();
connection.query = util.promisify(connection.query);

module.exports = connection;