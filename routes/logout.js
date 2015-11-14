// GET /logout
var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/', function (req, res) {
  res.clearCookie('userid', { path: '/' });
  res.redirect('/');
});


module.exports = router;
