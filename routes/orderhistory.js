// GET /orderhistory
// POST /orderhistory
var express = require('express');
var router = express.Router();
var http = require('http');

// 发起请求
// function requestTosql (options, cb) {
//   // 向后台发起请求传递订单
//   var req = http.request(options, function (res) {
//     // 获取返回值
//     // 返回json数据
//     res.on('data', function (chunk) {
//       cb(null, chunk);
//     });
//     // 请求失败
//     res.on('error', function (e) {
//       cb(e);
//     })
//   });

//   req.end();
// }

// TEST
function requestTosql (opts, cb) {
  cb(null, '0');
  // cb(null, '1');
};

// 查询订单历史
router.get('/', function (req, res) {
  res.render('orderhistory', {title: '订单历史'});
});

// 提交订单 使用ajax post 提交内容有{订单号：10001，邮寄方式：air，总价格：12.7，总重:12.7,详情：[{商品编号：001，数量：1}，{编号：004，数量：3}]}
router.post('/', function (req, res) {
  var order = req.body || '';
  // for(var p in req.body) {
  //   if(req.body.hasOwnProperty(p)) {
  //     console.log('req.body '+ p +' '+ req.body[p]);
  //   }
  // }
  // console.log('req.body: '+req.body.orderid);
  if (order !== '') {
    // 订单存在则发起请求
    requestTosql(null, function (err, data) {
      if (err) {
        console.log('requestTosql error: ' + err.message);
      } else {
        // 请求成功 0 提交成功 1 连不上数据库
        // 返回数据
        res.end(data);
      }
    });
  }
});

module.exports = router;


