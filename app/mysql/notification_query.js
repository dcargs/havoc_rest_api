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
        var notification_data = {
          notifications: {
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
  }
}
