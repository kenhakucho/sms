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

var edit = require('./routes/edit');

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
app.use('/', setUser, indexRouter);
app.use('/signup', signupRouter);
app.use('/room', setUser, roomRouter);
app.use('/login', login); 
app.use('/logout', logout); 
app.use('/edit', edit); 

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

module.exports = app;


