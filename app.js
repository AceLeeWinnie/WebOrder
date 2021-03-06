var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

// 路由
var index = require('./routes/index');
var productlist = require('./routes/productlist');
var product = require('./routes/product');
var orderhistory = require('./routes/orderhistory');
var shoppingbasket = require('./routes/shoppingbasket');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (request, response, next) {
  request.requestTosql = function (options, cb) {
    // console.log('============> app requestTosql');
    var req = http.request(options.config, function (res) {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        cb(null, data);
      });
      res.on('error', function (e) {
        cb(e);
      });
    });
    req.on('error', function (e) {
      cb(e);
    });
    if(options.data){
      req.write(options.data);
    }
    req.end();
  };
  next();
});

app.use(cookieParser());
// 静态资源
// GET /javascripts/jquery.js
// GET /style.css
// GET /favicon.ico
app.use(express.static(path.join(__dirname, 'public')));

// 路由
// GET /
// POST /
app.use('/', index);
// 判断是否有userid
app.use(function (req, res, next){
  if (!req.cookies.userid) {
    res.redirect('/');
  }
  next();
});
// GET /productlist
app.use('/productlist', productlist);
app.use('/product', product);
app.use('/shoppingbasket', shoppingbasket);
// GET /orderhistory
// POST /orderhistory
app.use('/orderhistory', orderhistory);
// GET /logout
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(port, function () {
  console.log('WebOrder listen on ' + port);
});


module.exports = app;