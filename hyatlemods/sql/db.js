// mysql require
const mysql = require('mysql');

// connection configurations
const mc = mysql.createConnection({
    host: 'HOST',
    user: 'USER',
    password: 'PASSWORD',
    database: 'DATABASE'
});

mc.connect();

module.exports = mc
