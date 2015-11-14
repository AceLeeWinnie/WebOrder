var express = require('express');
var router = express.Router();
var http = require('http');

/*
 * GET 获取登录界面
 */
router.get('/', function (req, res) {
  res.render('index', {title: '登录'});
});

/*
 * GET 登录功能
 */
router.post('/', function (req, res, next) {
  var name = req.body.username || '';
  var pwd = req.body.password || '';
  // console.log('==============> name='+name+' pwd='+pwd);
  if (name !== '' && pwd !== '') {
    var options = {
      config: {
        host: 'weborderback.com',
        port: 8888,
        path: '/WebOrder/servlet/LoginServlet?name='+name+'&pwd='+pwd,
        method: 'GET'
      }
    };
    req.requestTosql(options, function (err, data) {
    // requestTosql(null, function (err, data) {
      // console.log('============> requestTosql');
      if (err) {
        console.log('request error: ' + err.message);
      } else {
        // 0 匹配成功 1 用户名不存在 2 密码错误 3 数据库没连上
        // {status: 0, userid: 10001}
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