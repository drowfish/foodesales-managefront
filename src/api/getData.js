import fetch from '@/config/fetch'
/**
 * 登陆
 */

// export const login = (params) => {
//     return http.fetchGet(prefix+'/user/login',params)
// }
export const login = params => fetch('/user/login',params,'POST');


/**
 * 退出
 */

export const signout = () => fetch('/user/signout','POST');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/v1/cities', {
	type: 'guess'
});

/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});


/**
 * 添加食品
 */

export const addFood = data => fetch('/foods/addFood', data, 'POST');


/**
 * 获取食品列表
 */

export const getFoods = data => fetch('/foods/foodsList', data,'POST');



/**
 * 获取食品分类列表
 */

export const getMenu = data => fetch('/classfication/classficationList', data,'POST');


/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/foods/updateFood', data, 'POST');

/**
 * 删除食品
 */

export const deleteFood = food_id => fetch('/foods/deleteFood' , food_id, 'POST');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/user/userList', data,'POST');

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/users/count', data);

/**
 * 删除用户
 */

export const removeUser = data => fetch('/user/removeUser', data, 'POST');

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/order/getOrderList', data,'POST');

/**
 * 获取订单总价格
 * @param data
 */
export const getOrderItem = data => fetch('/orderItem/getOrderItem', data,'POST');

/**
 * 获取订单配送
 * @param data
 */
export const getOrderShipping = data => fetch('/orderShipping/getOrderShipping', data,'POST');
/**
 * 获取用户信息
 */

export const getUserInfo = user_id => fetch('/v1/user/' + user_id);

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

// export const getUserCity = () => fetch('/v1/user/city/count');
