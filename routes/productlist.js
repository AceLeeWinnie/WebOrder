// 产品列表页
var express = require('express');
var router = express.Router();

// GET /productlist
router.get('/',function (req, res, next) {
  res.render('productlist', {title: 'productlist'});
});

module.exports = router;
