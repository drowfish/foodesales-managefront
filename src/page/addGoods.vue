<template>
    <div>
     	<head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="14" :offset="4">
	  			<header class="form_header">添加食品</header>
	  			<el-form :model="foodForm" :rules="foodrules" ref="foodForm" label-width="110px" class="form food_form">
	  				<el-form-item label="食品名称" prop="name">
						<el-input v-model="foodForm.name"></el-input>
					</el-form-item>
					<el-form-item label="上传食品图片">
						<el-upload
						  class="avatar-uploader"
						  :action="baseUrl + '/img/addImg'"
						  :show-file-list="false"
						  :on-success="uploadImg"
						  :before-upload="beforeImgUpload">
						  <img v-if="foodForm.img" :src="baseImgPath + foodForm.img.url" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="食品种类">
						<!--<el-select v-model="foodForm.menuOptions" multiple placeholder="请选择">-->
						    <!--<el-option-->
						      	<!--v-for="item in menuOptions"-->
						      	<!--:key="item.value"-->
						      	<!--:label="item.label"-->
						      	<!--:value="item.value">-->
						    <!--</el-option>-->
					 	<!--</el-select>-->
                        <el-select v-model="selectIndex" placeholder="请选择" @change="handleSelect">
                            <el-option
                                v-for="item in foodForm.menuOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.index">
                            </el-option>
                        </el-select>
					</el-form-item>
                    <el-form-item label="食品价格" prop="price">
                        <el-input v-model="foodForm.price"></el-input>
                    </el-form-item>
                    <el-form-item label="食品库存" prop="stock">
                        <el-input v-model="foodForm.stock"></el-input>
                    </el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addFood('foodForm')">确认添加食品</el-button>
					</el-form-item>
	  			</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
 	import headTop from '@/components/headTop'
    import {getMenu, addFood} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
    export default {
    	data(){
    		return {
    			baseUrl,
    			baseImgPath,
                selectIndex: null,
                selectMenu: {},
    			foodForm: {
    				name: '',
                    price: '',
    				img: '',
                    stock: '',
                    menuOptions: [],
    			},
    			foodrules: {
    				name: [
						{ required: true, message: '请输入食品名称', trigger: 'blur' },
					],
                    price: [
                        { required: true, message: '请输入价格', trigger: 'blur' },
                    ],
                    stock: [
                        { required: true, message: '请输入库存', trigger: 'blur' },
                    ],
    			},
                menuOptions: [{
		          	id: 1,
		          	name: '新品'
		        }, {
		          	id: 2,
		          	name: '招牌'
		        },],
    			showAddCategory: false,
    			dialogFormVisible: false,
    		}
    	},
        mounted(){
    	    this.initData()
        },
    	components: {
    		headTop,
    	},
    	methods: {
            handleSelect(index){
                this.selectIndex = index;
                this.selectMenu = this.foodForm.menuOptions[index];
            },
    		async initData(){
    			try{
    				const result = await getMenu();
	    			if (result.data.state == 1) {
                        result.data.data.forEach((item, index) => {
                            this.foodForm.menuOptions.push({
                                name: item.name,
                                id: item.id,
                                index,
                            })
                        })
	    			}else{
	    				console.log(result)
	    			}
    			}catch(err){
    				console.log(err)
    			}
    		},
			uploadImg(res, file) {
				if (res.state == 1) {
					this.foodForm.img = res.data
                    this.$message.success(res.message)
				}else{
				    this.foodForm.img = null
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
			tableRowClassName(row, index) {
		        if (index === 1) {
		        	return 'info-row';
		        } else if (index === 3) {
		        	return 'positive-row';
		        }
		        return '';
		    },
		    addFood(foodForm){
		    	this.$refs[foodForm].validate(async (valid) => {
					if (valid) {
                        let params= {
                            name: this.foodForm.name,
                            img: this.foodForm.img?this.foodForm.img.id:this.foodForm.img,
                            price: this.foodForm.price,
                            classification: this.selectMenu.id,
                            stock: this.foodForm.stock,
                            salesvolume: 0
                        }
						try{
							const result = await addFood(params);
							if (result.data.state == 1) {
								this.$message({
					            	type: 'success',
					            	message: result.data.message
					          	});
							}else{
								this.$message({
					            	type: 'error',
					            	message: result.data.message
					          	});
							}
						}catch(err){
							console.log(err)
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});
		    }
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.form{
		min-width: 400px;
		margin-bottom: 30px;
		&:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
	}
	.food_form{
		border: 1px solid #eaeefb;
		padding: 10px 10px 0;
	}
	.form_header{
		text-align: center;
		margin-bottom: 10px;
	}
	.category_select{
		border: 1px solid #eaeefb;
		padding: 10px 30px 10px 10px;
		border-top-right-radius: 6px;
		border-top-left-radius: 6px;
	}
	.add_category_row{
		height: 0;
		overflow: hidden;
		transition: all 400ms;
		background: #f9fafc;
	}
	.showEdit{
		height: 185px;
	}
	.add_category{
		background: #f9fafc;
		padding: 10px 30px 0px 10px;
		border: 1px solid #eaeefb;
		border-top: none;
	}
	.add_category_button{
		text-align: center;
		line-height: 40px;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border: 1px solid #eaeefb;
		border-top: none;
		transition: all 400ms;
		&:hover{
			background: #f9fafc;
			span, .edit_icon{
				color: #20a0ff;
			}
		}
		span{
			.sc(14px, #999);
			transition: all 400ms;
		}
		.edit_icon{
			color: #ccc;
			transition: all 400ms;
		}
	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
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
	.cell{
		text-align: center;
	}
</style>
