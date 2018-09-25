-- Database: havoc
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
