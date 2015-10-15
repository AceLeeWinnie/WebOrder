jQuery(document).ready(function ($) {
  $('button:submit').on('submit', function (e) {
    if($('input[name="username"]').val() === '' || $('input[name="password"]').val() === '') {
      alert('用户名或密码不能为空');
      e.preventDefault();
    }
  });
});

//判断用户名和密码是否为空