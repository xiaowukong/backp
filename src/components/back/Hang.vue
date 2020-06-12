<template>
    <div class="content-wrapper">
        <galaxy-breadcrumb></galaxy-breadcrumb>

        <div class="hang-wrapper">
            <el-form 
                size="mini"
                :inline="true"
                >
                <el-form-item
                    label="商户"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="typeValue"
                        @change="selectMerchant"
                    >
                        <el-option
                            v-for="(item, index) in merchantArr"
                            :key="index"
                            :value="item.merchantNo"
                            :label="item.merchantName"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="merchant_order_no"
                >
                    <el-input 
                        style="width: 300px"
                        v-model="orderId"
                    ></el-input>
                </el-form-item>

                <br>

               <el-form-item
                    label="挂单时间"
               >
                    <el-date-picker
                        v-model="dateContainer"
                        @change="selectDate"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
               </el-form-item>   
                
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="search"
                    >查询</el-button>
                </el-form-item> 

                <el-form-item>
                    <el-button
                        type="primary"
                        @click="reloadComponent"
                        :disabled="quitSearch"
                    >退出查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="warning"
                        @click="batRecreate"
                    >批量重推</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="danger"
                        @click="warningNotice"
                    >预警通知</el-button>
                </el-form-item>                
            </el-form>

            <el-table
                :data="tableData"
                style="width:100%"
                ref="repushTable"
                row-key="orderNo"
                fit
                v-loading="tableLoading"
                stripe
                size="mini"
                @selection-change="selectionChange">
                <el-table-column
                    type="selection"
                    reserve-selection
                    width="50">
                </el-table-column>
                <!-- 编辑按钮=>添加弹框 -->
                <el-table-column
                    prop="customerId"
                    label="customerId"
                    >
                </el-table-column>

                <el-table-column
                    prop="merchantOrderNo"
                    label="merchant_order_no"
                    >
                </el-table-column>

                <el-table-column
                    prop="orderNo"
                    label="order_no"
                >
                </el-table-column>

                <el-table-column
                    prop="reportNo"
                    label="report_no"
                >
                </el-table-column>

                <el-table-column
                    prop="createTime"
                    label="创建时间"
                >
                </el-table-column>
                
                <el-table-column
                    prop="updateTime"
                    label="挂单时间"
                >
                </el-table-column>

                <el-table-column
                    prop="repushTime"
                    label="重推时间"
                >
                </el-table-column>

                <el-table-column
                    prop="pendingTime"
                    label="挂单时长"
                >
                </el-table-column>

                <el-table-column
                    label="操作"
                    :width="200"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="flowPop(scope.$index, scope.row)"
                        >流水</el-button>

                        <el-button
                            size="mini"
                            type="warning"
                            @click="singleRecreate(scope.$index, scope.row)"
                        >重推</el-button>
                    </template>
                </el-table-column>
            </el-table>   

            <galaxy-pagination
                :totalPages="totalPages"
                :pageSize="10"
                @currentPage="requestPageList($event)"
            ></galaxy-pagination>                    

            <!-- split -->

            <!-- 流水弹窗 -->
            <el-dialog
                :visible.sync="showFlow"
                v-loading="hangTableLoading"
                width="900px"
            >
                <p style="margin-top:-30px;margin-bottom:20px;">
                    商户:<strong>{{merchantName}}</strong><br> 
                    customer_id: <strong>{{customerId}}</strong><br>
                    merchant_order_no: <strong>{{merchantOrderNo}}</strong>
                </p>

                <el-table
                    size="mini"
                    :data="flowData"
                >
                    <el-table-column
                        prop="number"
                        label="编号"
                        type="index"
                    ></el-table-column>

                    <el-table-column
                        prop="originOrderId"
                        label="order_id"
                    ></el-table-column>

                    <el-table-column
                        prop="createTime"
                        label="重推时间"
                    ></el-table-column>

                    <el-table-column
                        prop="completTime"
                        label="重推完成时间"
                    ></el-table-column>

                    <el-table-column
                        prop="pendingTime"
                        label="挂单时长"
                    ></el-table-column>

                    <el-table-column
                        prop="repushUser"
                        label="操作人"
                    ></el-table-column>                      
                </el-table>
            </el-dialog>
            <!-- end of 流水弹窗 -->

            <!-- 预警通知弹窗 -->
            <el-dialog
                title="预警通知"
                width="800px"
                :visible.sync="showWarning"
            >
                <el-form
                    :model="warringForm"
                    size="mini"
                    inline
                >
                    <el-form-item
                        label="邮箱"
                        label-width="40px"
                    >
                        <el-input clearable width="40px" type="email" v-model="warringForm.email"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="addEmail(warringForm.email)">新增邮箱</el-button>
                    </el-form-item>
                </el-form>

                <el-table :data="warringTable" size="mini">
                    <el-table-column property="id" label="编号"></el-table-column>
                    <el-table-column property="value" label="邮箱"></el-table-column>
                    <el-table-column property="createTime" label="添加时间"></el-table-column>
                    <el-table-column property="userName" label="添加人"></el-table-column>
                    <el-table-column property="addDate" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="deleteEmail(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-form class="saveEmail" size="mini">
                    <el-form-item>
                        <el-button @click="closeWarning">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 预警通知弹窗 -->
        </div><!-- .hang-wrapper -->
    </div><!-- .content-wrapper -->
</template>

<script>
import galaxyBreadcrumb from '../shared/Breadcrumb';
import galaxyPagination from '../shared/Pagination';
import { second2Date } from '../../../util';

export default {
    data() {
        return {
            merchantName: '',
            customerId: '',
            merchantOrderNo: '',
            hangTableLoading: false,
            displayMode: 'readTable',
            ids: '',
            tempSelectedArr: [],
            orderId: "",
            quitSearch: true,
            merchantArr: [],
            tableLoading: false,
            totalPages: 0,
            showPages: false,
            totalPagesWarring: 0,
            deleteBtnDisabled: false,
            showFlow: false,
            showWarning: false,
            warringForm: {
                email: ''
            },
            warringTable: [],
            typeValue: '',
            emailArr: [""],
            flowData: [],
            tableData: [],
            dateContainer: ['', '']
        }
    },
    components: {
        galaxyBreadcrumb,
        galaxyPagination
    },

    created() {
        this.tableLoading = true;
        this.showToday();
        this.merchantList();
        this.firstLoad();
    },

    methods: {

        // 关闭预警弹窗
        closeWarning() {
            this.warringForm.email = ''
            this.showWarning = false
        },

        showToday() {
            let today = second2Date(new Date().getTime(), true);
            this.dateContainer[0] = today + ' 00:00:00';
            this.dateContainer[1] = today + ' 23:59:59';
        },

        selectDate() {
            console.log('selectDate');
            console.log(this.dateContainer);
        },
        search() {
            console.log('search');
            this.displayMode = "searchTable";
            let merchantNo = "";
            if (this.merchantNo) {
                merchantNo = this.merchantNo;
            }

            let orderId = "";
            if (this.orderId) {
                orderId = this.orderId;
            }
            
            let startTime = "";
            if (this.dateContainer[0]) {
                startTime = second2Date(this.dateContainer[0]);
            }

            let endTime = "";
            if (this.dateContainer[1]) {
                endTime = second2Date(this.dateContainer[1]);
            }
            
            console.log(merchantNo, orderId, startTime, endTime);
            if (merchantNo == "" && orderId == "" && startTime == "" && endTime == "") {
                this.$message.error('至少要填写一项才能搜索~');
                return;
            }
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/ordermonitor/list?${token}`, {
                page: 1,
                pageSize: 10,
                merchantNo,
                merchantOrderNo: orderId,
                pendingOrderStartTime: startTime,
                pendingOrderEndTime: endTime
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.status == 1) {
                    console.log('>>> ');
                    console.log(data);
                    this.tableData = data.data.records;
                    this.quitSearch = false;
                    this.totalPages = data.data.total;
                } else {
                    this.$message.error(data.msg);
                    return;
                }
            }).catch(err => {
                console.log(err);
            })
        },

        reloadComponent() {
            console.log('reloadComponent');
            this.quitSearch = true;
            this.tableLoading = true;
            this.typeValue = "";
            this.orderId = "";
            this.dateContainer = ['', ''];
            this.displayMode = 'readTable';
            this.showToday();
            this.firstLoad();
        },

        firstLoad() {
            console.log('first load');
            let token = localStorage.getItem('token');
            this.$http.get(`mgr/ordermonitor/main?${token}`)
                .then(res => {
                    return res.json();
                }).then(data => {
                    if (data.status == 1) {
                        this.tableData = data.data.records;
                        this.totalPages = data.data.total;
                        this.tableLoading = false;
                    } else {
                        this.$message.error(data.msg);
                        return;
                    }
                }).catch(err => {
                    console.log(err);
                })
        },

        merchantList() {
            let token = localStorage.getItem('token');
            this.$http.get(`mgr/ordermonitor/merchant?${token}`)
                .then(res => {
                    return res.json();
                }).then(data => {
                    if( data.status == 1 ) {
                        console.log(data);
                        this.merchantArr = data.data;
                    } else {
                        this.$message.error(data.msg);
                        return;
                    }
                }).catch(err => {
                    console.log(err);
                })
        },

        selectionChange(rows) {
            console.log('selectChange', rows);
            this.tempSelectedArr = rows;
            let idsArr = [];
            rows.forEach(item => {
                idsArr.push(item.id);
            });
            console.log('>>> ', idsArr.join(','));
            this.ids = idsArr.join(',');
        },

        selectMerchant(item) {
            console.log('selectMerchant');
            console.log(item);
            this.merchantNo = item;
            console.log('>>> ', this.typeValue);
        },

        requestPageList(page) {
            this.tableLoading = true;
            console.log('requestPageList');

            let obj = {};

            if (this.displayMode == 'readTable') {
                obj = {
                    page,
                    pageSize: 10
                }
            } else {
                let merchantNo = "";
                if (this.merchantNo) {
                    merchantNo = this.merchantNo;
                }

                let orderId = "";
                if (this.orderId) {
                    orderId = this.orderId;
                }
            
                let startTime = "";
                if (this.dateContainer[0]) {
                    startTime = second2Date(this.dateContainer[0]);
                }

                let endTime = "";
                if (this.dateContainer[1]) {
                    endTime = second2Date(this.dateContainer[1]);
                }
            
                // console.log(merchantNo, orderId, startTime, endTime);

                // if (merchantNo == "" && orderId == "" && startTime == "" && endTime == "") {
                // this.$message.error('至少要填写一项才能搜索~');
                // return;
                // }


                obj = {
                    page, 
                    pageSize: 10,
                    merchantNo,
                    merchantOrderNo: orderId,
                    pendingOrderStartTime: startTime,
                    pendingOrderEndTime: endTime
                }
            }
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/ordermonitor/list?${token}`, obj).then(res => {
                return res.json();
            }).then(data => {
                if (data.status == 1) {
                    this.tableData = data.data.records;
                    this.tableLoading = false;
                } else {
                    this.$message.error(data.msg);
                    return;
                }
            }).catch(err => {
                console.log(err);
            });
        },

        flowPop(index, row) {
            console.log('flowPop');
            this.showFlow = true;
            this.hangTableLoading = true;
            console.log('>>>', row);
            this.customerId = row.customerId;
            this.merchantOrderNo = row.merchantOrderNo;
            this.merchantName = row.merchantName;
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/ordermonitor/detail?${token}`, {
                orderId: row.id
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.status == 1) {
                    console.log('SUCCESS');
                    console.log(data);
                    this.flowData = data.data.records;
                    this.hangTableLoading = false;
                } else {
                    this.$message.error(data.msg);
                    this.showFlow = false;
                    this.hangTableLoading = false;
                }
            }).catch(err => {
                console.log(err);
            })
        },

        batRecreate() {
            console.log('batRecreate');
            let ids = this.ids;

            if (ids == "") {
                this.$message.error('选择以后才可以重推～');
                return;
            }
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/ordermonitor/batch/repush?${token}`, {
                ids
            }).then(res => {
                return res.json()
            }).then(data => {
                if (data.status == 1) {
                    this.tableLoading = true;
                    this.$message({
                        type: 'success',
                        message: '批量重推已执行～'
                    });
                    this.firstLoad();
                } else {
                    this.$message.error(data.msg);
                    
                }
                let tempArr = this.tempSelectedArr;
                this.$refs.repushTable.clearSelection(tempArr);
            }).catch(err => {
                console.log(err);
            })


        },

        singleRecreate(index, row) {
            console.log('singleRecreate');
            let orderId = row.id;
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/ordermonitor/repush/${orderId}?${token}`, {
                
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.status == 1) {
                    this.tableLoading = true;
                    this.$message({
                        type: 'success',
                        message: '重推已执行～'
                    })
                    this.firstLoad();
                } else {    
                    this.$message.error(data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        },

        closeShowWarning() {
            console.log('closeShowWarning')
            this.emailArr = [""];
            this.showWarning = false;
        },

        addNewEmail() {
            this.emailArr.push("");
            this.deleteEmailBtnStatus();
        },

        deleteEmailBtnStatus() {
           if (this.emailArr.length == 1) {
                this.deleteBtnDisabled = true;
            } else {
                this.deleteBtnDisabled = false;
            } 
        },

        deleteEmail(scope) {
            let id = scope.row.id
            let index = scope.$index

            let token = localStorage.getItem('token');
            this.$http.get(`mgr/warning/profile/delete/${id}?${token}`).then(res => {
                return res.json();
            }).then(data => {
                if (data.status == 1) {
                    this.warringTable.splice(index, 1)
                } else {    
                    this.$message.error(data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        },

        addEmail(email) {
            console.log(email)
            let pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

            if (!pattern.test(email)) {
                this.$message.error('请按照email的格式书写～');
                return;
            }

            let obj = {
                value: email
            }
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/warning/profile/add?${token}`, obj).then(res => {
                return res.json()
            }).then(data => {
                if (data.status == 1) {
                    this.warningNotice()
                    this.warringForm.email = ''
                } else {
                    this.$message.error(data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        },

        warningNotice() {
            console.log('warningNotice');
            let token = localStorage.getItem('token');
            this.$http.get(`mgr/warning/profile/emails?${token}`).then(res => {
                return res.json();
            }).then(data => {
                if (data.status == 1) {
                    this.showPages = true
                    this.totalPagesWarring  =data.data.length
                    this.warringTable = data.data
                } else {    
                    this.$message.error(data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
            this.showWarning = true;
            this.deleteEmailBtnStatus();
        }
    }
}
</script>

<style lang="scss" scoped>
    .hang_wrapper {
        padding: 20px;
        border: 1px solid red;
        
    }

    .saveEmail {
        margin-top: 20px;
        text-align: center;
    }
    
    strong {
            color: blue;
        }
</style>


