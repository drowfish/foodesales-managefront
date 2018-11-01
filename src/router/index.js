import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/addGoods',
			component: addGoods,
			meta: ['添加数据', '添加商品'],
		},{
			path: '/userList',
			component: userList,
			meta: ['数据管理', '用户列表'],
		},{
			path: '/foodList',
			component: foodList,
			meta: ['数据管理', '食品列表'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['数据管理', '订单列表'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})