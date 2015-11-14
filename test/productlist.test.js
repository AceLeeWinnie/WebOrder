var express = require('express');
var path = require('path');
var request = require('supertest');
var should = require('should');
var cookieParser = require('cookie-parser');

var productlist = require('../routes/productlist');

var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(cookieParser());

var list = {status: 0, content: [{
        id: '10003',
        description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷',
        price: 26.00,
        shippingweight: 50,
        postfee: 10,
        productpicture: '/images/pipa.jpg'
       },{
        id: '10003',
        description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷',
        price: 26.00,
        shippingweight: 50,
        postfee: 10,
        productpicture: '/images/pipa.jpg'
       },{
        id: '10003',
        description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷',
        price: 26.00,
        shippingweight: 50,
        postfee: 10,
        productpicture: '/images/pipa.jpg'
       }]
      };
app.use(function (req, res, next) {
  req.requestTosql = function (options, cb) {
    cb(null,JSON.stringify(list));
  };
  next();
});
app.use('/productlist', productlist);

describe('/routes/productlist.js', function () {
  describe('GET /productlist', function () {
    it('success respond with productlist page', function (done) {
      request(app)
      .get('/productlist')
      .set('Cookie', 'userid=10001')
      .expect(200)
      .expect(function (res) {
        res.should.be.html;
        res.body.should.match(/<title>商品列表<\/title>/);
      })
      .end(function(err, res) {
        err ? done(err) : done();
      });
    });
  });
});