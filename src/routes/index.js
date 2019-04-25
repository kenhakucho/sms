var express = require('express');
var router = express.Router();
var moment = require('moment'); 
var connection = require('../mysqlConnection');
var multer = require('multer');
var upload = multer({ dest: './public/images/icon/' });
var app = express();
var conf = require('../config.json')[app.get('env')];

/* GET home page. */
router.get('/', function(req, res, next) {

  var userId = req.session.user_id? req.session.user_id: -1;

  // roomList
  var roomListQuery = {
    sql: 'SELECT room.id, room.name, room.icon FROM member INNER JOIN room ON room.id=member.room_id AND room.enable=1 WHERE member.user_id=' + userId + ';', 
    nestTables: '_'
  };
  
  var userListQuery = 'SELECT * FROM user WHERE enable=1';
    
  connection.query(roomListQuery, function(err, roomList) {
    // console.log(results);
    
    // userList
    connection.query(userListQuery, function(err, userList) {
      res.render('index', {
        title: 'Aine',
        roomList: roomList,
        userList: userList,
        userIcon: conf.usericon, 
        roomIcon: conf.roomicon, 
      });
    });
  });
});

router.post('/', upload.fields([ { name: 'image_file' } ]), function(req, res, next) {
  var userId    = req.session.user_id? req.session.user_id: -1;
  var roomName  = req.body.room_name;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var icon      = conf.roomicon;
  var member    = req.body.addMember;

  if (req.files.image_file) {
      icon = req.files.image_file[0].filename;
  }  

  connection.beginTransaction(function(err) {
    console.log("beginTransaction"); 
    if (err) { throw err; }
    connection.query('INSERT INTO room SET user_id=?, name=?, icon=?',[userId, roomName, icon], function(err, result) {
      if (err) { 
        connection.rollback(function() {
          console.log("INSERT INTO room NG"); 
          throw err;
        });
      }
      console.log("INSERT INTO room OK"); 

      var room_id = result.insertId;
      var insertMemQuery = 'INSERT INTO member(room_id, user_id) VALUES ?';
      var values = [];
      
      if (Array.isArray()) {
        member.forEach(function(memberid){
          values.push([room_id, Number(memberid)]);
        });
      } else {
          values.push([room_id, member);
      }
        
      console.log("values");
      console.log(values);

      connection.query(insertMemQuery, [values], function(err, result) {
           
        
        if (err) { 
          connection.rollback(function() {
            console.log("INSERT INTO member NG"); 
            throw err;
          });
        }  
        connection.commit(function(err) {
          if (err) { 
            connection.rollback(function() {
              console.log("INSERT INTO member NG"); 
              throw err;
            });
          }
          console.log('success!');
        });
      });
    });
  });
  res.redirect('/');
});

module.exports = router;
