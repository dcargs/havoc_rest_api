const request = require('supertest');
const app = require('../server.js');//reference to entire api application

// Used throughout page for testing
const user = 'test_user';
const pass = 'test_password';

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
            .post('/user/logout')
            .send({
              username: user,
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

  //==================== /user/check_status API test ====================
  /**
   * Testing user/check_status
   */
   describe('POST /user/check_status', function () {
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
             .post('/user/check_status')
             .send({
               username: user,
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

   //==================== /user_admin/create_user API test ====================
   /**
    * Testing user_admin/create_user for Executive Admins
    */
    describe('POST /user_admin/create_user', function () {
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
        this.timeout(6000);
          request(app)
              .post('/user_admin/create_user')
              .send({
                username: user,
                session_token: session_token,
                new_user: JSON.stringify({
                  email: 'new_user@havoc.com',
                  username: 'new_user',
                  first_name: 'New',
                  last_name: 'User',
                  password: 'new_password',
                  fk_permission_code: '1'
                })
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

   //==================== /user_admin/update_user API test ====================
   /**
    * Testing user_admin/update_user for Executive Admins
    */
    describe('POST /user_admin/update_user', function () {
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
        this.timeout(6000);
          request(app)
              .post('/user_admin/update_user')
              .send({
                username: user,
                session_token: session_token,
                fields: JSON.stringify({
                  username: 'new_user',
                  first_name: 'New',
                  last_name: 'User',
                  password: 'new_password'
                })
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

     //==================== /user_admin/delete_user API test ====================
     /**
      * Testing user_admin/get_all_users for Executive Admins
      */
      describe('POST /user_admin/delete_user', function () {
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
                .post('/user_admin/delete_user')
                .send({
                  username: 'test_user',
                  session_token: session_token,
                  delete_user: 'new_user'
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

      //==================== /user_admin/get_request_logs API test ====================
      /**
       * Testing user_admin/get_request_logs for Executive Admins
       */
       describe('POST /user_admin/get_request_logs', function () {
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
                 .post('/user_admin/get_request_logs')
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

     //==================== /permission_admin/get_permissions API test ====================
     /**
      * Testing permission_admin/get_permissions for Executive Admins
      */
      describe('POST /permission_admin/get_permissions', function () {
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
                .post('/permission_admin/get_permissions')
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
