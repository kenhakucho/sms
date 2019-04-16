var express = require('express');
var router = express.Router();
var multer = require('multer');
var connection = require('../mysqlConnection');
var upload = multer({ dest: './public/images/uploads/' });

router.get('/', function(req, res, next) {
  console.log("GET signup/")
  res.render('signup', {
    title: '新規会員登録',
    image: '/images/uploads/default_icon.png'
  });
});

router.post('/', upload.single('image_file'), function(req, res, next) {
  console.log("POST signup/")
  console.log("uploads  : " + req.image_file);
    
  var name     = req.body.user_name;
  var nickname = req.body.nickname;
  var mail     = req.body.email;
  var password = req.body.password;
  var icon     = 'default_icon.png'
      
  if (req.image_file) {
      icon = req.image_file.name;
  }  
    
  console.log("name     : " + name);
  console.log("nickname : " + nickname);
  console.log("mail     : " + mail);
  console.log("password : " + password);
  console.log("icon     : " + icon);
    
  connection.query('SELECT * FROM user WHERE mail = ? LIMIT 1', mail, function(err, email) {
    var emailExists = email.length;
    if (emailExists) {
      res.render('signup', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです',
        image: '/images/uploads/'+icon
      });
    } else {
      connection.query('INSERT INTO user SET ?', 
      {
        name: name,
        nickname: nickname,
        mail: mail,
        password: password,
        icon: icon
      }, function(err, rows) {
        res.redirect('/login');
      });
    }
  });
});

module.exports = router;

