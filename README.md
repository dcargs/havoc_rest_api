# havoc_rest_api
Havoc Communications REST API / STUN Server

# API End-Points
* [User](#user---top)

# User - [Top](#api-end-points)
## /user/login -> POST
### This function logs a user in and inserts their session_token into user_session
#### Things to send:
* username -> int(11)
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

## /user/check_session -> POST
### This function checks a sent session_token and username for a match in user_session. Used for checking authentication
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: OK}
* failure: { status: http_error_code, data: error_string }
