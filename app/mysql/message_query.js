var query = require('./query');

module.exports = {
  get_message_by_id: async function(id){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'SELECT id, fk_sender_username AS `from`, content FROM message WHERE id = ?';
      let params = [id];

      try {
        let result = await query.query(query_statement, params);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }
}
