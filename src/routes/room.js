var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');

router.get('/:room_id', function(req, res, next) {
  var roomId = req.params.room_id;
  var roomQuery = 'SELECT * FROM room WHERE id = ' + roomId;
  var messageQuery = {
    sql: 'SELECT * FROM message LEFT JOIN user ON user.id=message.user_id ' 
         + ' WHERE message.room_id = ' + roomId + ' and message.enable=1 '
         + ' ORDER BY message.made ASC;',
    nestTables: '_'
  }
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
});

router.post('/:room_id', function(req, res, next) {
  var userId = req.session.user_id? req.session.user_id: 0;
  var message = req.body.message;
  var roomId = req.params.room_id;
  //var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  var query = 'INSERT INTO message (room_id, user_id, message) VALUES ("' + roomId + '", ' + '"' + userId + '", ' + '"' + message + '")';
  connection.query(query, function(err, rows) {
    res.redirect('/room/' + roomId);
  });
});

module.exports = router;


