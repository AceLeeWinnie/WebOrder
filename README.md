乐器购买商店
	功能
		1.浏览乐器产品名录
		2.购买乐器
		3.查看历史记录和商品详情页

		4.关系型数据库
			产品信息：名称，价格，重量等
			用户信息：用户id，密码，订单历史，物流信息（以及当前海运或空运的价格）

	术语
		用户： 用户名，id，密码
		产品： 可以在线购买的乐器
		产品信息： 乐器名称，单价，重量，说明，图片
		产品列表：乐器产品列表，可以选择进入详情页
		购物车：用户想买的产品列表哦
		订单历史：每个条目包含与购物车相同的信息以及下单时间，发货模式，总金额

	用例
		登录：登录开始session
`			GET http://ip:port/login?name=XXXandpwd=XXX
			0 匹配成功 1 用户名不存在 2 密码错误 3 数据库没连上
                        返回：{status: 0, userid: 100000}
			正常流程：
				用户键入用户id和密码
				添加userid
				weborder验证密码，初始化空购物车，展示欢迎信息包括产品列表
			非正常流程：
				未知用户，密码错误，数据库没连上


		浏览产品列表：在售的乐器名单
			GET	http://ip:port/productlist
			0 成功 1 商品不存在 2 数据库连接错误
			JSON数据格式
			var product = {status: 0, content: [{
				 id: '10003’,
				 description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷’,
				 price: 26.00,
				 shippingweight: 50,
                                 postfee: 10,
				 productpicture: '/images/pipa.jpg’
			 },…]
			};
			选取一个商品
			0 成功 1 商品不存在 2 数据库连接错误
			GET	http://ip:port/product?id=XXX
			JSON数据格式
			var product = {status: 0, content:{
				 id: '10003’,
				 description: '正品黑陶埙民族乐器八孔初学演奏埙送教材特价埙手工埙梨埙瓷’,
				 price: '26.00’,
				 shippingweight: '50g’,
				 productpicture: '/images/pipa.jpg’
				 postfee: 15.00
		  }};
			正常：
				登陆后展示
				用户选择一个商品查看
				从数据库中查找相关信息
				展示详情：说明，价格，重量，图片
			非正常：
				商品不存在
				数据库连接错误

		添加商品：添加商品到购物车
			正常：
				用户选择一个商品进入详情页
				键入数量 点击添加到购物车按钮
				从数据库获取邮费和重量
				添加数量和商品到购物车
					如果本来就有这个商品则改变数量即可
					否则添加新的购物车条目
				更新购物车总价和总重量
				更新购物车内容
			不正常：
				数量为负或者不填要有提示
				连不上数据库

		从购物车删除商品
			正常：
				用户选择要买的东西
				点击从购物车删除
				删除条目
				更新总重和总价格
				更新购物车内容
			不正常：
				没有东西选中就点了删除
				购物车是空的但是想删除要提示

		清空购物车
			正常：
				用户到购物车页
				点击清空购物车
				从购物车中删除所有条目
				总重和总价格清零
				购物车清零
			不正常：
				本来就是空的要提示

		提交订单：
			POST http://ip:host/orderlist
			返回 0 成功 1 数据库错
			var order = {
  				          userid: 1000,
					  				shippingmode: 空运/陆运,
									  totalprice: 124.00,
									  totalweight: 13,
									  content:  [{
											id: 10001,
											num: 12,
                      productprice: 180},… ]
					 				}

			正常：
				到购物车页
				更新总支出包括邮费和总重
				选择邮寄方式（空，陆），点击提交订单
				更新数据库中的订单历史
				成功后删除购物车内所有条目
				重置总重和价格
				更新购物车内容
				展示下单成功信息
			不正常：
				购物车是空的
				连不上数据库

		查看订单历史：
			GET http://ip:host/orderlist?userid=XXX
			0 成功 1 订单历史空 2 数据库错
			var orderlist = { status: 0,
						content: [ {orderid: 1000,
										    time: 2015-09-13,
											  shippingmode: 空运/陆运,
											  totalprice: 10，
											  totalweight: 183894,
											  content:  [{
												id: 10001,
								        description:,
								        price: ,
								        productprice: ,
								        postfee: ,
												shippingweight: 12.5,
												num: 12},..]
											},… ]
						}

			正常：
				商品列表
				点击订单历史
				从数据库查历史信息
				展示订单历史页
				点击Done按钮回到主页面
				订单详情
					订单历史列表页点击具体订单
					展示包括订单号，日期，邮寄方式，总价格，总重，商品名称以及各重
					用户点击Done
					关闭回到主页面
			不正常：
				订单历史空
				连不上数据库

		登出：
			正常：
				点击Log out
				清空购物车
				删除购物车选项
				删除userid
				展示登录页
