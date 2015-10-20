jQuery(document).ready(function ($) {
  var totalprice = 0.00;
  var totalweight = 0.00;
  /*
   *  showBasket 展示购物篮
   */
  var showBasket = function (container) {
    container = container || $('.shoppingbasket')[0];
    var content = '';
    var o, thead, tbody;
    var basket = JSON.parse(window.sessionStorage.getItem('basket'));
    if ($.isEmptyObject(basket)) {
      content = '<tbody><tr><td><h3>购物篮是空的!</h3></td></tr></tbody>';
    } else {
      thead = '<thead><tr><th>#</th><th>图片</th><th>商品信息</th><th>单价（元）</th><th>数量</th><th>重量（千克）</th><th>邮费（元）</th><th>金额（元）</th></tr></thead>';
      tbody = '<tbody>';
      for(o in basket) {
        o = basket[o];
        tbody += '<tr id="'+o.id+'"><td><input id="'+o.id+'" type="checkbox" /></td>';
        tbody += '<td><img class="basketnail" src="'+o.productpicture+'"/></td>';
        tbody += '<td><p>'+o.description+'</p></td>';
        tbody += '<td>'+o.price+'</td>';
        tbody += '<td>'+o.num+'</td>';
        tbody += '<td>'+o.shippingweight+'</td>';
        tbody += '<td>'+o.postfee+'</td>';
        tbody += '<td>'+(o.price * o.num + o.postfee)+'</td>';
        tbody += '</tr>';
      }
      tbody += '</body>';
      content = thead + tbody;
    }
    container.innerHTML = content;
  };
  showBasket();

  /*
   * showTotal 展示总价和总重
   * 参数: [price] 变动价格
   *      [weight] 变动重量
   */
  var showTotal = function (price, weight) {
    // 重置
    if(price === 0 || weight === 0) {
      $('#total-price').html(0.00);
      $('#total-weight').html(0.00);
    } else {
      $('#total-price').html(totalprice = totalprice + (price.toFixed(2) - 0));
      $('#total-weight').html(totalweight = totalweight + (weight.toFixed(2) - 0));
      console.log(totalprice);
      console.log(totalweight);
    }
  };

  /*
   * updateBasket 更新购物车session内容
   * 参数: [serial] 需要删除的商品编号数组
   */
  var updateBasket = function (serial) {
    var i, l;
    var basket = JSON.parse(window.sessionStorage.getItem('basket'));
    for(i = 0, l = serial.length; i < l ; ++i) {
      delete basket[serial[i]];
    }
    if($.isEmptyObject(basket)) {
      window.sessionStorage.removeItem('basket');
    } else {
      window.sessionStorage.setItem('basket', JSON.stringify(basket));
    }
  };

  /*
   * getChecked 获取勾选商品的编号
   * 返回: [serial] 商品编号数组
   */
  var getChecked = function (container) {
    container = container || '.shoppingbasket';
    var i, l;
    var serial = [];
    var pro_selected = $(container+' input:checked');
    for(i = 0, l = pro_selected.length; i < l; ++i){
      serial.push(pro_selected[i].id);
    }
    return serial;
  };

  /*
   * submitOrder 提交订单
   * 参数: [products] 选中的需要提交的商品编号数组
   *       [mode] 邮寄方式'空运' / '陆运'
   * 返回: 0 成功 1 数据库错
   * 发送数据格式:
   *      {shippingmode: '空运'/'陆运',
   *       totalprice: 123.00,
           totalweight: 12.89,
           content:  [{
            id: 10001,
            num: 12,
            productprice: 13.00},… ]
          }
   */
  var submitOrder = function (products, mode, cb) {
    var i, l;
    var orderproducts;
    var pro;
    var basket = JSON.parse(window.sessionStorage.getItem('basket'));
    if ($.isEmptyObject(basket)) {
      alert('购物篮是空的,请添加商品');
    } else {
      orderproducts = {
                        userid: document.cookie.match(/userid=(\d*);?/)[1],
                        shippingmode: mode,
                        totalprice: totalprice,
                        totalweight: totalweight,
                        content: []
                      };
      for (i = 0, l = products.length; i < l; i++) {
        // orderproducts.content.push(basket[products[i]]);
        pro = basket[products[i]];
        orderproducts.content.push({id: pro.id, num: pro.num, productprice: pro.price*pro.num});
      }
      orderproducts = JSON.stringify(orderproducts);
      $.ajax({
        url: '/orderhistory',
        method: 'POST',
        data: {order: orderproducts},
        dataType: 'JSON',
      }).done(function (data) {
        return cb ? cb(data) : data;
      }).fail(function () {
        return cb ? cb(1) : 1;
      });
    }
  };

  /*
   * 监听商品勾选事件 更新总价和总重
   */
  $('.shoppingbasket').on('click', 'input[type="checkbox"]', function (e) {
    var id = e.target.id;
    var basket = JSON.parse(window.sessionStorage.getItem('basket'));
    var o = basket[id];
    if (e.target.checked) {
      showTotal(o.price * o.num + o.postfee, o.shippingweight);
    } else {
      showTotal(-(o.price * o.num + o.postfee), - o.shippingweight);
    }
  });

  /*
   * 监听清空事件
   */
  $('#empty').on('click', function () {
    var basket = window.sessionStorage.getItem('basket');
    if(!basket) {
      alert('购物篮已经是空的了!');
    } else {
      window.sessionStorage.removeItem('basket');
    }
    showBasket();
  });

  /*
   * 监听删除事件
   */
  $('#del').on('click', function () {
    var basket = JSON.parse(window.sessionStorage.getItem('basket'));
    var serial;
    if($.isEmptyObject(basket)) {
      alert('购物篮没有可删除的商品!');
    } else {
      serial = getChecked();
      if(serial.length === 0) {
        alert('请选择要删除的商品!');
      } else {
        if(confirm('确定删除所选商品吗？')) {
          updateBasket(serial);
          showBasket();
          showTotal(0, 0);
        }
      }
    }
  });

  /*
   * 监听提交事件
   */
  $('#submit').on('click', function () {
    var serial = getChecked();
    var sign;
    if(serial.length === 0) {
      alert('没有选中商品');
    } else {

      do {
        sign = window.prompt('请选择邮寄方式: 1.空运 2.陆运');
        if (sign === null) {
          return;
        }
      } while (sign !== '1' && sign !== '2');

      var mode = sign === '1' ? '空运' : '陆运';
      submitOrder(serial, mode, function (status) {
        switch (status) {
          case 0:
            alert('订单提交成功');
            updateBasket(serial);
            showBasket();
            showTotal(0, 0);
            break;
          case 1:
            alert('数据库连接错误，请重新提交');
            break;
          default:
            alert('订单提交出错啦!');
        }
      });
    }
  });
});

// 获取sessionstorage中的basket，
// 拼接html字符串，
// 插入页面中

// 监听清空事件
// 清空sessionstorage信息，总重和总价格设为0，并显示‘购物篮没有商品’
// 如果本来就是空的，alert购物篮已经是空的啦

// 监听删除事件
// 获取勾选商品编号
// confirm确定删除所选商品吗
// 取得sessionstorage信息，将对应商品编号删除
// 重新渲染购物篮
// 重置总重和总价格

// 监听提交事件
// 获取勾选商品编号
// confirm确认提交，选择邮寄方式
// 获取总价格
// 拼接提交的对象
// 接受提交结果 如果成功删除sessionstorage
// DOM中的entry清空
// 错误提示错误信息