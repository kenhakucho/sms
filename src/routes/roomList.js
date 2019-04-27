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

module.exports = router;
