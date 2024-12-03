const mysql = require('mysql2');

const sqlConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "forecast",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

module.exports = sqlConnection.promise();