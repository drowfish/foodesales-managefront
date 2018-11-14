<template>
    <div class="header_container">

		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown @command="handleCommand" menu-align='start'>
            <!--baseImgPath + adminInfo.avatar-->
			<img :src="baseImgPath+imgPath" class="avator">
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="home">首页</el-dropdown-item>
				<el-dropdown-item command="singout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
	import {signout,getAdminInfo,getImgById} from '@/api/getData'
	import {baseImgPath} from '@/config/env'

    export default {
    	data(){
    		return {
                baseImgPath,
                imgPath:'',
    		}
    	},
    	created(){
    		// if (!this.adminInfo.id) {
    		// 	this.getAdminData()
    		// }
    	},
        mounted(){
            this.initDate()
        },
    	// computed: {
    	// 	...mapState(['adminInfo']),
    	// },
		methods: {
    	    async initDate(){
    	        let res = await getAdminInfo()
                let params = new FormData()
                params.append('id',res.data.data.headimg)
                let img = await getImgById(params)
                if(img.data.state == 1)
                    this.imgPath = img.data.data.url
                else
                    this.imgPath = ''
            },
			// ...mapActions(['getAdminData']),
			async handleCommand(command) {
				if (command == 'home') {
					this.$router.push('/manage');
				}else if(command == 'singout'){
					const res = await signout()
					if (res.data.state == 1) {
						this.$message({
	                        type: 'success',
	                        message: '退出成功'
	                    });
						this.$store.commit('saveAdminInfo',0)
	                    this.$router.push('/');
					}else{
						this.$message({
	                        type: 'error',
	                        message: res.message
	                    });
					}
				}
			},
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>
