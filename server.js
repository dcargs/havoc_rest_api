var fs = require('fs'),
  https = require('https'),
  express = require('express'),
  // cookieParser = require('cookie-parser'),
  // session = require('express-session'),
  adminQuery = require('./app/mysql/admin_query.js'),
  bodyParser = require('body-parser'),
  port = 12345,
  app = express();

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
    let data = {
      route_called: req.path,
      ip_address: req.connection.remoteAddress,
      fk_username: req.body.username
    };

    await adminQuery.log_request(data);

    next();

  } else {
    next();
  }
});

app.use('/user', require('./app/user.js'));
app.use('/user_admin', require('./app/user_admin.js'));
// app.use('/app_logs', require('./app/app_logs.js'));
// app.use('/forklift', require('./app/forklift.js'));
// app.use('/branch', require('./app/branch.js'));
// app.use('/department', require('./app/department.js'));

app.get('/', function (req, res) {
  res.send('hello world')
});


https.createServer({
  key: fs.readFileSync('protected/server.key'),
  cert: fs.readFileSync('protected/server.cert'),
}, app).listen(port);

console.log("express server running on https://localhost:"+port);
