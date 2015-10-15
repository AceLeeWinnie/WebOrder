var express = require('express');
var router = express.Router();
var http = require('http');



/*
 * 发起请求
 * GET http://WebOrderBack:8888/login?name=XXXandpwd=XXX
 */
 var requestTosql = function (options, cb) {
   console.log('index requestTosql');
   var req = http.request(options, function (res) {
     console.log('index requestTosql return res');
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

// 模拟请求
// var requestTosql = function (options, cb) {
//   cb(null, {status: 0, userid: 10001});
// };

/*
 * GET 获取登录界面
 */
router.get('/', function (req, res, next) {
  res.render('index', {title: '登录'});
});

/*
 * GET 登录功能
 */
router.post('/', function (req, res, next) {
  var name = req.body.username || '';
  var pwd = req.body.password || '';
  // console.log('name='+name+'&pwd='+pwd);
  if (name !== '' && pwd !== '') {
    var options = {
      host: 'weborderback.com',
      port: 8888,
      path: '/WebOrder/servlet/LoginServlet?name='+name+'&pwd='+pwd,
      method: 'GET'
    };
    requestTosql(options, function (err, data) {
    // requestTosql(null, function (err, data) {
      if (err) {
        console.log('request error: ' + err.message);
      } else {
        // 0 匹配成功 1 用户名不存在 2 密码错误 3 数据库没连上
        // {status: 0, userid: 10001}
        console.log(data);
        data = JSON.parse(data);
        switch (data.status) {
          case 0:
            res.cookie('userid', data.userid);
            res.redirect('/productlist');
            break;
          case 1:
            res.render('index', { err: '用户名不存在'});
            break;
          case 2:
            res.render('index', { err: '密码错误'});
            break;
          case 3:
            res.render('index', { err: '数据库连接失败'});
            break;
        }
      }
    });
  } else {
    res.render('index', { err: '用户名或密码为空'});
  }

});


module.exports = router;


