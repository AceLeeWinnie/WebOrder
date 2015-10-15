// 产品列表页
var express = require('express');
var router = express.Router();
var http = require('http');

/*
 * requestTosql 获取数据
 */
var requestTosql = function (options, cb) {
  console.log('productlist requestTosql');
  var req = http.request(options, function (res) {
    console.log('productlist requestTosql return res');
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
  req.end();
};

// GET /productlist
router.get('/',function (req, res) {
  var options = {
    host: 'weborderback.com',
    port: 8888,
    path: '/WebOrder/servlet/ProductListServlet',
    method: 'GET'
  };
  requestTosql(options, function (err, data) {
    if(err) {
      console.err(err);
    } else {
      data = JSON.parse(data);
      console.log(data);
      res.render('productlist', {page:'productlist', title: '商品列表', id: '江海潮', productlist: data});
    }
  });
});



module.exports = router;
