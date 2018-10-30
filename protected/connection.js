//NPM Module for MySQL Interactions
var mysql = require('mysql');

//Create connection variable that will be used throughout the
//api to talk to the database
var connection = mysql.createConnection({
  host: 'dev.baked.kitty', //127.0.0.1
  user: 'havoc_user',
  password: 'ASDFasdf!QAZ1qaz',
  database: 'havoc'
});

//try a connection to the MySQL server and throw an Error
//if the connection fails
connection.connect(function(err) {
  if (err) throw err
  else console.log('Database Connection Successful!')
});
// connection.query('USE bakery');

//Returns the connection as a useable variable
module.exports = connection;
