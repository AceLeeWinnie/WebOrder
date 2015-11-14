var express = require('express');
var request = require('supertest');
var should = require('should');
var bodyParser = require('body-parser');

var product = require('../routes/product');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var aproduct = {
    status: 0,
    content: {
      id: '10003',
      description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷',
      price: '26.00',
      shippingweight: '50g',
      productpicture: '/images/pipa.jpg',
      postfee: 15.00
  }};

app.use(function (req, res, next) {
  req.requestTosql = function (options, cb) {
    cb(null, JSON.stringify(aproduct));
  };
  next();
});
app.use('/product', product);

describe('/product.js', function () {
  describe('GET /product', function () {
    it('success respond with product json', function (done) {
      request(app)
      .get('/product?id=10003')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        }
        // console.log(res.header);
        res.should.be.an.json;
        res.body.should.containDeep(aproduct);
        done();
      });
    });
  });
});