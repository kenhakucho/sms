var express = require('express');
var router = express.Router();
var multer = require('multer');
var connection = require('../mysqlConnection');
var upload = multer({ dest: './public/images/uploads/' });

// /room/room_id
router.get('/:room_id', function(req, res, next) {
  console.log("GET room/:room_id")

  var userId  = req.session.user_id? req.session.user_id: 0;
  var roomId = req.params.room_id;

  connection.query('SELECT * FROM member WHERE room_id=? and user_id=? and enable=1 LIMIT 1',
            [roomId, userId], function(err, rows) {
    var enable = rows.length? rows[0].enable: false;
    console.log("userId  : " + userId);
    console.log("roomId  : " + roomId);
    console.log("enable  : " + enable)

    if (enable) {
      var roomQuery = 'SELECT * FROM room WHERE id = ' + roomId;
      var messageQuery = {
        sql: 'SELECT * FROM message LEFT JOIN user ON user.id=message.user_id ' 
             + ' WHERE message.room_id = ' + roomId + ' and message.enable=1 '
             + ' ORDER BY message.made ASC;',
        nestTables: '_'
      }

      console.log(roomQuery);
      console.log(messageQuery);

      connection.query(roomQuery, function(err, room) {
        connection.query(messageQuery, function(err, results) {
          res.render('room', {
            title: room[0].name,
            room: room[0],
            messageList: results
          });
        });
      });

    } else {
      console.log(roomQuery);
      res.redirect('/');
    }
  });    
});

// 投稿
router.post('/:room_id', upload.single('image_file'), function(req, res, next) {
  console.log("POST room/:room_id")
  console.log("uploads : " + req.file);
  console.log("name : " + req.name);
    
  var userId  = req.session.user_id? req.session.user_id: 0;
  var roomId  = req.params.room_id;
  var message = req.body.message;
  var file   = req.file.name;
  var isStamp = file? 1:0;

  connection.query('SELECT * FROM member WHERE room_id=? and user_id=? and enable=1 LIMIT 1',
            [roomId, userId], function(err, rows) {
    var enable = rows.length? rows[0].enable: false;
    console.log("enable  : " + enable)
    if (isUser) {
      console.log("userId  : " + userId);
      console.log("roomId  : " + roomId);
      console.log("message : " + message);

      connection.query('INSERT INTO message SET ?', 
        {
          room_id: roomId,
          user_id: userId,
          isstamp: isStamp,
          message: message,
          file: file     
        }, function(err, rows) {
        console.log(rows);
        res.redirect('/room/' + roomId);
      });

    } else {
        res.redirect('/');
    }
  });
});

module.exports = router;


