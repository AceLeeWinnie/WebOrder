jQuery(document).ready(function ($) {
  var curOrder;
  var showOrder = function (e) {
    $(curOrder).find('thead').hide();
    $(curOrder).find('tbody').hide();
    curOrder = this;
    $(curOrder).find('thead').show();
    $(curOrder).find('tbody').show();
  };
  // 绑定a标签
  $('.orderlist table').on('click', showOrder);
});