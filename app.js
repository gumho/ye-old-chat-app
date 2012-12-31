var io = require('socket.io')
  , express = require('express')
  , stylus = require('stylus')

var app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(stylus.middleware({ 
  src: __dirname + '/public', 
  compile: function(str, path) {
    return stylus(str).set('filename', path);
  }
}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.render('index');
});

var server = require('http').createServer(app)
  , io = io.listen(server);

server.listen(8000);

io.sockets.on('connection', function (socket) {
  socket.on('register nick', function(nick) {
    socket.nickname = nick;
    socket.broadcast.emit('announcement', nick + ' connected');
  });

  socket.on('user message', function(msg) {
    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('disconnect', function() {
    if (!socket.nickname) return;
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
  })
});