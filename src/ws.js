var app = require('./app');
var http = require('http').Server(app);
var socketio = require('socket.io')(http);
var connection = require('./mysqlConnection');
var moment = require('moment');
var fs = require('fs');

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
           
      if (post.msg != "" || post.type == 1) {
        connection.query('INSERT INTO post SET ?', {
          'room_id': post.room_id,
          'user_id': post.id,
          'type': post.type,
          'message': post.msg,
          'file': post.image
        });
        post.made = moment().format('HH:mm');         
        io.to(store[post.id].room_id).emit('chat message', post);
      } else if (post.type == 2) {
        
        var writeFile = post.data.file;
        var filename = require('crypto').randomBytes(8).toString('hex');
        var writePath = './public/images/uploads/'+filename;

        var writeStream = fs.createWriteStream(writePath);

        writeStream.on('drain', function(){
          }).on('error', function (exception) {
            console.log("exception:"+exception);
          }).on('close', function () {
            connection.query('INSERT INTO post SET ?', {
              'room_id': post.room_id,
              'user_id': post.id,
              'type': post.type,
              'file': filename
            });
          }).on('pipe', function (src) {}); 
        writeStream.write(writeFile,'binary');
        writeStream.end();          
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
