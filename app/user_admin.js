var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var check_var = require('./globals/check_var');
var returnOBJ = require('./globals/global_return');
var http_codes = require('./globals/http_codes');
var input_standard = require('./globals/input_standardization');
var user_query = require('./mysql/user_query');
var admin_query = require('./mysql/admin_query');
var hash_functions = require('./globals/hash_functions');

router.post('/create_user', async function(req, res){
  let username = req.body.username;
  let session_token = req.body.session_token;
  var new_user = req.body.new_user;
  try {
    new_user = JSON.parse(new_user);
  } catch (e) {
    console.log(e);
  }

  if(check_var.check_var(username) && check_var.check_var(session_token) && check_var.check_var(new_user)){
    try {
      let stored_session_token = await user_query.get_user_session_token(username);
      if(stored_session_token){
        if(stored_session_token == session_token){
          let request_user_details = await user_query.get_user_details(username);
          if(request_user_details.permission_level == 'Admin'){
            let result = await admin_query.create_user(new_user);
            console.log(result);
            if(result){
              returnOBJ.status = 200;
              returnOBJ.data = http_codes["200"];
              res.send(returnOBJ);
            } else {
              returnOBJ.status = 500;
              returnOBJ.data = http_codes["500"];
              res.send(returnOBJ);
            }
          } else {
            returnOBJ.status = 401;
            returnOBJ.data = http_codes["401"];
            res.send(returnOBJ);
          }
        } else {
          returnOBJ.status = 401;
          returnOBJ.data = http_codes["401"];
          res.send(returnOBJ);
        }
      } else {
        returnOBJ.status = 500;
        returnOBJ.data = http_codes["500"];
        res.send(returnOBJ);
      }
    } catch (e) {
      console.log("error:" + e);
      console.trace();
      returnOBJ.status = 500;
      returnOBJ.data = http_codes["500"];
      res.send(returnOBJ);
    }
  } else {
    returnOBJ.status = 400;
    returnOBJ.data = http_codes["400"];
    res.send(returnOBJ);
  }
});


//Returns the router as a useable variable to server.js
module.exports = router;
