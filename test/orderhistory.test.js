var express = require('express');
var path = require('path');
var request = require('supertest');
var should = require('should');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var orderhistory = require('../routes/orderhistory');

var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var order = {
    userid: 10001,
    shippingmode: '陆运',
    totalprice: 124.00,
    totalweight: 13,
    content:  [{
    id: 10001,
    num: 12,
    productprice: 180}]
  };

var orderlist = {
  status: 0,
  content: [{
    orderid: 1000,
    time: 2015-09-13,
    shippingmode: '空运',
    totalprice: 10,
    totalweight: 183894,
    content: [{
      id: 10001,
      description: '正品',
      price: 2.00,
      productprice: '21.00',
      postfee: 10.00,
      shippingweight: 12.5,
      num: 12}]
    }]
  };
app.use(function (req, res, next) {
  req.requestTosql = function (options, cb) {
    if (options.data) {
      cb(null, '0');
    } else {
      cb(null,JSON.stringify(orderlist));
    }
  };
  next();
});
app.use('/orderhistory', orderhistory);

describe('/routes/orderhistory.js', function () {

  describe('GET /orderhistory', function () {

    it('success respond with productlist page', function (done) {
      request(app)
      .get('/orderhistory')
      .set('Cookie', 'userid=10001')
      .expect(200)
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/<title>订单历史<\/title>/);
      })
      .end(function(err, res) {
        err ? done(err) : done();
      });
    });

  });

  describe('POST /orderhistory', function () {

    it('success respond with tip', function (done) {
      request
      .agent(app)
      .post('/orderhistory')
      .set('Cookie', 'userid=10001')
      .send({order: order})
      .expect(200)
      .expect(function (res) {
        // console.log(res);
        res.text.should.eql('0');
      })
      .end(function(err, res) {
        err ? done(err) : done();
      });
    });

  });

});