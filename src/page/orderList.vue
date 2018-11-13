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
                      <el-form-item label="收货人姓名" >
                        <span>{{ props.row.user_name }}</span>
                      </el-form-item>
                      <el-form-item label="收货人地址">
                        <span>{{ props.row.address }}</span>
                      </el-form-item>
                      <el-form-item label="总金额">
                          <span>{{props.row.total_amount}}</span>
                      </el-form-item>
                    </el-form>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="订单 ID"
			      prop="id">
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      prop="create_time">
			    </el-table-column>
			    <el-table-column
			      label="订单状态"
			      prop="status">
			    </el-table-column>
			</el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {getOrderList, getUserInfo,getOrderItem,getOrderShipping} from '@/api/getData'
    let moment = require("moment")
    export default {
        data(){
            return {
                tableData: [],
                currentRow: null,
                limit: 20,
                count: 0,
                currentPage: 1,
                restaurant_id: null,
                expendRow: [],
            }
        },
    	components: {
    		headTop,
    	},
        created(){
            this.getOrders();
        },
        mounted(){

        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getOrders()
            },
            async getOrders(){
                let params = new FormData()
                params.append('currentPage',this.currentPage)
                params.append('limit',this.limit)
                const Orders = await getOrderList(params);
                this.count = Orders.data.data.total
                this.tableData = [];
                Orders.data.data.list.forEach((item, index) => {
                    const tableData = {};
                    tableData.id = item.id;
                    tableData.create_time = moment(item.createTime).format('YYYY-MM-DD')
                    tableData.status = item.status?'已支付':'未支付';
                    tableData.user_id = item.userId;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            async expand(row, status){
            	if (status) {
	            	// const userInfo = await getUserInfo(row.user_id);
                    let params = new FormData()
                    params.append('orderId',row.id)
	            	const addressInfo = await getOrderShipping(params);
                    const res = await getOrderItem(params)
                    this.tableData.splice(row.index, 1, {...row, ...{ address: addressInfo.data.data.receiverAddress, user_name: addressInfo.data.data.receiverName,total_amount: res.data.data}});
                    this.$nextTick(() => {
                        this.expendRow.push(row.index);
                    })
	            }else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .table_container{
        padding: 20px;
    }
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
</style>
