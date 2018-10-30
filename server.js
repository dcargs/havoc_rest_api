var fs = require('fs'),
  http = require('http'),
  express = require('express'),
  // cookieParser = require('cookie-parser'),
  // session = require('express-session'),
  adminQuery = require('./app/mysql/admin_query.js'),
  bodyParser = require('body-parser'),
  port = 12345,
  app = express();

//const privateKey = fs.readFileSync('/etc/letsencrypt/live/havoc-communications.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/havoc-communications.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/havoc-communications.com/chain.pem', 'utf8');

// this allows cross origin access (you need this for mobile apps)
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);//uses the above cors function

app.use(bodyParser.urlencoded({ extended:true, limit: '500mb' }));
app.use(bodyParser.json({limit: '500mb'}));

// logs every request
app.use(async function(req, res, next) {
  if(req.body.username){
    // console.log(Object.keys(req));
    let data = {
      route_called: req.path,
      ip_address: req.headers['x-real-ip'];,
      fk_username: req.body.username,
      headers: req.headers,
      body: req.body
    };

    await adminQuery.log_request(data);

    next();

  } else {
    next();
  }
});

app.use('/user', require('./app/user.js'));
app.use('/user_admin', require('./app/user_admin.js'));
app.use('/permission_admin', require('./app/permission_admin.js'));

app.get('/', function (req, res) {
  res.send('hello world')
});

/*const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};*/

http.createServer(app).listen(port);

console.log("express server running on http://localhost:"+port);


//*********************** TESTING ******************************//
module.exports = app;//USED FOR TESTING
