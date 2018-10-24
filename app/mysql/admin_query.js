var query = require('./query');
var bcrypt = require('bcrypt');


module.exports = {
  create_user: async function(user){
    return new Promise(async function(resolve, reject) {
      let hashed_password = await module.exports.hash_password(user.password);
      let query_statement = 'INSERT INTO user (email, username, first_name, last_name, password, fk_permission_code) VALUES (?,?,?,?,?,?)';
      let params = [user.email, user.username, user.first_name, user.last_name, hashed_password, user.fk_permission_code];

      let response = await query.query(query_statement, params);
      if(response.affectedRows == 1){
        resolve(response);
      } else {
        reject(response.message);
      }
    });
  },

  read_users: async function(){
    return new Promise(function(resolve, reject) {
      let query_statement = `SELECT user.email, user.username, user.first_name, user.last_name, user.fk_permission_code as permission_code, permission.permission_level
                             FROM user INNER JOIN permission ON permission.permission_code = user.fk_permission_code`;
      let params = [];

      let result = query.query(query_statement, params);
      if(result){
        resolve(result);
      } else {
        reject(result.message);
      }
    });
  },

  update_user: async function(fields){
    // fields can be any of the columns in the user table except username
    return new Promise(async function(resolve, reject) {
      // start to build query
      var query_statement = 'UPDATE user';
      var final_piece = ' WHERE username = ?';
      var final_param = fields.username;
      var params = [];
      // get all possible field values
      var column_names = await query.column_names('user');
      column_names = Object.keys(column_names[0]);

      let keys = Object.keys(fields);
      let values = Object.values(fields);
      var flag = true;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = values[i];
        for (var j = 0; j < column_names.length; j++) {
          var column_name = column_names[j];
          if(column_name == key){
            if(key == 'username'){
              continue;
            } else {
              if(key == 'password'){
                value = await module.exports.hash_password(value);
              }
              if(i == 0 || flag){
                query_statement += ' SET ' + key + " = ?";
                flag = false;
              } else {
                query_statement += ', ' + key + " = ?";
              }
              params.push(value);
            }
          }
        }
      }
      query_statement += final_piece;
      params.push(final_param);

      let result = await query.query(query_statement, params);
      if(result){
        resolve(result.affectedRows);
      } else {
        reject(result.message);
      }

    });
  },

  read_permissions: async function(){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'SELECT * FROM permission';
      let params = [];

      let result = await query.query(query_statement, params);
      if(result){
        resolve(result);
      } else {
        reject(result.message);
      }
    });
  },

  hash_password: async function(password){
    return new Promise(function(resolve, reject) {
      const saltRounds = 16;

      bcrypt.genSalt(saltRounds, async function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
          if(err){
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });
    });
  },

  log_request: async function(data){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'INSERT INTO request_log (route_called, ip_address, fk_username, headers) VALUES (?, ?, ?, ?)';
      let params = [data.route_called, data.ip_address, data.fk_username, JSON.stringify(data.headers)];
      await query.query(query_statement, params);
      resolve();
    });
  }
};
