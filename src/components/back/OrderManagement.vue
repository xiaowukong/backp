<template>
  <div class="content-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>
    <div class="management-wrapper">
       <el-form ref="form" :inline="true" :model="form" label-width="100px" size="mini">

         <div class="el-form-item-buttons">
          <el-form-item label="用户名">
            <el-input v-model="form.userDisplayName"></el-input>
          </el-form-item>

          <el-date-picker
            v-model="datePicker"
            type="month"
            size="mini"
            placeholder="选择日期">
          </el-date-picker>
        </div>

        <div class="el-form-item-buttons t-btns">
          <el-form-item size="small">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">搜索</el-button>
            <el-button type="primary" @click="clearSearch" size="mini" icon="el-icon-delete">重置</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="showReturnBtn"
              @click="reloadComponent">
              退出搜索</el-button>

            <el-button
              type="primary"
              size="mini"
              v-else
              disabled
            >退出搜索</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-table
        :data="table"
        stripe
        :highlight-current-row=true
        border
        v-loading="tableLoading"
        size="mini"
        max-height="800"
        fit
        style="width: 100%"
        @expand="rowExpand"
      >

        <el-table-column
          type="expand">
          <template slot-scope="props">
            <el-table
              size="mini"
              :data="props.row.serviceOrderDetail"
              border
              fit
              style="width:100%">

              <el-table-column
                label="服务名称"
                prop="serviceName">
              </el-table-column>

              <el-table-column
                label="服务次数"
                prop="serviceCount"
                sortable >
              </el-table-column>

              <el-table-column
                label="开始服务时间"
                prop="beginDate"
              >
              </el-table-column>

              <el-table-column
                label="结束服务时间"
                prop="endDate"
              >
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="showDetail(scope.$index, scope.row, props)"
                  >
                    订单详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column
            prop="merchantName"
            label="商户展示名"
            >
        </el-table-column>

        <el-table-column
            prop="totalServiceCount"
            sortable
            label="服务次数"
            >
        </el-table-column>
        
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showDetails(scope.$index, scope.row)"
            >
              订单详情
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div><!-- .user-management-wrapper -->
    <galaxy-pagination
      :totalPages = "totalPages"
      :pageSize="10"
      @currentPage = "requestPageList($event)"
    ></galaxy-pagination>

  <!-- 订单详情弹窗 -->
    <el-dialog 
      title="" 
      :visible.sync="showOrderDetail"
      @close="detailPanelClose">
        <h2>{{currentTtile}}</h2>
        <div class="fkhead">
          <p>商户名: <strong>{{ currentUser }}</strong></p>
          <p>{{ selectDate }}</p>
          <p>服务ID: <strong>{{ serviceCode }}</strong></p>
          <p>共<strong><span style="color: blue">{{ totalCount }}</span></strong>条数据</p>
          <p>正常订单<strong><span style="color: green">{{ normalCount }}</span></strong>条</p>
          <p>异常订单<strong><span style="color: red">{{ exceptionCount }}</span></strong>条</p>
        </div>
  <el-table
    v-loading="detailLoading"
    size="mini"
    :data="detailData">

    <el-table-column
      prop="merchantOrderNo"
      label="订单号"
      ></el-table-column>

    <el-table-column
      prop="updateTime"
      label="订单时间"
    ></el-table-column>

    <el-table-column
      prop="price"
      sortable
      label="单价(元/次)"
    ></el-table-column>

    <el-table-column
      prop="orderStatus"
      label="订单状态"
    ></el-table-column>
  </el-table>
  
  <div style="overflow:hidden;">
    <galaxy-pagination
      :totalPages="detailTotalRows"
      @currentPage="requestDetailList($event)"
    ></galaxy-pagination>
  </div>
</el-dialog><!-- 订单详情 -->
    </div><!-- .content-wrapper -->
</template>

<script>

import galaxyBreadcrumb from '../shared/Breadcrumb';
import galaxyPagination from '../shared/Pagination';

export default {
  components: {
    galaxyBreadcrumb,
    galaxyPagination
  },

  created() {
    this.selectDate = this.getCurrentDate();
    this.showMonth();
    this.loadData();
  },

  

  data() {
    return {
      displayMode: 'readTable',
      selectDate: '',
      showReturnBtn: false,
      merchantName: '',
      merchantId: '',
      serviceId: '',
      serviceCode: '',
      totalCount: '',
      normalCount: '',
      exceptionCount: '',
      detailLoading: false,
      totalPages: 0,
      detailTotalRows: 0,
      tableLoading: false,
      currentUser: '',
      currentTtile: '',
      datePicker: '',
      currentPage: '',
      showOrderDetail: false,
      form: {
        userDisplayName: "",
        serviceName: "",
        userStatus: ""
      },

      detailData: [],

      table: []
    };
  },

  computed: {

  },

  methods: {
    showMonth() {
      let date = new Date();
      this.datePicker = date.getFullYear() + '-' + this.formalDate(date.getMonth() + 1);
    },

    detailPanelClose() {
      console.log('detail panel close ...');
      this.detailData = [];
      this.currentUser = "";
      this.currentTtile = "";
      this.serviceCode = "";
      this.totalCount = "";
      this.normalCount = "";
      this.exceptionCount = "";
    },

    reloadComponent() {
      console.log('reload component ....');
      this.loadData();
      this.showReturnBtn = false;
      this.clearSearch();
      this.showMonth();
      this.displayMode = "readTable";
    },

    formalDate( value ) {
      if (value < 10) {
        return '0' + value;
      } else {
        return value;
      }
    },

    getCurrentDate(date) {
        let now = new Date();
        let year = now.getFullYear();
        let month = this.formalDate(now.getMonth() + 1);
        this.selectDate = date
        return `${year}-${month}`;
    },

    loadData() {
      console.log('%cOrder_Management loading ...', 'color:green;font-size:16px');
      this.tableLoading = true;

      let token = localStorage.getItem('token');
      this.$http.get(`mgr/order/main?${token}`)
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.refreshTablePage(data);
        });
    },

    refreshTablePage(data) {
      console.log(data);
      this.tableLoading = false;
      const table = data.data.records;
      this.totalPages = data.data.total;
      this.table = table;
    },

    rowExpand(row) {
      console.log("I'm expanding....");
      console.log(row);
    },

    clearSearch() {
      this.form.userDisplayName = '';
      this.datePicker = '';
      this.displayMode = "readTable";
    },

    showDetail(index, row, props) {
      console.log('订单详情');
      console.log(index, row, props);
      console.log(props.row.serviceOrderDetail[index]);
      this.currentUser = props.row.merchantName;
      this.currentTtile = props.row.serviceOrderDetail[index].serviceName
      
      this.merchantNo = props.row.merchantNo;
      this.serviceCode = props.row.serviceOrderDetail[index].serviceCode;
      console.log(this.serviceCode)
      console.log(props.row.merchantNo)
      // 头部tab名
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/order/service/services/${props.row.merchantNo}?${token}`, {

      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        
        if (data.status == -1) {
          this.$message.error(data.msg);
          return;
        }

        if (data.status == 1) {
          this.showOrderDetail = true;
          this.serviceId = data.data[0].id;

          let now = new Date();
          let year = now.getFullYear();
          let month = this.formalDate(now.getMonth() + 1);
          let nodate = `${year}-${month}`

          let datePicker;
          if ( (this.datePicker !== nodate) && this.datePicker ) {
            datePicker = this.datePicker.getFullYear() + '-' + this.formalDate(this.datePicker.getMonth() + 1);
            this.getCurrentDate(datePicker)
          } else {
            datePicker = now.getFullYear() + '-' + this.formalDate(now.getMonth() + 1);
          }

          let token = localStorage.getItem('token');
          this.$http.post(`mgr/order/service/order/overview?${token}`, {
            serviceCode: this.serviceCode,
            merchantNo: this.merchantNo,
            searchDate: datePicker
          }).then(res => {
            return res.json();
          }).then(data => {
            console.log(data);
            if (data.status == 1) {
              this.totalCount = data.data.totalCount;
              this.normalCount = data.data.normalCount;
              this.exceptionCount = data.data.exceptionCount;

              this.requestFKDetail();
            } else {
              this.$message.error(data.msg);
            }
          }).catch(err => {
            console.log( err );
          });
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    requestPageList(currentPage) {
      this.currentPage = currentPage;
      this.tableLoading = true;
      
      console.log('>>>>:::', currentPage);
      let obj = {};
      let datePicker = "";
      console.log('GGGGG>>>', this.displayMode);
      if (this.displayMode == 'readTable') {
        obj = {
          asc: true,
          merchantNo: '',
          orderNo: '',
          merchantName: this.merchantName,
          page: currentPage,
          pageSize: 10,
          serviceCode: '',
          serviceId: '',
          searchDate: ''          
        }
      } else {
        if ( this.datePicker ) {
          let time = new Date(this.datePicker);
        datePicker = time.getFullYear() + '-' + this.formalDate(time.getMonth() + 1);
      }
        obj = {
          asc: true,
          merchantNo: '',
          orderNo: '',
          merchantName: this.form.userDisplayName,
          page: currentPage,
          pageSize: 10,
          serviceCode: '',
          serviceId: '',
          searchDate: datePicker         
        }        
      }
      console.log('request page list ...');

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/order/list?${token}`, obj).then(res => {
        return res.json();
      }).then(data => {
        this.refreshTablePage(data);
      }).catch(err => {
        console.log(err);
      });
    },

    requestFKDetail( currentPage ) {
      console.log('request FK detail...');

      if (typeof currentPage == "undefined") {
        currentPage = 1;
      }

      let now = new Date();
      let year = now.getFullYear();
      let month = this.formalDate(now.getMonth() + 1);
      let nodate = `${year}-${month}`

      let datePicker;
      if ( (this.datePicker !== nodate) && this.datePicker ) {
        datePicker = this.datePicker.getFullYear() + '-' + this.formalDate(this.datePicker.getMonth() + 1);
        this.getCurrentDate(datePicker)
      } else {
        datePicker = now.getFullYear() + '-' + this.formalDate(now.getMonth() + 1);
      }

      console.log(datePicker)

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/order/service/order/page?${token}`, {
                asc: true,
                merchantNo: this.merchantNo,
                orderNo: "",
                page: currentPage,
                pageSize: 10,
                queryDate: '',
                serviceCode: this.serviceCode,
                serviceId: this.serviceId,
                searchDate: datePicker
              }).then(res => {
                return res.json();
              }).then(data => {
                console.log(data);

                if (data.status > -1) {
                  this.detailData = data.data.records;
                  this.detailTotalRows = data.data.total;
                } else {
                  this.$message.error(data.msg);
                }
              })     
    },

    requestDetailList(currentPage) {
      console.log('request detail list ....');

      this.requestFKDetail(currentPage);
    },

    formalDate(value) {
      if (value < 10) {
        return '0' + value;
      } else {
        return value;
      }
    },

    onSubmit() {
      let now = new Date();
      let year = now.getFullYear();
      let month = this.formalDate(now.getMonth() + 1);
      let nodate = `${year}-${month}`
      console.log('搜索中...');
      this.tableLoading = true;
      this.displayMode = 'readSearch';

      let datePicker;
      let username = this.form.userDisplayName;
      if ( (this.datePicker !== nodate) && this.datePicker ) {
        datePicker = this.datePicker.getFullYear() + '-' + this.formalDate(this.datePicker.getMonth() + 1);
        console.log(datePicker)
        this.getCurrentDate(datePicker)
      } else {
        datePicker = now.getFullYear() + '-' + this.formalDate(now.getMonth() + 1);
      }
      
      if ( username == "" && datePicker == "" ) {
        this.$message.error('哈罗, 至少要填写一项才能搜索哦~ :-)');
        this.tableLoading = false;
        return;
      }
      
      let obj = {
          asc: true,
          merchantNo: '',
          orderNo: '',
          merchantName: username,
          page: 1,
          pageSize: 10,
          serviceCode: '',
          serviceId: '',
          searchDate: datePicker         
      };
      
      console.log('on submit ...');

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/order/list?${token}`, obj).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        if (data.status != -1) {

          this.tableLoading = false;
          const table = data.data.records;
          this.totalPages = data.data.total;
          this.table = table;
          this.showReturnBtn = true;
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log( err );
      });
    },

    changePassword(index, row) {
      console.log(index, row);
    },

    handleSizeChange(val) {
      console.log(`${val} items per page.`);
    },

    handleCurrentChange(val) {
      console.log(`current: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor {
    margin-top: 1px;
}
.el-header {
  background: rgb(84, 92, 100);
  color: white;
  line-height: 60px;
  height: 60px;
  h1 {
    span {
      font-weight: normal;
      font-size: 20px;
      margin-left: 10px;
    }
  }
}

.el-menu-wrapper {
  min-height: 800px;
  background: #545c64;
}

.el-menu-item {
  text-align: center;
  padding-left: 30px !important;
}

.el-menu-item.is-active {
  background-color: #333 !important;
}

.el-form-wrapper {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  padding-top: 20px;
  .el-form {
    width: 1000px;
  }
}


.el-table-wrapper {
  margin-top: 20px;
}

.el-table td,
.el-table th {
  padding: 0 !important;
}

.el-pagination-wrapper {
  float: right;
  padding: 20px 0;
  margin-bottom: 60px;
}

.el-form-item-buttons {
  padding-left: 20px;
  float: left;
}

.t-btns {
  margin-top: -2px;
}

.fkhead {
  overflow: hidden;
  margin-top: 15px;
  p {
    float: left;
    margin-right: 20px;
  }
}


</style>


