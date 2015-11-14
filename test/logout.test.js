var express = require('express');
var request = require('supertest');
var should = require('should');
var cookieParser = require('cookie-parser');

var logout = require('../routes/logout');

var app = express();
app.use(cookieParser());
app.use('/logout', logout);

describe('/logout.js', function () {
  describe('GET /logout', function () {
    it('success respond with a redirection', function (done) {
      request(app)
      .get('/logout')
      .expect(302)
      .expect('location', '/')
      .expect(function (res) {
        res.header['set-cookie'].should.match(/userid=;/);
      })
      .end(function(err, res) {
        err ? done(err) : done();
      });
    });
  });
});