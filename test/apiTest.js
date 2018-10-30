const request = require('supertest');
const app = require('../server.js');//reference to entire api application

 //==================== /user/logout API test ====================
 /**
  * Testing user logout endpoint
  */
  describe('POST /user/logout', function () {
    var session_token;
    before(function(done) {
      this.timeout(6000);
      request(app)
      .post('/user/login')
      .send({
        username: 'test_user',
        password: 'test_password'
      })
      .end(function(err, res) {
        if (err) throw err;
        session_token = res.body.data.session_token;
        done();
      });
    });

    it('respond with 200 successful', function (done) {
        request(app)
            .post('/user/logout')
            .send({
              "username": "test_user",
              "session_token": session_token
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
         username: 'test_user',
         password: 'test_password'
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
               "username": "test_user",
               "session_token": session_token
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
