var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var check_var = require('./globals/check_var');
var returnOBJ = require('./globals/global_return');
var http_codes = require('./globals/http_codes');
var input_standard = require('./globals/input_standardization');
var user_query = require('./mysql/user_query');
var notification_query = require('./mysql/notification_query');
var hash_functions = require('./globals/hash_functions');

// This route will return all the notifications for a given user
router.post('/get_notifications', async function(req, res){
  let username = req.body.username;
  let session_token = req.body.session_token;

  if(check_var.check_var(username) && check_var.check_var(session_token)){
    try {
      let stored_session_token = await user_query.get_user_session_token(username);
      if(stored_session_token){
        if(stored_session_token == session_token){
          // available_users is all the users you are not friends with
          let notifications = await notification_query.get_user_notifications(username);
          returnOBJ.status = 200;
          returnOBJ.data = notifications;
          res.send(returnOBJ);
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
