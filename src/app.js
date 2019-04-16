var createError = require('http-errors');
var express = require('express');
var engine = require('ejs-locals'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var http = require('http');
var socketIO = require('socket.io');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var roomRouter = require('./routes/room');
var login = require('./routes/login');
var logout = require('./routes/logout');

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
app.use('/room', setUser, roomRouter)
app.use('/login', login); 
app.use('/logout', logout); 

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

//------------------------------------------------------------------
server = http.createServer(app); // add
server.listen(app.get('port'), function(){ //add
  console.log("Express server listening on port " + app.get('port'));
});
var io = socketIO.listen(server);

// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
  console.log("connection");
  // メッセージを受けたときの処理
  socket.on('message', function(data) {
    // つながっているクライアント全員に送信
    console.log("message");
    io.sockets.emit('message', { value: data.value });
  });

  // クライアントが切断したときの処理
  socket.on('disconnect', function(){
    console.log("disconnect");
  });
});
//------------------------------------------------------------------


module.exports = app;


