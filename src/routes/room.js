var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');
// var multer = require('multer');
// var upload = multer({ dest: './public/images/stamp/' });

// /room/room_id
router.get('/:room_id', function(req, res, next) {
  console.log("GET room/:room_id");

  var userId = req.session.user_id ? req.session.user_id : -1;
  var roomId = req.params.room_id;

  // roomCheck
  connection.query('SELECT * FROM member WHERE room_id=? and user_id=? and enable=1 LIMIT 1',
            [roomId, userId], function(err, rows) {
    var enable = rows.length? rows[0].enable: false;
    if (enable) {
      // get posts
      connection.query('SELECT * FROM room WHERE id = ?', roomId, function(err, room) {
        var postQuery = {
          sql: 'SELECT *, CASE WHEN curdate()=date(post.made) THEN DATE_FORMAT(post.made, "%k:%i") ELSE DATE_FORMAT(post.made, "%c月%e日 %k:%i") END AS madetime FROM post LEFT JOIN user ON user.id=post.user_id WHERE post.room_id = ? and post.enable=1 ORDER BY post.made ASC;',
          nestTables: '_'
        }
    
        connection.query(postQuery, roomId, function(err, posts) {
          console.log(posts);
        
          connection.query('SELECT * FROM stamp WHERE enable=1', function(err, stamp) {
            res.render('room', {
              title: room[0].name,
              room: room[0],
              postList: posts,
              stampList: stamp
            });
          });
        });
      });

  // roomCheck NG
  } else {
      res.redirect('/');
  }

  });    
});

// 投稿
/**
router.post('/:room_id', upload.single('image_file'), function(req, res, next) {
  console.log("POST room ---------------------------------------------");
  console.log("POST room/:room_id")
  console.log("image_file : " + req.image_file);
  console.log("message    : " + req.body.message);
    
  var userId  = req.session.user_id? req.session.user_id: -1;
  var roomId  = req.params.room_id;
  var message = req.body.message;
  var type = 0;
  var file    = '';
  if (req.image_file) {
    type = 1;
    file    = req.image_file.name;      
  } 

  // message check 
  if (type == 0 && message == "") {
      res.redirect('/room/' + roomId);
  } else {
    // roomCheck
    connection.query('SELECT * FROM member WHERE room_id=? and user_id=? and enable=1 LIMIT 1',
            [roomId, userId], function(err, rows) {
      var enable = rows.length? rows[0].enable: false;
      if (enable) {
        // post
        connection.query('INSERT INTO post SET ?', {
            room_id: roomId,
            user_id: userId,
            type: type,
            message: message,
            file: file     
          }, function(err, rows) {
            res.redirect('/room/' + roomId);
        });

      // roomCheck NG
      } else {
          res.redirect('/');
      }
    });
  }
});
**/
module.exports = router;


