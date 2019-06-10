var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

port = 3001; //process.env.PORT ||

var indexRouter = require('./routes/index');

var mysqlroutes = require('./routes/sqlupdates');
var lounge = require('./routes/lounge');


var app = express();

var options = {
    host: 'HOST',
    port: 3306,
    user: 'USER',
    password: 'PASSWORD',
    database: 'DATABASE'
};
 
var sessionStore = new MySQLStore(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '8mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '8mb' }));
app.use(logger('dev'));
//app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    key: 'bribe',
    secret: 'df35577e98d4213445d3ff5c450bf1ae081041549f9fdc890fca7c67c073422c',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// allow CORS:
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://hytale-mods.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

//app.use('/', indexRouter);
app.use('/api/v1/updates', mysqlroutes);
app.use('/api/v1', lounge)

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
