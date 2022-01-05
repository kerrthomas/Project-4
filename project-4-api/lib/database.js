const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tk!122598',
    database: 'project4',
    waitForConnections: true 
});

module.exports = {db}