-- Database: havoc
-- DROP USER havoc_user@localhost;
-- DROP USER havoc_user@'%';
-- CREATE USER 'havoc_user'@'localhost' IDENTIFIED BY 'ASDFasdf!QAZ1qaz';
-- CREATE USER 'havoc_user'@'%' IDENTIFIED BY 'ASDFasdf!QAZ1qaz';
-- GRANT ALL ON havoc.* TO 'havoc_user'@'localhost';
-- GRANT ALL ON havoc.* TO 'havoc_user'@'%';

CREATE TABLE `permission` (
  `permission_code` int(11) unsigned NOT NULL,
  `permission_level` varchar(48) NOT NULL,
  PRIMARY KEY(`permission_code`)
);

INSERT INTO `permission` (`permission_code`, `permission_level`)
VALUES
  (1, 'User'),
  (5, 'Moderator'),
  (10, 'Admin');

CREATE TABLE `user` (
  `email` varchar(255) NOT NULL,
  `username` varchar(48) NOT NULL,
  `first_name` varchar(48) NOT NULL,
  `last_name` varchar(48) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fk_permission_code` int(11) unsigned,
  FOREIGN KEY(`fk_permission_code`) REFERENCES `permission`(`permission_code`) ON UPDATE CASCADE ON DELETE SET NULL,
  UNIQUE(`username`),
  PRIMARY KEY(`email`)
);

CREATE TABLE `friend` (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  fk_username_1 varchar(48),
  fk_username_2 varchar(48),
  date_created datetime DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(fk_username_1) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(fk_username_2) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(id)
);

CREATE TABLE `notification_type` (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  description varchar(48) NOT NULL,
  table_location varchar(128) NOT NULL,
  PRIMARY KEY(id)
);

-- DROP TABLE IF EXISTS message_notification;
-- DROP TABLE IF EXISTS friend_notification;
-- DROP TABLE IF EXISTS notification;
CREATE TABLE `notification` (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  fk_receiver_username varchar(48),
  fk_sender_username varchar(48),
  fk_notification_type_id int(11) unsigned,
  sent_date datetime DEFAULT CURRENT_TIMESTAMP,
  receiver_read BOOLEAN DEFAULT 0,
  receiver_read_date datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(fk_receiver_username) REFERENCES user(username) ON UPDATE CASCADE,
  FOREIGN KEY(fk_sender_username) REFERENCES user(username) ON UPDATE CASCADE,
  FOREIGN KEY(fk_notification_type_id) REFERENCES notification_type(id) ON UPDATE CASCADE,
  PRIMARY KEY(id)
);

-- INSERT INTO `notification_type`(description, table_location) VALUES ('Friend Request', 'friend_notification');
CREATE TABLE `friend_notification` (
  fk_notification_id int(11) unsigned,
  message longtext,
  accepted BOOLEAN DEFAULT 0,
  FOREIGN KEY(fk_notification_id) REFERENCES notification(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(fk_notification_id)
);

CREATE TABLE `message` (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  fk_receiver_username varchar(48),
  fk_sender_username varchar(48),
  content longtext,
  FOREIGN KEY(fk_receiver_username) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(fk_sender_username) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(id)
);

-- INSERT INTO `notification_type`(description, table_location) VALUES ('New Message', 'message_notification');
CREATE TABLE `message_notification` (
  fk_notification_id int(11) unsigned,
  fk_message_id int(11) unsigned,
  FOREIGN KEY(fk_notification_id) REFERENCES notification(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(fk_message_id) REFERENCES message(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(fk_notification_id)
);

CREATE TABLE `request_log` (
  `log_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `datetime_requested` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(64) NOT NULL,
  `route_called` varchar(64) NOT NULL,
  `fk_username` varchar(48) DEFAULT NULL,
  `body` longtext,
  `headers` longtext,
  PRIMARY KEY (`log_id`)
);
