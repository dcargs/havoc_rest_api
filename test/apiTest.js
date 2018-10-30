const request = require('supertest');
const app = require('../server.js');//reference to entire api application

//==================== /user/login API test ====================

/**
 * Testing user login endpoint
 */
 describe('POST /user/login', function () {
     let params = {
         "username": "test_user",
         "password": "test_password"
     }

     var isValidResponse = function(res) {
       res.body.status = "200";
     };

     it('respond with 200 successful', function (done) {
         this.timeout(6000);//takes ~4700 milliseconds for bcrypt to finish
         request(app)
             .post('/user/login')
             .send(params)
             .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .end((err, res) => {
                 if (err || res.body.status != 200){
                   throw new Error('Status Code: '+res.body.status)
                 }
                 done();
             });
     });
 });
