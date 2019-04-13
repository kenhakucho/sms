var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');

router.get('/', function(req, res, next) {
  res.render('signup', {
    title: '新規会員登録'
  });
});

router.post('/', function(req, res, next) {
  var name     = req.body.user_name;
  var nickname = req.body.nickname;
  var mail     = req.body.email;
  var password = req.body.password;

  var emailExistsQuery = 'SELECT * FROM user WHERE mail = "' + mail + '" LIMIT 1';
  var registerQuery = 'INSERT INTO user (name, nickname, mail, password) VALUES ("' + name + '", ' + '"' + nickname + '", ' + '"' + mail + '", ' + '"' + password + '")';

  connection.query(emailExistsQuery, function(err, email) {
    var emailExists = email.length;
    if (emailExists) {
      res.render('signup', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです'
      });
    } else {
      connection.query(registerQuery, function(err, rows) {
        res.redirect('/login');
      });
    }
  });
});

module.exports = router;

