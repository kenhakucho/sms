var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');
var crypto = require("crypto");

router.get('/', function(req, res, next) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'ログイン'
    });
  }
});

router.post('/', function(req, res, next) {
  console.log("POST /login");
  var mail = req.body.email;
  var password = req.body.password;

  var sha512 = crypto.createHash('sha512');
  sha512.update(password)
  var hash = sha512.digest('hex')
/**
  console.log("email    : " + email);
  console.log("password : " + password);
**/
  connection.query('SELECT * FROM user WHERE mail=? AND password=? LIMIT 1', 
    [mail, hash], 
    function(err, rows) {
    var enable = rows.length? rows[0].enable: false;

    if (enable) {
      req.session.user_id = rows[0].id;
      res.redirect('/');
    } else {
      res.render('login', {
        title: 'ログイン',
        noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
      });
    }
  });
});

module.exports = router;

