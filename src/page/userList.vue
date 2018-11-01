<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="100">
                </el-table-column>
                <el-table-column
                    property="registeTime"
                    label="注册日期"
                    width="220">
                </el-table-column>
                <el-table-column
                    property="username"
                    label="用户姓名"
                    width="220">
                    <!--<template slot-scope="scope">-->
                    <!--<el-popover trigger="hover" placement="top">-->
                    <!--<p>姓名: {{ scope.row.name }}</p>-->
                    <!--<p>住址: {{ scope.row.address }}</p>-->
                    <!--<div slot="reference" class="name-wrapper">-->
                    <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
                    <!--</div>-->
                    <!--</el-popover>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column
                    property="level"
                    label="用户权限"
                    width="220">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="limit"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getUserList, removeUser} from '@/api/getData'
    let moment = require("moment")
    export default {
        data(){
            return {
                tableData: [],
                currentRow: null,
                // offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
            }
        },
        components: {
            headTop,
        },
        created(){
            this.getUsers();
        },
        methods: {
            // async initData(){
            // try{
            //     const countData = await getUserCount();
            //     if (countData.status == 1) {
            //         this.count = countData.count;
            //     }else{
            //         throw new Error('获取数据失败');
            //     }
            // this.getUsers();
            // }catch(err){
            //     console.log('获取数据失败', err);
            // }
            // },
            // handleSizeChange(val) {
            //     console.log(`每页 ${val} 条`);
            // },
            handleDelete(val){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // let params = new FormData()
                    // params.append('id',this.tableData[val].id)
                    let params = {
                        id:this.tableData[val].id
                    }
                    removeUser(params).then(res=>{
                        if(res.state == 1){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'fail',
                                message: '删除失败!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                // this.offset = (val - 1)*this.limit;
                this.getUsers()
            },
            async getUsers() {
                const res = await getUserList({currentPage: this.currentPage, limit: this.limit});
                console.log(res)
                this.count = res.data.total
                this.tableData = [];
                res.data.list.forEach(item => {
                    const tableData = {}
                    tableData.id = item.id
                    tableData.username = item.username
                    tableData.level = '普通用户'
                    tableData.registeTime = moment(item.registeTime).format('YYYY-MM-DD')
                    this.tableData.push(tableData)
                    // tableData.registe_time = item.registe_time;
                    //     tableData.city = item.city;
                    //     this.tableData.push(tableData);
                    // })
                })
            }
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>
