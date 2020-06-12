<template>
    <div class="content-wrapper">
        <galaxy-breadcrumb></galaxy-breadcrumb>

        <div class="loan-wrapper">
            <el-form
                size="mini"
                :inline="true"
            >
            
            <el-form-item
                label="日期"
            >
                <el-date-picker
                    v-model="dateContainer"
                    @change="selectDate"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="订单号">
                <el-input v-model="bookNumber"></el-input>
            </el-form-item>

            <br>

             <el-form-item
                    label="商户"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="merchantId"
                        @change="selectMerchant"
                    >
                        <el-option
                            v-for="(item, index) in merchantArr"
                            :key="index"
                            :value="item.id"
                            :label="item.merchantName"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="设备类型"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="platform"
                        @change="selectPlatform"
                    >
                        <el-option
                            label="全部"
                            value=""
                        ></el-option>

                        <el-option
                            label="H5"
                            value="H5"
                        ></el-option>

                        <el-option
                            label="ANDROID"
                            value="ANDROID"
                        ></el-option>

                        <el-option
                            label="IOS"
                            value="IOS"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="订单状态"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="bookStatus"
                        @change="selectBookStatus"
                    >
                        <el-option
                            label="全部"
                            value=""
                        ></el-option>

                        <el-option
                            label="逾期"
                            value="COLLECTION"
                        ></el-option>

                        <el-option
                            label="逾期已还款"
                            value="COLLECTION_PAIDOFF"
                        ></el-option>

                        <el-option
                            label="已还款"
                            value="PAIDOFF"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <br>

                <el-form-item>
                    <el-button
                        type="primary"
                        @click="search(1)"
                    >查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        @click="reloadComponent"
                        :disabled="quitSearchStatus"
                    >退出查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="warning"
                        @click="exportXLS"

                        :disabled="exportDisabled"
                    >导出</el-button>
                </el-form-item>

            </el-form>

            <el-table
                size="mini"
                stripe
                :data="tableData"
                v-loading="tableLoading"
            >
                <el-table-column
                    label="订单号"
                    prop="loanNo"
                ></el-table-column>

                <el-table-column
                    label="customerId"
                    prop="customerId"
                ></el-table-column>

                 <el-table-column
                    label="下单时间"
                    prop="createTime"
                ></el-table-column>

                 <el-table-column
                    label="商户"
                    prop="merchantName"
                ></el-table-column>

                 <el-table-column
                    label="设备类型"
                    prop="device"
                ></el-table-column>

                 <el-table-column
                    label="产品"
                    prop="pipelineGroupName"
                ></el-table-column>

                 <el-table-column
                    label="订单状态"
                    prop="orderStatus"
                ></el-table-column>

                 <el-table-column
                    label="借款开始时间"
                    prop="effectiveDate"
                ></el-table-column>

                 <el-table-column
                    label="借款到期时间"
                    prop="dueDate"
                ></el-table-column>

                 <el-table-column
                    label="还款完成时间"
                    prop="paidOffTime"
                ></el-table-column>

                 <el-table-column
                    label="逾期情况"
                    prop="overdueTime"
                ></el-table-column>

            </el-table>

            <galaxy-pagination
                :totalPages="totalPages"
                :pageSize="pageSize"
                @currentPage="requestPageList($event)"
            ></galaxy-pagination> 
        </div>
    </div>
</template>

<script>
import galaxyBreadcrumb from '../shared/Breadcrumb';
import galaxyPagination from '../shared/Pagination';
import { second2Date } from '../../../util';
import { EXPORT_URL } from '../../../api_root'

export default {
    components: {
        galaxyBreadcrumb,
        galaxyPagination
    },

    data() {
        return {
            exportDisabled: true,

            displayMode: 'readTable',

            tableLoading: false,

            dateContainer: ['', ''],
            bookNumber: '',

            merchantId: '',
            merchantArr: [
                {
                    id: '',
                    merchantName: '全部'
                }
            ],

            bookStatus: '',
            platform: '',

            totalPages: 0,
            pageSize: 10,

            startTime: '',
            endTime: '',

            tableData: [],
            quitSearchStatus: true
        }
    },

    created() {
        this.getMerchant();
        this.firstLoad();
    },

    methods: {

        reloadComponent() {
            console.log('reload component ... ');

            this.clearSearch();

            this.firstLoad();
            this.displayMode = "readTable";
            this.quitSearchStatus = true;
        },

        clearSearch() {
            this.dateContainer = ['', ''];
            this.startTime = "";
            this.endTime = "";
            this.bookNumber = "";
            this.merchantId = "";
            this.platform = "";
            this.bookStatus = "";
        },

        requestPage(obj) {
            this.tableLoading = true;
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/loanmonitor/list?${token}`, obj)
                .then(res => {
                    return res.json()
                }).then(data => {
                    console.log(data);

                    if (data.status == 1) {
                        this.tableData = data.data.records;
                        this.totalPages = data.data.total;
                        this.tableLoading = false;
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                    this.tableLoading = false;
                })
        },

        requestPageList(page) {
            let obj = {};
            if (this.displayMode == "readTable") {
                obj = {
                    page,
                    pageSize: 10,
                    merchantId: "",
                    deviceId: "",
                    orderStatus: "",
                    orderNo: "",
                    startTime: "",
                    endTime: ""    
                }
            } else {
                // let startTime = "";
                // if (this.startTime) {
                //     startTime = this.startTime;
                // }

                // let endTime = "";
                // if (this.endTime) {
                //     endTime = this.endTime;
                // }


                let today = second2Date(new Date().getTime(), true);
                let startTime = "";
                if (this.dateContainer[0]) {
                    startTime = second2Date(this.dateContainer[0]);
                } else {
                    startTime = today + ' 00:00:00';
                }

                let endTime = "";
                if (this.dateContainer[1]) {
                    endTime = second2Date(this.dateContainer[1]);
                } else {
                    endTime = today + ' 23:59:59';
                }

                let orderNo = "";
                if (this.bookNumber) {
                    orderNo = this.bookNumber;
                }

                let merchantId = "";
                if (this.merchantId) {
                    merchantId = this.merchantId;
                }

                let deviceId = "";
                if (this.platform) {
                    deviceId = this.platform;
                }

                let orderStatus = "";
                if (this.bookStatus) {
                    orderStatus = this.bookStatus;
                }

                obj = {
                    page,
                    pageSize: 10,
                    merchantId,
                    deviceId,
                    orderStatus,
                    orderNo,
                    startTime,
                    endTime
                }
            }

            this.requestPage(obj);
        },

        firstLoad() {
            this.tableLading = true;

            let today = second2Date(new Date().getTime(), true);
            this.dateContainer[0] = today + ' 00:00:00';
            this.dateContainer[1] = today + ' 23:59:59';

            let token = localStorage.getItem('token');
            this.$http.get(`mgr/loanmonitor/main?${token}`)
                .then(res => {
                    return res.json()
                }).then(data => {
                    console.log(data);

                    if (data.status == 1) {
                        let records = data.data.records;
                        
                        if (records.length > 0) {
                            this.exportDisabled = false;
                        }

                        this.tableData = records;
                        this.totalPages = data.data.total;
                        this.tableLoading = false;
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                });
        },

        getMerchant() {
            let token = localStorage.getItem('token');
            this.$http.get(`mgr/loanmonitor/merchant?${token}`)
                .then(res => {
                    return res.json()
                }).then(data => {
                    console.log(data);

                    if (data.status == 1) {
                        this.merchantArr = [...this.merchantArr, ...data.data];
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                });            
        },

        search(num) {
            this.tableLoading = true;
            console.log('search ... ');

            let today = second2Date(new Date().getTime(), true);
            let startTime = "";
            if (this.dateContainer[0]) {
                startTime = second2Date(this.dateContainer[0]);
            } else {
                startTime = today + ' 00:00:00';
            }

            let endTime = "";
            if (this.dateContainer[1]) {
                endTime = second2Date(this.dateContainer[1]);
            } else {
                endTime = today + ' 23:59:59';
            }

            // let startTime = "";
            // if (this.startTime) {
            //     startTime = this.startTime;
            // }

            // let endTime = "";
            // if (this.endTime) {
            //     endTime = this.endTime;
            // }

            let orderNo = "";
            if (this.bookNumber) {
                orderNo = this.bookNumber;
            }

            let merchantId = "";
            if (this.merchantId) {
                merchantId = this.merchantId;
            }

            let deviceId = "";
            if (this.platform) {
                deviceId = this.platform;
            }

            let orderStatus = "";
            if (this.bookStatus) {
                orderStatus = this.bookStatus;
            }

            let token = localStorage.getItem('token');
            this.$http.post(`mgr/loanmonitor/list?${token}`, {
                page: num,
                pageSize: 10,
                merchantId,
                deviceId,
                orderStatus,
                orderNo,
                startTime,
                endTime
            }).then(res => {
                return res.json();
            }).then(data => {
                console.log(data)

                if (data.status == 1) {
                    this.tableData = data.data.records;
                    this.totalPages = data.data.total;
                    this.displayMode = "readSearch";
                    this.quitSearchStatus = false;
                    // this.tableLoading = false;
                } else {
                    this.$message.error(data.msg);
                }
            }).catch(err => {
                console.log(err);
                // this.tableLoading = false;
            })

            this.tableLoading = false;
        },
        selectDate() {
            console.log('select Date ... ');
            let date = this.dateContainer;

            let today = second2Date(new Date().getTime(), true);
            let startTime = "";
            if (this.dateContainer[0]) {
                startTime = second2Date(this.dateContainer[0]);
            } else {
                startTime = today + ' 00:00:00';
            }

            let endTime = "";
            if (this.dateContainer[1]) {
                endTime = second2Date(this.dateContainer[1]);
            } else {
                endTime = today + ' 23:59:59';
            }

            // if (date[0]) {
            //     this.startTime = second2Date(date[0]);
            // }
             
            // if (date[1]) {
            //     this.endTime = second2Date(date[1]);
            // }
        }, 

        selectMerchant() {
            console.log('select Merchant ... ');
        },

        selectBookStatus() {
            console.log('select book status ... ');
        },

        selectPlatform() {
            console.log('select plat form ... ');
        },

        exportXLS() {
            console.log('export xls ... ');

            if(this.dateContainer == null) {
                this.dateContainer = ["",""]
            }
            this.displayMode = "searchTable";

            let startTime = null;
            if (this.dateContainer[0]) {
                startTime = second2Date(this.dateContainer[0]);
            }

            let endTime = null;
            if (this.dateContainer[1]) {
                endTime = second2Date(this.dateContainer[1]);
            }

            let merchantId = "";
            if (this.merchantId) {
                merchantId = this.merchantId;
            }

            let deviceId = "";
            if (this.deviceId) {
                deviceId = this.deviceId;
            }

            let product = "";
            if (this.product) {
                product = this.product;
            }

            let pipeline = "";
            if (this.pipeline) {
                pipeline = this.pipeline;
            }

            console.log(startTime,"-", endTime, "-", merchantId, "-" ,deviceId,  "-" ,product,  "-" ,pipeline)
            
            let token = localStorage.getItem('token');

            var temp = document.createElement("form"); 
            // temp.action = `http://10.17.87.72:2000//mgr/loanmonitor/download?${token}`;
            temp.action = `${EXPORT_URL}/mgr/loanmonitor/download?${token}`;
            temp.method = "post"; 
            temp.style.display = "none"; 
            
            startTime ? this.addPara(temp,"startTime", `${startTime}`) : null
            endTime ? this.addPara(temp,"endTime", `${endTime}`) : null
            this.addPara(temp,"merchantId",`${merchantId}`);
            this.addPara(temp,"deviceId",`${deviceId}`);
            this.addPara(temp,"groupId",`${product}`);
            this.addPara(temp,"pipelineCode",`${pipeline}`);

            document.body.appendChild(temp); 
            temp.submit();
            
        },

        addPara(form,key,value) {
          var opt = document.createElement("textarea"); 
          opt.name = key; 
          opt.value = value; // alert(opt.name) 
          form.appendChild(opt); 
        },
    }
}
</script>

<style lang="scss" scoped>

</style>