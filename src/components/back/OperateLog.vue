<template>
  <div class="content-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>
    <div class="management-wrapper">
       <el-form ref="form" :inline="true" :model="form" label-width="100px" size="mini">
        <el-form-item label="操作名称">
          <el-input v-model="form.actionName"></el-input>
        </el-form-item>

         <el-form-item label="操作页面">
          <el-input v-model="form.actionPage"></el-input>
        </el-form-item>

        <el-form-item label="是否运营账户">
          <el-select @change="selectAccount" v-model="form.merchantFlag" placeholder="请选择">
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <div class="el-form-item-buttons t-btns-2">
            <span class="operateLabel">操作日期</span>
          <el-form-item size="small">
            <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          </div>

          <div class="el-form-item-buttons t-btns">
          <el-form-item size="small">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">搜索</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="clearSearch">重置</el-button>
            
            <el-button
              type="primary"
              size="mini"
              v-if="showReturnBtn"
              @click="reloadComponent">退出搜索</el-button>

            <el-button
              type="primary"
              size="mini"
              v-else
              disabled>退出搜索</el-button>            
          </el-form-item>

        </div>
      </el-form>

            <el-table
                :data="table"
                stripe
                border
                size="mini"
                max-height="600"
                fit
                style="width: 100%">

                <el-table-column
                    prop="username"
                    label="操作用户">
                </el-table-column>

                <el-table-column
                    prop="actionName"
                    label="操作名称">
                </el-table-column>

                <el-table-column
                    prop="actionPage"
                    label="操作页面">
                </el-table-column>

                <el-table-column
                    prop="params"
                    label="参数">
                </el-table-column>

                <el-table-column
                    prop="createTime"
                    label="操作日期">
                </el-table-column>

                <el-table-column
                    prop="ip"
                    label="IP">
                </el-table-column>
            </el-table>
    </div><!-- .user-management-wrapper -->

    <galaxy-pagination
      :totalPages = "totalPages"
      :pageSize="10"
      @currentPage = "requestList($event)"
    ></galaxy-pagination>
    </div><!-- .content-wrapper -->
</template>

<script>
import galaxyBreadcrumb from '../shared/Breadcrumb';
import galaxyPagination from '../shared/Pagination';
import { second2Date } from '../../../util';

export default {
  components: {
    galaxyBreadcrumb,
    galaxyPagination
  },

  created() {
    this.loadData();

  },

  data() {
    return {
      table: [],
      displayMode: 'readTable',
      totalPages: 0,
      showReturnBtn: false,
      currentPage: '',
      tableLoading: true,
      form: {
        actionName: "",
        actionPage: "",
        merchantFlag: ""
      },
      displayMode: 'readTable',
      timeRange: ['', ''],
      startDate: '',
      endDate: ''
    };
  },

  methods: {
    reloadComponent() {
      console.log('reload component ....');
      
      this.loadData();
      this.showReturnBtn = false;
      this.clearSearch();
      this.showToday();
      this.displayMode = "readTable";
    },

    showToday() {
      let today = second2Date(new Date().getTime(), true);
      this.timeRange[0] = today + ' 00:00:00';
      this.timeRange[1] = today + ' 23:59:59';
      console.log('>>> ', today);
      console.log(this.timeRange);
      console.log('show today ...');
    },

    loadData() {
      this.showToday();
      this.tableLoading = true;

    let token = localStorage.getItem('token');
    this.$http.post(`mgr/log/list?${token}`, {})
      .then(res => {
        return res.json();
      }).then(data => {
        this.refreshTablePage(data);
      }).catch(err => {
        console.log(err);
      });
    },

    refreshTablePage(data) {
      console.log(data);
      this.tableLoading = false;
      const table = data.data.records;
      this.totalPages = data.data.total;
      this.table =table;
    },
    requestList(currentPage) {
      this.currentPage = currentPage;
      console.log(currentPage);

      this.tableLoading = true;

      let requestObj = {};
      console.log('>>>>', this.displayMode);

      if (this.displayMode == "readTable") {
        requestObj = {
          actionName: '',
          asc: true,
          findBeginDate: '',
          findEndDate: '',
          merchantName: '',
          actionPage: '',
          page: currentPage,
          pageSize: 10,
          merchantFlag: ''          
        };
      } else {
        

        requestObj = {
          actionName: this.form.actionName,
          actionPage: this.form.actionPage,
          asc: true,
          findBeginDate: this.startDate,
          findEndDate: this.endDate,
          merchantName: '',
          page: currentPage,
          pageSize: 10,
          merchantFlag: this.form.merchantFlag          
        }
      }

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/log/list?${token}`, requestObj)
        .then(res => {
          return res.json();
        }).then(data => {
          console.log(data);

          if (data.status != -1) {
            // success
            this.table = data.data.records;
          } else {
            this.$message.error(data.msg);
          }
        }).catch(err => {
          console.log(err);
        });
    },

    selectAccount() {
      console.log('select account ...');
      console.log(this.form.merchantFlag);
    },

    clearSearch() {
      this.form.actionName = "";
      this.form.actionPage = "";
      this.form.merchantFlag = "";
      this.timeRange = ['', ''];
      this.displayMode = "readTable";
    },

    formalDate( value ) {
      if (value < 10) {
        return '0' + value;
      } else {
        return value;
      }
    },

    onSubmit() {
      console.log("onSubmit...");

      let actionName = this.form.actionName.trim();
      let actionPage = this.form.actionPage.trim();
      let merchantFlag = this.form.merchantFlag.trim();
      let timeRange = this.timeRange;

      let startDate, endDate;

      this.displayMode = "readSearch";

      // 至少填写一项才能搜索
      let condition = (actionName == "" && actionPage == "" && merchantFlag == "" && timeRange[0] == "" && timeRange[1] == "");

      if (condition) {
        this.$message.error('哈罗～ 至少要填写一项哦～ ;-)');
      }
      // console.log('>>>>', timeRange[0]);
      if (timeRange[0]) {
        let time = new Date(timeRange[0]);
        // startDate = time.getFullYear() + '-' + this.formalDate(time.getMonth() + 1) + '-' + this.formalDate(time.getDate());
        startDate = second2Date(time);

        this.startDate = startDate;
      }
      
      if (timeRange[1]) {
        let time = new Date(timeRange[1]);
        // endDate = time.getFullYear() + '-' + this.formalDate(time.getMonth() + 1) + '-' + this.formalDate(time.getDate());
        endDate = second2Date(time);

        this.endDate = endDate;
      }
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/log/list?${token}`, {
        actionName: this.form.actionName,
        asc: true,
        findBeginDate: startDate,
        findEndDate: endDate,
        merchantName: '',
        page: 1,
        pageSize: 10,
        actionPage: this.form.actionPage,
        merchantFlag: this.form.merchantFlag
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);

        if (data.status != -1) {
          this.table = data.data.records;
          this.totalPages = data.data.total;
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

    showMore(index, row) {
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

.t-btns {
  display: block;
  clear: both;
}

.t-btns-2 {
  float: left;
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
}

span.operateLabel {
    display: inline-block;
    font-size: 14px;
    color: #626066;
    margin-top: 4px;
    margin-right: 20px;
}
</style>




