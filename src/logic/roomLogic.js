var util = require('util');
var connection = require('../mysqlConnection');

function dump(v){
    return console.log(util.inspect(v));
}

module.exports.isRoomMate = function(req, res, next) {
  var userId = req.session.user_id ? req.session.user_id : -1;
  var roomId = req.params.room_id;
  var enable = 0;
  var query = connection.query('SELECT * FROM member WHERE room_id=? and user_id=? and enable=1 LIMIT 1', [roomId, userId]);
//            , function(err, rows) {

  dump(query);
  enable = rows.length? rows[0].enable: 0;
  if (enable == 1) {
    next();
  } else {
    res.redirect('/');
  }
//  });
  

};


 
