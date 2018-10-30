var query = require('./query');

module.exports = {
  get_user_details: async function(username){
    return new Promise(async function(resolve, reject) {
      var query_statement = `SELECT user.email, user.username, user.first_name, user.last_name, user.fk_permission_code as permission_code, permission.permission_level
                             FROM user INNER JOIN permission ON permission.permission_code = user.fk_permission_code`;
      if(username){
        query_statement += ` WHERE username = ?`;
        let params = [username];
        let response = await query.query(query_statement, params);
        if(response){
          resolve(response[0]);
        } else {
          reject(response);
        }
      } else {
        let params = [];
        let response = await query.query(query_statement, params);
        if(response){
          resolve(response[0]);
        } else {
          reject(response);
        }
      }

      // if(response){
      //   resolve(response[0]);
      // } else {
      //   reject(response);
      // }
    });
  },

  delete_user_session_token: async function(username){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'DELETE FROM user_session WHERE fk_username = ?';
      let params = [username];

      let response = await query.query(query_statement, params);
      if(response){
        resolve(response);
      } else {
        reject(response);
      }
    });
  },

  get_user_session_token: async function(username){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'SELECT session_token FROM user_session WHERE fk_username = ?';
      let params = [username];

      let response = await query.query(query_statement, params);
      if(response && response.length > 0){
        resolve(response[0].session_token);
      } else {
        reject(response);
      }
    });
  },

  get_user_password: async function(username){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'SELECT password FROM user WHERE username = ?';
      let params = [username];

      let response = await query.query(query_statement, params);
      if(response[0].password){
        resolve(response[0].password);
      } else {
        reject(response.message);
      }
    });
  },

  store_user_session_token: async function(username, session_token){
    return new Promise(async function(resolve, reject) {
      var query_statement = 'SELECT * FROM user_session WHERE fk_username = ?';
      var params = [username];

      var response = await query.query(query_statement, params);
      if(response){
        if(response.length == 0){
          // insert new session token
          query_statement = 'INSERT INTO user_session (session_token, fk_username) VALUES (?,?)';
          params = [session_token, username];
          response = await query.query(query_statement, params);
          // send back data needed for client
          query_statement = `SELECT user_session.session_token, user.username, user.first_name, user.last_name, user.fk_permission_code, permission.permission_level
                             FROM user INNER JOIN user_session ON user_session.fk_username = user.username INNER JOIN permission ON permission.permission_code = user.fk_permission_code WHERE username = ?`;
          params = [username];
          response = await query.query(query_statement, params);

          resolve(response[0]);
        } else {
          // delete all old session_tokens
          query_statement = 'DELETE FROM user_session WHERE fk_username = ?';
          params = [username];
          response = await query.query(query_statement, params);
          // insert new session_token
          query_statement = 'INSERT INTO user_session (session_token, fk_username) VALUES (?,?)';
          params = [session_token, username];
          response = await query.query(query_statement, params);
          // send back data needed for client
          query_statement = `SELECT user_session.session_token, user.username, user.first_name, user.last_name, user.fk_permission_code, permission.permission_level
                             FROM user INNER JOIN user_session ON user_session.fk_username = user.username INNER JOIN permission ON permission.permission_code = user.fk_permission_code WHERE username = ?`;
          params = [username];
          response = await query.query(query_statement, params);

          resolve(response[0]);
      }
    } else {
        reject(response);
      }
    });
  }
}
