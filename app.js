var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var fileupload = require("express-fileupload");
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();

var indexRouter = require('./routes/index');
var courseRouter = require('./routes/course');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(fileupload());

app.use(session({
  key: 'user_id',
  secret: '123456',
  saveUninitialized: false,
  resave: false
}));

app.use((req, res, next) => {
  if (req.cookies.user_id && !req.session.user) {
      res.clearCookie('user_id');        
  }
  next();
});


app.use('/', indexRouter);
app.use('/course', courseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(res.locals.message);
  console.log(res.locals.error);
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
