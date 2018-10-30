//NPM Module for MySQL Interactions
var mysql = require('mysql');
var os = require('os');

//Create connection variable that will be used throughout the
//api to talk to the database
let hostname = os.hostname();
let ec2_hostname = 'ip-172-31-28-100';
let dev_hostname = 'bakedkitty';

if(hostname == ec2_hostname || hostname == dev_hostname){//prod
  var connection = mysql.createConnection({
    host: '127.0.0.1', //127.0.0.1dev.baked.kitty
    user: 'havoc_user',
    password: 'ASDFasdf!QAZ1qaz',
    database: 'havoc'
  });
} else {//local dev
  var connection = mysql.createConnection({
    host: '10.0.0.9',
    user: 'havoc_user',
    password: 'ASDFasdf!QAZ1qaz',
    database: 'havoc'
  });
}



//try a connection to the MySQL server and throw an Error
//if the connection fails
connection.connect(function(err) {
  if (err) throw err
  else console.log('Database Connection Successful!')
});
// connection.query('USE bakery');

//Returns the connection as a useable variable
module.exports = connection;
