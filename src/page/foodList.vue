<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                @expand='expand'
                :expand-row-keys='expendRow'
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="食品名称">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="食品 ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="食品分类">
                                <span>{{ props.row.classificatio.name }}</span>
                            </el-form-item>
                            <el-form-item label="总销售量">
                                <span>{{ props.row.salesvolume }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="食品ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="食品名称"
                    prop="name">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDeleteFood(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="limit"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
            <el-dialog title="修改食品信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="食品名称" label-width="100px">
                        <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="食品价格" label-width="100px">
                        <el-input v-model="selectTable.price" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="食品库存" label-width="100px">
                        <el-input v-model="selectTable.stock" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="食品分类" label-width="100px">
                        <el-select v-model="selectIndex" :placeholder="selectTable.classification.name" @change="handleSelect">
                            <el-option
                                v-for="item in menuOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="食品图片" label-width="100px">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/img/addImg'"
                            :show-file-list="false"
                            :on-success="handleServiceAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selectTable.img" :src="baseImgPath + selectTable.img.url" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateFood">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getFoods, getMenu, updateFood, deleteFood, getMenuById} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                restaurant_id: null,
                city: {},
                limit: 20,
                count: 0,
                tableData: [
                    {id: 1,name: "康师傅冰绿茶",classificatio: {id: 0,name:'饮料'},salesvolume: 0,img:{id: 0,url:'',md5:''}}
                ],
                currentPage: 1,
                selectTable: {
                    classification:''
                },
                dialogFormVisible: false,
                menuOptions: [
                    {name: '饮料', id: 1},
                    {name: '方便面',id: 2},
                    {name: '食品',id: 3}
                ],
                selectMenu: {
                    id: 0,
                    name: ''
                },
                selectIndex: null,
                expendRow: [],
            }
        },
        mounted(){
            this.getFoods()
        },
        computed: {
        },
        components: {
            headTop,
        },
        methods: {
            async getMenu(){
                this.menuOptions = [];
                try{
                    const menu = await getMenu();
                    menu.data.data.forEach((item, index) => {
                        this.menuOptions.push({
                            name: item.name,
                            id: item.id,
                            index,
                        })
                    })
                }catch(err){
                    console.log('获取食品种类失败', err);
                }
            },
            async getFoods(){
                let params = new FormData()
                params.append('currentPage',this.currentPage)
                params.append('limit',this.limit)
                const Foods = await getFoods(params);
                const menu = await getMenu()
                this.tableData = [];
                this.count = Foods.data.data.total
                Foods.data.data.list.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.id = item.id;
                    tableData.price = item.price;
                    tableData.classification = item.classification;//分类名称
                    tableData.salesvolume = item.salesvolume;
                    tableData.stock = item.stock;
                    // tableData.category_id = item.classification.id;//分类id
                    tableData.img = item.img;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                    return 'info-row';
                } else if (index === 3) {
                    return 'positive-row';
                }
                return '';
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                // this.offset = (val - 1)*this.limit;
                this.getFoods()
            },
            expand(row, status){
                if (status) {
                    this.getSelectItemData(row)
                }else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
            handleEdit(row,index) {
                this.getSelectItemData(row, 'edit')
                this.dialogFormVisible = true;
            },
            async getSelectItemData(row, type){
                console.log(row)
                this.selectTable = row
                if (type == 'edit') {
                    this.getMenu();
                }
            },
            handleSelect(index){
                this.selectIndex = index;
                this.selectTable.classification = this.menuOptions[index];
                console.log(this.selectTable.classification)
            },
            handleDeleteFood(row) {
                this.$confirm('此操作将永久删除此食品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.handleDelete(row)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async handleDelete(row) {
                let params = new FormData()
                params.append('id', row.id);
                try{
                    const res = await deleteFood(params);
                    if (res.data.state == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除食品成功'
                        });
                        // this.tableData.splice(index, 1);
                        this.getFoods()
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除食品失败')
                }
            },
            handleServiceAvatarScucess(res) {
                console.log(res)
                if (res.state === 1) {
                    this.$message.success(res.message);
                    this.selectTable.img.url = res.data.url;
                    this.selectTable.img.id = res.data.id;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
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
            async updateFood(){
                this.dialogFormVisible = false;
                // let params = new FormData()
                // params.append('id',this.selectTable.id)
                // params.append('name',this.selectTable.name)
                // if(this.selectTable.img == null)
                //     params.append('img',this.selectTable.img)
                // else
                //     params.append('img',this.selectTable.img.id)
                // params.append('price',this.selectTable.price)
                // params.append('classification',this.selectTable.classification.id)
                // params.append('stock',this.selectTable.stock)
                // params.append('salesvolume',this.selectTable.salesvolume)
                let params= {
                    id: this.selectTable.id,
                    name: this.selectTable.name,
                    img: this.selectTable.img?this.selectTable.img.id:this.selectTable.img,
                    price: this.selectTable.price,
                    classification: this.selectTable.classification.id,
                    stock: this.selectTable.stock,
                    salesvolume: this.selectTable.salesvolume
                }
                console.log(params)
                const res = await updateFood(params)
                if (res.data.state == 1) {
                    this.$message({
                        type: 'success',
                        message: '更新食品信息成功'
                    });
                    this.getFoods();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
                this.getFoods()
            },
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
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
</style>
