// 产品列表页
var express = require('express');
var router = express.Router();
var http = require('http');

/*
 * requestTosql 获取数据
 */
// var requestTosql = function (options, cb) {
//   var req = http.request(options, function (res) {
//     var data = '';
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//       data += chunk;
//     });
//     res.on('end', function () {
//       cb(null, data);
//     });
//     res.on('error', function (e) {
//       cb(e);
//     });
//   });
//   req.end();
// };

// GET /productlist
router.get('/',function (req, res) {
  var options = {
    config: {
      host: 'weborderback.com',
      port: 8888,
      path: '/WebOrder/servlet/ProductListServlet',
      method: 'GET'
    }
  };
  req.requestTosql(options, function (err, data) {
    if(err) {
      console.err(err);
    } else {
      data = JSON.parse(data);
      // console.log(data);
      res.render('productlist', {page:'productlist', title: '商品列表', userid: req.cookies.userid, productlist: data});
    }
  });
});

module.exports = router;
