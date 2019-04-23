var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');
var app = express();
var conf = require('../config.json')[app.get('env')];

/* GET home page. */
router.get('/', function(req, res, next) {

  var userId = req.session.user_id? req.session.user_id: -1;

  connection.query('SELECT id, room.name, room.icon FROM room WHERE user_id=? AND enable=1', [userId], function(err, roomList) {
    
    // userList
    connection.query('SELECT * FROM user WHERE enable=1', function(err, userList) {
      res.render('edit', {
        title: 'Aine',
        roomList: roomList,
        userList: userList
      });
    });
  });
});

router.get('/delete/:room_id', function(req, res, next) {
  var userId    = req.session.user_id? req.session.user_id: -1;
  var roomId = req.params.room_id;
    
  connection.beginTransaction(function(err) {
    console.log("beginTransaction"); 
    if (err) { throw err; }
    connection.query('UPDATE room SET enable=0 WHERE id=? AND user_id=?', [roomId, userId], function(err, result) {
      if (err) { 
        connection.rollback(function() {
          console.log("UPDATE room NG"); 
          throw err;
        });
      } else {
        console.log("UPDATE room OK"); 
        connection.query('UPDATE member SET enable=0 WHERE room_id=?', [roomId], function(err, result) {
           
          if (err) {
            connection.rollback(function() {
              console.log("UPDATE member NG"); 
              throw err;
            });
          }
          connection.commit(function(err) {
            if (err) { 
              connection.rollback(function() {
                console.log("UPDATE member NG"); 
                throw err;
              });
            }
          console.log('success!');
          });
        });
      }
    });
  });
  res.redirect('/edit/');
});

module.exports = router;
