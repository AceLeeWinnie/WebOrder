// GET /shoppingbasket
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  console.log(req.cookies.userid);
  res.render('shoppingbasket', {page:'shoppingbasket', title: '购物篮', userid: req.cookies.userid});
});


module.exports = router;

