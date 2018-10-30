var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var check_var = require('./globals/check_var');
var returnOBJ = require('./globals/global_return');
var http_codes = require('./globals/http_codes');
var input_standard = require('./globals/input_standardization');
var user_query = require('./mysql/user_query');
var hash_functions = require('./globals/hash_functions');

//Returns the router as a useable variable to server.js
module.exports = router;
