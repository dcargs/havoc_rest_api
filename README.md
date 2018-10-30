# havoc_rest_api
Havoc Communications REST API / STUN Server

# Contents
* [API End-Points](#api-end-points)
* [Unit Testing](#unit-testing---top)

# API End-Points
* [Permission Admin](#permission-admin---top)
* [User Admin](#user-admin---top)
* [User](#user---top)

# Permission Admin - [Top](#contents)
## /permission_admin/get_permissions -> POST
### This function returns all permissions -> ADMIN ONLY
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: [{ "permission_code": ,"permission_level": }, ...] }
* failure: { status: http_error_code, data: error_string }

# User Admin - [Top](#contents)
## /user_admin/create_user -> POST
### This function creates a user -> ADMIN ONLY
#### Things to send:
* username -> string
* session_token -> string
* new_user -> JSON -> {"email": "test@havoc.com", "username": "test", "first_name": "Test", "last_name": "McGee", "password": "1234", "fk_permission_code": "1" }
#### Returns:
* success: { status: 200, data: { "OK" } }
* failure: { status: http_error_code, data: error_string }

## /user_admin/get_all_users -> POST
### This function returns all users -> ADMIN ONLY
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: [{ "email": ,"username": ,"first_name": ,"last_name": ,"permission_code": , "permission_level": }, ...] }
* failure: { status: http_error_code, data: error_string }

## /user_admin/update_user -> POST -> ADMIN ONLY
### This function updates a given user for any of the following properties:
* `email`
* `first_name`
* `last_name`
* `password`
* `fk_permission_code`
#### Things to send: YOU MUST SEND THE `username` OF THE USER TO BE UPDATED UNALTERED OTHERWISE IT WILL FAIL
* username -> string
* session_token -> string
* fields -> JSON eg -> {"username": "test", "password": "123456", "email": "new_email@test.com"}
#### Returns:
* success: { status: 200, data: { "OK" } }
* failure: { status: http_error_code, data: error_string }

## /user_admin/delete_user -> POST -> ADMIN ONLY
### This function deletes a user
#### Things to send:
* username -> string
* session_token -> string
* delete_user -> string
#### Returns:
* success: { status: 200, data: { "OK" } }
* failure: { status: http_error_code, data: error_string }

# User - [Top](#contents)
## /user/login -> POST
### This function logs a user in and inserts their session_token into user_session
#### Things to send:
* username -> string
* password -> string
#### Returns:
* success: { status: 200, data: { session_token: <string>, username: <string>, first_name: <string>, last_name: <string>, fk_permission_code: <int>, permission_level: <string> } }
* failure: { status: http_error_code, data: error_string }

## /user/logout -> POST
### This function logs a user out by deleting their entry in user_session
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: { "OK" } }
* failure: { status: http_error_code, data: error_string }

## /user/check_status -> POST
### This function checks a sent session_token and username for a match in user_session. Used for checking authentication
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: OK}
* failure: { status: http_error_code, data: error_string }

# Unit Testing - [Top](#contents)
All routes that are created are put through testing using the [supertest](https://www.npmjs.com/package/supertest) module. All tests are within the test folder in the root of the project directory.
### How to run:
 * In the root directory of this project run `npm test`
### Benefits:
 * Rapid development of API functionality
 * Quick tests to new code
 * Easy extra-ordinary input testing
