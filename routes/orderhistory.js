// GET /orderhistory
// POST /orderhistory
var express = require('express');
var router = express.Router();
var http = require('http');

/*
 * 发起请求 requestTosql
 * 参数: [options] 向后台传递的订单数据或者
 *      [cb] 传递完成后的回调
 */
// var requestTosql =  function (options, cb) {
//   var data = '';
//   var req = http.request(options.config, function (res) {
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//       data += chunk;
//     });
//     res.on('end', function () {
//       cb(null, data);
//     });
//   });
//   req.on('error', function (e) {
//     cb(e);
//   });
//   if(options.data){
//     req.write(options.data);
//   }
//   req.end();
// };

// TEST
// var requestTosql = function (opts, cb) {
  // cb(null, '0');
  // cb(null, '0');
// };

/*
 * 查询订单历史
 */
router.get('/', function (req, res) {
  var options = {
    config: {
      host: 'weborderback.com',
      port: 8888,
      path: '/WebOrder/servlet/ListHistoryServlet?userid='+req.cookies.userid,
      method: 'GET'
    }
  };
  req.requestTosql(options, function (err, data) {
    if (err) {
      console.err('getorderlist error: '+err);
    } else {
      data = JSON.parse(data);
      res.render('orderhistory', {page: 'orderhistory',userid: req.cookies.userid, title: '订单历史', orderlist: data});
    }
  });
});

/*
 * 提交订单
 */
router.post('/', function (req, res) {
  // console.log(req.body);
  var order = req.body.order || '';
  if (order) {
    var options = {
      config: {
        host: 'weborderback.com',
        port: '8888',
        path: '/WebOrder/servlet/GetOrder',
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        }
      },
      data: order
    };
    // requestTosql(null, function (err, data) {
    req.requestTosql(options, function (err, data) {
      if (err) {
        console.log('requestTosql error: ' + err.message);
      } else {
        // console.log('data: '+data);
        res.end(data);
      }
    });
  }
});

module.exports = router;


// JSON本质是字符串，是格式化的字符串，能够通过解析转换成对象。