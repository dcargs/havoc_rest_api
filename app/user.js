var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var check_var = require('./globals/check_var');
var returnOBJ = require('./globals/global_return');
var http_codes = require('./globals/http_codes');
var input_standard = require('./globals/input_standardization');
var user_query = require('./mysql/user_query');
var hash_functions = require('./globals/hash_functions');
var fs = require('fs');

// ********* DANGEROUS, DO NOT LEAVE IN FOR PROD ***********************
// router.post('/bcrypt', async function(req, res){
//   var password = req.body.password;
//   var saltRounds = 16;
//
//   bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(password, salt, function(err, hash) {
//       res.send(JSON.stringify({'hash':hash}));
//     });
//   });
//
// });
// *******************

router.post('/login', async function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  if(check_var.check_var(username) && check_var.check_var(password)){
    try {
      var hashed_password = await user_query.get_user_password(username);
      if(hashed_password){
        bcrypt.compare(password, hashed_password, async function(err, flag) {
          if(err){
            console.log(err);
            returnOBJ.status = 400;
            returnOBJ.data = http_codes["400"];
            res.send(returnOBJ);
          } else {
            if(flag){
              let session_token = hash_functions.genRandomString(254);
              let user_status = await user_query.store_user_session_token(username, session_token);
              res.send(user_status);
            } else {
              console.log("password did not match for username: "+username);
              returnOBJ.status = 401;
              returnOBJ.data = http_codes["401"];
              res.send(returnOBJ);
            }
          }
        });
      } else {
        returnOBJ.status = 400;
        returnOBJ.data = http_codes["400"];
        res.send(returnOBJ);
      }
    } catch (e) {
      console.log("error:" + e);
      console.trace();
      returnOBJ.status = 400;
      returnOBJ.data = http_codes["400"];
      res.send(returnOBJ);
    }
  } else {
    returnOBJ.status = 400;
    returnOBJ.data = http_codes["400"];
    res.send(returnOBJ);
  }

});

router.post('/logout', async function(req, res){
  let username = req.body.username;
  let session_token = req.body.session_token;

  if(check_var.check_var(username) && check_var.check_var(session_token)){
    try {
      let stored_session_token = await user_query.get_user_session_token(username);
      if(stored_session_token && stored_session_token.length == 1){
        if(stored_session_token == session_token){
          // log the user out
          let response = await user_query.delete_user_session_token(username);
          if(response.affectedRows <= 0){
            console.log(response);
            returnOBJ.status = 500;
            returnOBJ.data = http_codes["500"];
            res.send(returnOBJ);
          } else {
            returnOBJ.status = 200;
            returnOBJ.data = http_codes["200"];
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

router.post('/check_status', async function(req, res){
  let username = req.body.username;
  let session_token = req.body.session_token;

  if(check_var.check_var(username) && check_var.check_var(session_token)){
    try {
      let stored_session_token = await user_query.get_user_session_token(username);
      if(stored_session_token){
        if(stored_session_token == session_token){
          returnOBJ.status = 200;
          returnOBJ.data = http_codes["200"];
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
