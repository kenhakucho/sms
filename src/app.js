var createError = require('http-errors');
var express = require('express');
var engine = require('ejs-locals'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var roomRouter = require('./routes/room');
var login = require('./routes/login');
var logout = require('./routes/logout');

var roomList = require('./routes/roomList');
var roomEdit = require('./routes/roomEdit');
var stamp = require('./routes/stamp');
var profile = require('./routes/profile');

var setUrl = require('./setUrl'); 
var setUser = require('./setUser'); 
var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use('/', setUrl, setUser, indexRouter);
app.use('/signup', setUrl, signupRouter);
app.use('/room', setUrl, setUser, roomRouter);
app.use('/login', setUrl, login); 
app.use('/logout', setUrl, logout); 

app.use('/room/list', setUrl, setUser, roomList); 

app.use('/room/edit', setUrl, setUser, roomEdit); 
app.use('/stamp', setUrl, stamp); 
app.use('/profile', setUrl, setUser, profile); 

/**
app.get('/test', function(req, res){
  res.sendfile('public/test.html');
});
**/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// console.log(app.routes);

module.exports = app;


