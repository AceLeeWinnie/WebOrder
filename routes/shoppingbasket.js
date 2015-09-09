// GET /shoppingbasket
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  // 显示购物篮页
  res.render('shoppingbasket');
});


module.exports = router;


