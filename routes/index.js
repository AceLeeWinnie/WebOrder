var express = require('express');
var router = express.Router();
var http = require('http');

// 获取登录界面
router.get('/', function (req, res, next) {
  res.render('index', {title: 'login'});
});

// 发起请求
// function requestTosql (options, cb) {
//   // 向后台发起请求传递用户名密码
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

// Test
function requestTosql (opts, cb) {
  cb(null, '0');
  // cb(null, '1');
  // cb(null, '2');
  // cb(null, '3');
}
//登录功能
router.post('/', function (req, res, next) {
  var name = req.body.username || '';
  var pwd = req.body.password || '';
  // 用户名或密码不为空
  if (name !== '' && pwd !== '') {
    //向后台发送用户名密码，返回数据
    requestTosql(null, function (err, data) {
      if (err) {
        // 错误
        console.log('request error: ' + err.message);
      } else {
        // 有数据返回
        // 0 匹配成功 1 用户名不存在 2 密码错误 3 数据库没连上
        switch (data) {
          case '0':
            // 匹配成功
            // 保存session
            // 重定向到/productlist页
            res.redirect('/productlist');
            break;
          case '1':
            res.render('index', { err: '用户名不存在'});
            break;
          case '2':
            res.render('index', { err: '密码错误'});
            break;
          case '3':
            res.render('index', { err: '数据库连接失败'});
            break;
        }
      }
    });
  }

});


module.exports = router;


