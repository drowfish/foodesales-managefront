<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">管理员信息</header>
        <div class="admin_set">
            <ul>
                <li>
                    <span>姓名：</span><span>{{adminInfo.username}}</span>
                </li>
                <li>
                    <span>注册时间：</span><span>{{parseTime(adminInfo.registeTime)}}</span>
                </li>
                <li>
                    <span>管理员 ID：</span><span>{{adminInfo.id}}</span>
                </li>
                <li>
                    <span>更换头像：</span>
                    <el-upload
                      class="avatar-uploader"
                      :action="baseUrl + '/img/addImg'"
                      :show-file-list="false"
                      :on-success="uploadImg"
                      :before-upload="beforeImgUpload">
                      <img v-if="adminInfo.headimg" :src="baseImgPath + adminInfo.headimg.url" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getAdminInfo,getImgById,updateUser} from "../api/getData";
	import moment from 'moment'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                adminInfo:{
                    headimg:{
                        id: '',
                        url: '',
                    }
                }
            }
        },
    	components: {
    		headTop,
    	},
        mounted(){
            this.initDate()
        },
        // computed: {
        //     ...mapState(['adminInfo']),
        // },
        methods: {
            parseTime (date) {
                return new moment(date).format('YYYY-MM-DD')
            },
            async initDate(){
                let res = await getAdminInfo()
                if(res.data.state == 1){
                    this.adminInfo = res.data.data
                    // this.adminInfo.user_name = res.data.data.username
                    // this.adminInfo.create_time = moment(res.data.data.registeTime).format('YYYY-MM-DD')
                    // this.adminInfo.id = res.data.data.id
                    let params = new FormData()
                    params.append('id',res.data.data.headimg)
                    let img = await getImgById(params)
                    if(img.data.state == 1)
                        this.adminInfo.headimg = img.data.data
                    else
                        this.adminInfo.headimg = img.data.data
                    // console.log(this.adminInfo)
                }
            },
            uploadImg(res, file) {
                if (res.state == 1) {
                    this.adminInfo.headimg = res.data;
                    let params = {
                        id: this.adminInfo.id,
                        username: this.adminInfo.username,
                        password: this.adminInfo.password,
                        level: this.adminInfo.level,
                        headimg: this.adminInfo.headimg.id,
                        registeTime: this.adminInfo.registeTime
                    }
                    updateUser(params)
                    this.$message.success('更换头像成功')
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeImgUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
        ul > li{
            padding: 20px;
            span{
                color: #666;
            }
        }
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
