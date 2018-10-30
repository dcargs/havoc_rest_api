var db = require('../../protected/connection');

module.exports = {
  query: async function(query, params){
    return new Promise(function(resolve, reject) {
      db.query(query, params, function(err, rows){
        if(err){
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  column_names: async function(table){
    return new Promise(function(resolve, reject) {
      let query = 'SELECT * FROM '+table;

      db.query(query, function(err, rows){
        if(err){
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
