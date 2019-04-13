var express = require('express');
var router = express.Router();
var moment = require('moment'); 
var connection = require('../mysqlConnection');

/* GET home page. */
router.get('/', function(req, res, next) {

  var options = {
    sql: 'SELECT r.id, r.name FROM member m INNER JOIN room r ON r.id=m.room_id WHERE m.user_id=1;', 
    nestTables: '_'
  };
  connection.query(options, function(err, results) {
    console.log(results);
    res.render('index', {
      title: 'Aine',
      roomList: results
    });
  });

});

router.post('/', function(req, res, next) {
  var title = req.body.title;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(title);
  console.log(createdAt); 

  connection.beginTransaction(function(err) {
    console.log("beginTransaction"); 
    if (err) { throw err; }
    connection.query('INSERT INTO room SET user_id=1, name=?', title, function(err, result) {
      if (err) { 
        //insertに失敗したら戻す
        connection.rollback(function() {
          console.log("INSERT INTO room NG"); 
          throw err;
        });
      }
      console.log("INSERT INTO room OK"); 

      var room_id = result.insertId;
      var user_id = 1;

      connection.query('INSERT INTO member SET room_id=?, user_id=?',[room_id, user_id], function(err, result) {
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
