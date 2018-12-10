var fs = require('fs'),
  http = require('http'),
  express = require('express'),
  // cookieParser = require('cookie-parser'),
  // session = require('express-session'),
  adminQuery = require('./app/mysql/admin_query.js'),
  bodyParser = require('body-parser'),
  socketIO = require('socket.io'),
  os = require('os'),
  express_port = 12345,
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
      ip_address: req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip,
      fk_username: req.body.username,
      headers: req.headers.connection,
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
app.use('/friend', require('./app/friend.js'));
app.use('/notification', require('./app/notification.js'));
app.use('/message', require('./app/message.js'));
// app.use('/signal', require('./app/signal.js'));

app.get('/', function (req, res) {
  res.send('hello world')
});


http.createServer(app).listen(express_port);
console.log("express server running on http://localhost:"+express_port);

//*********************** SuperTest TESTING in ./test/apiTest.js ******************************//
module.exports = app;//USED FOR SuperTest TESTING

//*********************** web socket stuff ***********************
var socket_port = 12346;
var socketApp = http.createServer().listen(socket_port);
var io = socketIO.listen(socketApp);
io.origins('havoc-communications.com:*');
console.log("socket.io signaling server running on http://localhost:"+socket_port);

io.sockets.on('connection', function(socket) {
  // console.log(socket);

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
    console.log(arguments);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    console.log(io.sockets.adapter.rooms[room]);
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
      console.log("CLIENTSINROOM: "+JSON.stringify(clientsInRoom));

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
      console.log("CLIENTSINROOM: "+JSON.stringify(clientsInRoom));
    } else { // max two clients
      socket.emit('full', room);
      console.log("CLIENTSINROOM: "+JSON.stringify(clientsInRoom));
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});
