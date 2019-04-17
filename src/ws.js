var app = require('./app');
var http = require('http').Server(app);
var io = require('socket.io')(http);

function ws() {
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
 
  var io = require('socket.io').listen(server);
  io.sockets.on('connection', function (socket) {

    console.log('user connected');

    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}

module.exports = ws;