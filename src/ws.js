var app = require('./app');
var http = require('http').Server(app);
var socketio = require('socket.io')(http);
var connection = require('./mysqlConnection');

function ws() {
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  var io = socketio.listen(server);
  var store = {};

  io.on('connection', function (socket) {
    socket.on('join', function(post) {
      console.log('chat join');
      usrobj = {
        'room_id': post.room_id,
        'user_id': post.id,
        'nickname': post.nickname
      };
      console.log("post.room_id : " + post.room_id);
      store[post.id] = usrobj;
      socket.join(post.room_id);
    });
  
    socket.on('chat message', function(post) {
      console.log('chat message');
      console.log("room_id : " + store[post.id].room_id);
      console.log("chat message : " + post.msg);
      
      if (post.msg != "" || post.isStamp == 1) {
        connection.query('INSERT INTO post SET ?', {
          room_id: post.room_id,
          user_id: post.id,
          isstamp: post.isStamp,
          message: post.image,
          file: post.image
        });
        io.to(store[post.id].room_id).emit('chat message', post);
      }
    });

    socket.on('disconnect', function(post) {
      if (post.id) {
        var _roomid = store[post.id].room_id;
        socket.leave(_roomid);
        io.to(_roomid).emit('chat message', {
          id: post.id,
          name: store[post.id].nickname,
          text: '退出しました'
        });
        delete idstore[socket.id];
      }
    });
  });
}
    
module.exports = ws;
