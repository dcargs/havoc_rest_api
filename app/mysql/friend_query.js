var query = require('./query');

module.exports = {
  available_users: async function(username){
    return new Promise(async function(resolve, reject) {
      let query_statement = `SELECT username, first_name, last_name FROM user
                             WHERE user.username NOT IN(SELECT fk_username_1 FROM friend WHERE fk_username_1 = ? OR fk_username_2 = ?)
                             AND user.username NOT IN(SELECT fk_username_2 FROM friend WHERE fk_username_1 = ? OR fk_username_2 = ?)`;
      let params = [username, username, username, username];

      try {
        let result = await query.query(query_statement, params);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }
}
