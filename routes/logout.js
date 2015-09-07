// GET /logout
var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/', function (req, res) {
  // 删除session
  // 重定向到首页
  res.redirect('/');
});


module.exports = router;


