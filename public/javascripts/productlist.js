// 浏览详情

jQuery(document).ready(function ($) {
  var curPro;
  /*
   *  os 合并对象，obj1，2都有的，2覆盖1，没有的添加
   *  参数: [obj1] 合并对象之一
   *       [obj2] 合并对象之二
   *  返回: 合并后的新对象
   */
  var os = function (obj1, obj2) {
    var newObj = {};
    var o;
    for(o in obj1) {
      if(obj1.hasOwnProperty(o)) {
        newObj[o] = obj1[o];
      }
    }
    for(o in obj2) {
      if(obj2.hasOwnProperty(o)) {
        newObj[o] = obj2[o];
      }
    }
    return newObj;
  };
  /*
   * showError 展示错误信息
   * 参数: [text] 信息
   *      [container] 容器
   * 返回: 无
   */
  var showError = function (text, container) {
    container = container || $('#productdetail').find('.modal-body')[0];
    var content = '<h3>' + text + '</h3>';
    container.innerHTML = content;
  };
  /*
   * showProductDetai 展示商品详情
   * 参数: [data] 商品详情
   *      [container] 容器
   * 参数格式: {id: 1, description: ,price: ,shippingweight: ,productpicture: ,postfee: }
   * 返回: 无
   */
  var showProductDetail = function (data, container) {
    container = container || $('#productdetail').find('.modal-body')[0];
    var img = '<img src="'+data.productpicture+'" />';
    var h3 = '<h3>'+data.description+'</h3>';
    var ul = '<ul>';
    ul += '<li><span>价格 ￥<strong class="price">'+data.price+'</strong></span></li>';
    ul += '<li><span>邮费 ￥<strong>'+data.postfee+'</strong><span></li>';
    ul += '<li><span>重量   <strong>'+data.shippingweight+'</strong>kg</span></li>';
    ul += '<li><span>数量  <span><input id="pro-number" type="number" min="0" placeholder="请选择商品数量" /></li>';
    ul += '<li><button id="add-basket-button">添加到购物篮</button></li></ul>';
    var detail = '<div class="detail">';
    detail += (h3 + ul + '</div>');
    container.innerHTML = img + detail;
  };
  /*
   * getDetail ajax获取某商品信息
   * 参数:[id] 商品编号
          [cb] 回调函数
   * 返回:[json] 商品信息
   */
  var getDetail = function (id, cb) {
    $.ajax({
      url: '/product?id='+id,
      method: 'GET',
      dataType: 'JSON'
    })
    .done(function (data) {
      return cb ? cb(data) : data;
    })
    .fail(function () {
      return cb ? cb(2) : 2;
    });
  };
  /*
   * 监听商品点击事件
   */
  var productClickListener = function (e){
    getDetail(e.target.dataset.pid, function (data) {
      curPro = data;
      switch (data.status) {
        case 0:
          showProductDetail(data.content);
          break;
        case 1:
          showError('商品不存在');
          break;
        case 2:
          showError('数据库连接错误');
          break;
        default:
          showError('出错啦');
      }
    });
  };
  $('.productlist .thumbnail').on('click', 'img', productClickListener);
  $('.productlist .thumbnail').on('click', 'a', productClickListener);

// sessionstorage结构如下
// basket：
// {
//   10003：{
//    name: '',
//    weight: '',
//    postfee: '',
//    num: ''
//   },
//   1010：{}
// }

  /*
   *  监听添加购物篮事件
   */
  $('#productdetail').on('click', '#add-basket-button', function (e) {
    // 数量为负
    var numberinput = $('#pro-number');
    var number = numberinput.val() - 0;
    var productprice = 0;
    if(number < 0) {
      alert('数量为负，请重新选择');
      numberinput.val(0);
    } else if(number === 0) {
      alert('请添加商品数量');
    } else {
      var basket = JSON.parse(window.sessionStorage.getItem('basket')) || {};
      if(basket[curPro.content.id]) {
        number = number + basket[curPro.content.id].num;
        productprice = number * basket[curPro.content.id].price;
      }
      basket[curPro.content.id] = os(curPro.content, {num: number, productprice: productprice});
      window.sessionStorage.setItem('basket', JSON.stringify(basket));
      alert('成功添加到购物篮');
    }
  });

});

// 监听商品点击事件
// ajax获取邮费和重量
// 添加到modal的DOM中

// 监听加入购物车
// 如果数量为负或者不填要有提示
// 否则提示添加成功