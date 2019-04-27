var connection = require('./mysqlConnection');

module.exports = function(req, res, next) {
  var userId = req.session.user_id;
  if (userId) {
    
    connection.query(
        'SELECT id, name, nickname, mail, icon FROM user WHERE id=? ', userId, function(err, rows) {
      if (!err) {
        res.locals.sesuser = rows.length? rows[0]: false;
        console.log("setUser");
      }
    });
  }
  next();
};

