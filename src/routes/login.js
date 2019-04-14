var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');

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
  var email = req.body.email;
  var password = req.body.password;

  console.log("email    : " + email);
  console.log("password : " + password);

  connection.query('SELECT * FROM user WHERE mail = ? AND password = ? LIMIT 1', 
                   [email, password], function(err, rows) {
    console.log("rows   : " + rows[0]);
    var enable = rows.length? rows[0].enable: false;
    console.log("enable : " + enable);

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

