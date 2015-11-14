
var express = require('express');
var path = require('path');
var request = require('supertest');
var should = require('should');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var index = require('../routes/index');

var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
  req.requestTosql = function (options, cb) {
    var name = req.body.username;
    var pwd = req.body.password;
    if (name === 'lee') {
      if (pwd === '123') {
        //匹配
        cb(null, JSON.stringify({status: 0, userid: 10001}));
      } else {
        // 密码错
        cb(null, JSON.stringify({status: 2}));
      }
    } else {
      //用户名不存在
      cb (null, JSON.stringify({status: 1}));
    }
  };
  next();
});
app.use('/', index);

describe('/routes/index.js',function () {
  describe('GET /', function () {
    it('success respond with index page', function (done) {
      request(app)
      .get('/')
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/<title>登录<\/title>/);
      })
      .expect(200, done);
    });
  });
  describe('POST /', function () {
    it('success respond productlist page when name and password are matched.', function (done) {
      request
      .agent(app)
      .post('/')
      .send({username: 'lee', password: '123'})
      .expect('set-cookie', 'userid=10001; Path=/')
      .expect(302)
      .end(function (err, res) {
        err
        ? done(err)
        : done();
      });

    });
    it('fail respond wrong tip when name is not exist.', function (done) {
      request
      .agent(app)
      .post('/')
      .send({username: 'ace', password: '123'})
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/用户名不存在/);
      })
      .end(function (err, res) {
        err
        ? done(err)
        : done();
      });
    });
    it('fail respond wrong tip when password is wrong.', function (done) {
      request
      .agent(app)
      .post('/')
      .send({username: 'lee', password: '1'})
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/密码错误/);
      })
      .end(function (err, res) {
        err
        ? done(err)
        : done();
      });
    });
    it('fail respond wrong tip when name or password is empty.', function (done) {
      request
      .agent(app)
      .post('/')
      .send({username: '', password: ''})
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/用户名或密码为空/);
      })
      .end(function (err, res) {
        err
        ? done(err)
        : done();
      });
    });
  });
});