var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');
var multer = require('multer');
var upload = multer({ dest: './public/images/icon/'});
var app = express();
var conf = require('../config.json')[app.get('env')];
var crypto = require("crypto");

router.get('/', function(req, res, next) {
  console.log("GET proile/") 

  var userId = req.session.user_id? req.session.user_id: -1;
  if (userId > -1) {

    connection.query(
      'SELECT id, name, nickname, mail, icon FROM user WHERE id = ? ', userId, function(err, user) {
      res.render('profile', {
        title: 'プロフィール',
        user: user[0]
      });
    });
  } else {
    res.redirect('/');
  }
});

router.post('/', upload.fields([ { name: 'image_file' } ]), function(req, res, next) {
  console.log("POST proile/")

  var userId   = req.session.user_id;
  var name     = req.body.name;
  var nickname = req.body.nickname;
  var mail     = req.body.mail;
  var password = req.body.password;
  var icon     = conf.usericon;
  var isImgChange = false;
  var sha512 = crypto.createHash('sha512');
  sha512.update(password);
  var hash = sha512.digest('hex');
  
  if ( req.files.image_file ) {
    isImgChange = true;
    icon = req.files.image_file[0].filename;
  }  
    
  connection.query('SELECT * FROM user WHERE id <> ? AND mail = ? LIMIT 1', [userId, mail], 
    function(err, email) {
    var emailExists = email.length;
    console.log("emailExists : " + emailExists);
    if (emailExists > 0) {
      res.render('profile', {
        title: 'プロフィール',
        errormsg: '既に登録されているメールアドレスです'
      });
    } else {
        console.log("isImgChange :" + isImgChange);
        console.log("len : " + password.length > 0);
        
        connection.query('UPDATE user SET name=?, nickname=?, mail=?, icon=?, password=? WHERE id=?', 
        [name, nickname, mail, 
        isImgChange ? icon : 'icon',
        password.length > 0 ? hash : 'password',
        userId]
        , function(err, rows) {
        res.redirect('/profile');
      });
    }
  });
});

module.exports = router;

