# havoc_rest_api
Havoc Communications REST API / STUN Server

# API End-Points
* [Permission Admin](#permission-admin---top)
* [User Admin](#user-admin---top)
* [User](#user---top)

# Permission Admin - [Top](#api-end-points)
## /permission_admin/get_permissions -> POST
### This function returns all permissions -> ADMIN ONLY
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: [{ "permission_code": ,"permission_level": }, ...] }
* failure: { status: http_error_code, data: error_string }

# User Admin - [Top](#api-end-points)
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

# User - [Top](#api-end-points)
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
