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
  }
};
