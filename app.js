var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//引入模块
var router = require('./routes/routes.js');
var db = require('./dao/pasion_dao.js');
var expressSession = require('express-session');
var credentials = require('./Credential/credentials.js');   // 导入秘钥


var app = express();

db.connect();
app.on('close', function(err){
    console.error(err);
    db.disconnect();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(credentials.cookieSecret)); // cookie 使用秘钥加密
app.use(expressSession({
    secret: 'keyboard cat',
    name: 'pasion',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 30}
}));

app.use('/', router);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      console.log('bbbb');
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('aaa');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
