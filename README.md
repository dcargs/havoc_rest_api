# havoc_rest_api
Havoc Communications REST API / STUN Server

# Contents
* [API End-Points](#api-end-points)
* [Unit Testing](#unit-testing---top)

# API End-Points
* [Permission Admin](#permission-admin---top)
  * [Get Permissions](#permission_adminget_permissions---post)
* [User Admin](#user-admin---top)
  * [Create User](#user_admincreate_user---post)
  * [Get All Users](#user_adminget_all_users---post)
  * [Update User](#user_adminupdate_user---post---admin-only)
  * [Delete User](#user_admindelete_user---post---admin-only)
  * [Get User Request Logs](#user_adminget_request_logs---post---admin-only)
* [User](#user---top)
  * [Login](#userlogin---post)
  * [Logout](#userlogout---post)
  * [Check Status](#usercheck_status---post)
* [Friend](#friend---top)
  * [Find Friends](#friendfind_friends---post)
* [Notification](#notification---top)
  * [Get Notifications](#notificationget_notifications---post)

# Permission Admin - [Top](#contents)
## /permission_admin/get_permissions -> POST
### This function returns all permissions -> ADMIN ONLY
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: [{ "permission_code": ,"permission_level": }, ...] }
* failure: { status: http_error_code, data: error_string }
```    
{
    "permission_code": 1,
    "permission_level": "User"
},
{
    "permission_code": 5,
    "permission_level": "Moderator"
},
{
    "permission_code": 10,
    "permission_level": "Admin"
}
```    

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
* success: { status: 200, data: JSON_data }
* failure: { status: http_error_code, data: error_string }
```    
{
    "status": 200,
    "data": [
        {
            "email": "cargilldevin@gmail.com",
            "username": "dcargill",
            "first_name": "Devin",
            "last_name": "Cargill",
            "permission_code": 10,
            "permission_level": "Admin"
        },
        {
            "email": "david.erik.auger@gmail.com",
            "username": "david",
            "first_name": "David",
            "last_name": "Auger",
            "permission_code": 10,
            "permission_level": "Admin"
        },
        {
            "email": "dc23b@mail.missouri.edu",
            "username": "dc23b",
            "first_name": "Devin",
            "last_name": "Cargill",
            "permission_code": 1,
            "permission_level": "User"
        },
        {
            "email": "haydenhaddock1@gmail.com",
            "username": "hayden",
            "first_name": "Hayden",
            "last_name": "Haddock",
            "permission_code": 10,
            "permission_level": "Admin"
        }
    ]
}
```    

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

## /user_admin/get_request_logs -> POST -> ADMIN ONLY
### This function returns all the request logs over the specified range
#### Things to send:
* username -> string
* session_token -> string
* range -> int -> OPTIONAL
#### range Possible values:
* 1 -> last 24 hours
* 7 -> last 7 days
* 30 -> last 30 days
* nothing -> last 60 days
#### Returns:
* success: { status: 200, data: JSON_data }
* failure: { status: http_error_code, data: error_string }
```    
{
    "status": 200,
    "data": [
        {
            "log_id": 305,
            "datetime_requested": "2018-10-30T16:57:13.000Z",
            "ip_address": "::ffff:10.0.0.22",
            "route_called": "/user_admin/get_request_logs",
            "fk_username": "dcargill",
            "body": "{\"username\":\"dcargill\",\"session_token\":\"be2d0fa229661288b452994a8921264a7b8fd9ea749b0aced7db791de1da41c10c19d5ebc4eba75756b910f7a0ff811c9a409deafb7e2019703e3e0a8c9cfc7cafe4675da76b53f95d15f4fd05c8d16c7b8df3670c58f14d6388a24144764713f9ca4b7a20fad1db832160eb73c6deb5bf07b0811ef731a18833293693606d\",\"range\":\"30\"}",
            "headers": "\"keep-alive\""
        }, ...
```     

# User - [Top](#contents)
## /user/login -> POST
### This function logs a user in and inserts their session_token into user_session. This will also return the user who successfully logged in notifications. Sample response below.
#### Things to send:
* username -> string
* password -> string
#### Returns:
* success: { status: 200, data: JSON_data }
* failure: { status: http_error_code, data: error_string }
```    
{
    "status": 200,
    "data": {
        "user_status": {
            "session_token": "e74eec8b591baf282854a391135dcb0889e7da441dfb95c7c52ef385af7e841a45214a0fbcece3f44dd8ca116f73d626f686c427e65c560e7d5a70eb0f38ef588a584703d342b942beca1e233b8ecc9d1869e6cba39a71a52339bf2cc8b2db67128a407786216b95d5f757239545c7777cbbe85550362ce495ce35f861313a",
            "username": "dcargill",
            "first_name": "Devin",
            "last_name": "Cargill",
            "fk_permission_code": 10,
            "permission_level": "Admin"
        },
        "notifications": {
            "notifications": {
                "meta": {
                    "friend_notification_count": 1,
                    "message_notification_count": 1,
                    "overview_count": 2
                },
                "overview": [
                    {
                        "id": 1,
                        "fk_receiver_username": "dcargill",
                        "fk_sender_username": "dc23b",
                        "fk_notification_type_id": 1,
                        "description": "Friend Request",
                        "table_location": "friend_notification"
                    },
                    {
                        "id": 2,
                        "fk_receiver_username": "dcargill",
                        "fk_sender_username": "dc23b",
                        "fk_notification_type_id": 2,
                        "description": "New Message",
                        "table_location": "message_notification"
                    }
                ],
                "friend_notification": [
                    {
                        "fk_notification_id": 1,
                        "fk_receiver_username": "dcargill",
                        "fk_sender_username": "dc23b",
                        "sent_date": "2018-10-31T03:37:52.000Z",
                        "message": "lets be friends",
                        "accepted": 0
                    }
                ],
                "message_notification": [
                    {
                        "fk_notification_id": 2,
                        "fk_message_id": 1,
                        "id": 1,
                        "fk_receiver_username": "dcargill",
                        "fk_sender_username": "dc23b",
                        "content": "why haven't you accepted my friend request yet"
                    }
                ]
            }
        }
    }
}
```    

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

# Friend - [Top](#contents)
## /friend/find_friends -> POST
### This function returns all the users the requestor is not friends with. Use this to show a user who they can send friend requests to.
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: JSON_data }
* failure: { status: http_error_code, data: error_string }
```    
{
    "status": 200,
    "data": [
        {
            "username": "david",
            "first_name": "David",
            "last_name": "Auger"
        },
        {
            "username": "hayden",
            "first_name": "Hayden",
            "last_name": "Haddock"
        }
    ]
}
```    

# Notification - [Top](#contents)
## /notification/get_notifications -> POST
### This function returns all of a user's notifications in a JSON object that contains an overview section and the specific notification sections that are present for that user. See the sample response below for an example.
#### Things to send:
* username -> string
* session_token -> string
#### Returns:
* success: { status: 200, data: JSON_data }
* failure: { status: http_error_code, data: error_string }
```    
{
    "status": 200,
    "data": {
        "notifications": {
            "meta": {
                "friend_notification_count": 1,
                "message_notification_count": 1,
                "overview_count": 2
            },
            "overview": [
                {
                    "id": 1,
                    "fk_receiver_username": "dcargill",
                    "fk_sender_username": "dc23b",
                    "fk_notification_type_id": 1,
                    "description": "Friend Request",
                    "table_location": "friend_notification"
                },
                {
                    "id": 2,
                    "fk_receiver_username": "dcargill",
                    "fk_sender_username": "dc23b",
                    "fk_notification_type_id": 2,
                    "description": "New Message",
                    "table_location": "message_notification"
                }
            ],
            "friend_notification": [
                {
                    "fk_notification_id": 1,
                    "fk_receiver_username": "dcargill",
                    "fk_sender_username": "dc23b",
                    "sent_date": "2018-10-31T03:37:52.000Z",
                    "message": "lets be friends",
                    "accepted": 0
                }
            ],
            "message_notification": [
                {
                    "fk_notification_id": 2,
                    "fk_message_id": 1,
                    "id": 1,
                    "fk_receiver_username": "dcargill",
                    "fk_sender_username": "dc23b",
                    "content": "why haven't you accepted my friend request yet"
                }
            ]
        }
    }
}
```    

# Unit Testing - [Top](#contents)
All routes that are created are put through testing using the [supertest](https://www.npmjs.com/package/supertest) module. All tests are within the test folder in the root of the project directory.
### How to run:
 * In the root directory of this project run `npm test`
### Benefits:
 * Rapid development of API functionality
 * Quick tests to new code
 * Easy extra-ordinary input testing
### Example test:
The below test example will try to login as `test_user` and get all the users. This function requires Admin privileges so depending on the privilege level of `test_user` it will pass or fail.
```    
//==================== /user_admin/get_all_users API test ====================
/**
 * Testing user_admin/get_all_users for Executive Admins
 */
 describe('POST /user_admin/get_all_users', function () {
   var session_token;
   before(function(done) {
     this.timeout(6000);
     request(app)
     .post('/user/login')
     .send({
       username: user,
       password: pass
     })
     .end(function(err, res) {
       if (err) throw err;
       session_token = res.body.data.session_token;
       done();
     });
   });

   it('respond with 200 successful', function (done) {
       request(app)
           .post('/user_admin/get_all_users')
           .send({
             username: 'test_user',
             session_token: session_token
           })
           .set('Accept', 'application/json')
           .expect('Content-Type', /json/)
           .end((err, res) => {
               if (err || res.body.status != 200){
                 throw new Error('Status Code: '+res.body.status)
                 done();
               } else {
                 done();
               }
           });
   });
 });
 ```    
