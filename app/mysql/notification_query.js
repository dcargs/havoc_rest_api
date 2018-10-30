var query = require('./query');
var message_query = require('./message_query');

module.exports = {
  get_user_notifications: async function(username){
    return new Promise(async function(resolve, reject) {
      var query_statement = `SELECT notification.id, notification.fk_receiver_username, notification.fk_sender_username, notification.fk_notification_type_id, notification_type.description, notification_type.table_location
                             FROM notification
                             JOIN notification_type ON notification.fk_notification_type_id = notification_type.id
                             WHERE fk_receiver_username = ?`;
      var params = [username];

      try {
        var general_result = await query.query(query_statement, params);
        var meta = await module.exports.build_notification_meta(general_result);

        var notification_data = {
          notifications: {
            meta: meta,
            overview: general_result
          }
        }

        for (var i = 0; i < general_result.length; i++) {
          var table_name = general_result[i].table_location;
          var notification_id = general_result[i].id;

          if(table_name == "message_notification"){
            query_statement = `SELECT * FROM message_notification
                               JOIN message ON message.id = message_notification.fk_message_id
                               WHERE message_notification.fk_notification_id = ?`;
          } else if(table_name == "friend_notification"){
            query_statement = `SELECT fk_notification_id, fk_receiver_username, fk_sender_username, sent_date, message, accepted FROM friend_notification
                               JOIN notification ON notification.id = friend_notification.fk_notification_id
                               WHERE friend_notification.fk_notification_id = ?`;
          } else {
            query_statement = 'SELECT * FROM '+table_name+' WHERE fk_notification_id = ?';
          }

          params = [notification_id];

          try {
            var result = await query.query(query_statement, params);
            if(notification_data.notifications[table_name] == undefined){
              notification_data.notifications[table_name] = result;
            } else {
              notification_data.notifications[table_name].push(result[0]);
            }
          } catch (e) {
            reject(e);
          }
        }
        resolve(notification_data);
      } catch (e) {
        reject(e);
      }
    });
  },
  get_notification_types: async function(){
    return new Promise(async function(resolve, reject) {
      let query_statement = 'SELECT * FROM notification_type';
      let params = [];
      try {
        let result = await query.query(query_statement, params);
        resolve(result);
      } catch (e) {
        reject(result);
      }
    });
  },

  build_notification_meta: async function(general_result){
    return new Promise(async function(resolve, reject) {
      var notification_types = await module.exports.get_notification_types();
      var table_locations = {};

      for (var i = 0; i < notification_types.length; i++) {
        table_locations[notification_types[i].table_location+"_count"] = 0;
      }

      var table_locations_keys = Object.keys(table_locations);

      for (var i = 0; i < general_result.length; i++) {
        var notification_type = general_result[i].table_location;
        for (var j = 0; j < table_locations_keys.length; j++) {
          var comparison = notification_type + "_count";
          if(table_locations_keys[j] == comparison){
            table_locations[table_locations_keys[j]]++;
          }
        }
      }
      table_locations["overview_count"] = general_result.length;

      resolve(table_locations);
    });
  }

}
