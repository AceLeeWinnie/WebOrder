// 产品列表页
var express = require('express');
var router = express.Router();

// productlist generate
var productlist = [];
(function () {
  var product = {
    id: '10003',
    description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷',
    price: '26.00',
    shippingweight: '50g',
    productpicture: '/images/pipa.jpg'
  };
  for (var i = 0; i < 30; i++) {
    productlist.push(product);
  }
})();

// GET /productlist
router.get('/',function (req, res) {
  res.render('productlist', {title: '商品列表', id: '江海潮', productlist: productlist});
});

module.exports = router;
