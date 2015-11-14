var express = require('express');
var path = require('path');
var request = require('supertest');
var should = require('should');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var shoppingbasket = require('../routes/shoppingbasket');

var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/shoppingbasket', shoppingbasket);

describe('/routes/shoppingbasket.js', function () {

  describe('GET /shoppingbasket', function () {

    it('success respond with shoppingbasket page', function (done) {
      request(app)
      .get('/shoppingbasket')
      .set('Cookie', 'userid=10001')
      .expect(200)
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/<title>购物篮<\/title>/);
      })
      .end(function(err, res) {
        err ? done(err) : done();
      });
    });

  });

});