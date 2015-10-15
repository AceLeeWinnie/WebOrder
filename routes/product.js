// GET /product
var express = require('express');
var router = express.Router();
var http = require('http');

/*
 * requestTosql 获取数据
 */
var requestTosql = function (options, cb) {
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      cb(null, chunk);
    });
    res.on('error', function (e) {
      cb(e);
    });
  });
  req.end();
};

// GET /product

router.get('/', function (req, res) {
  var id = req.query.id || '';
  if (!id) {
    res.status(400).json({status: 1});
  } else {
    var options = {
      host: 'weborderback.com',
      port: 8888,
      path: '/WebOrder/servlet/ProductServlet?id='+id,
      method: 'GET',
    };
    requestTosql(options, function (err, data) {
      if(err) {
        console.err(err);
        res.status(500).json({status: 1});
      } else {
        res.status(200).json(JSON.parse(data));
      }
    });
  }
});


module.exports = router;

// 获取需要获取的req.id
// 向后台发出获取某商品信息的请求
// 返回请求信息


