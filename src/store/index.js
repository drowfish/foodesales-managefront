import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
		status: 0
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.status = adminInfo;
	}
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo()
            console.log("进入getAdminData："+res.data.state)
			if (res.data.state == 1) {
				commit('saveAdminInfo', res.data.state);
			}else{
				throw new Error(res.data.message)
			}
		}catch(err){
			console.log('您尚未登陆或者session失效')
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
