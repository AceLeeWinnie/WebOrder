// GET /shoppingbasket
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('shoppingbasket', {page:'shoppingbasket', title: '购物篮'});
});


module.exports = router;

