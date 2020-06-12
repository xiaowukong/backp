<template>
  <div class="content-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>
    <div class="management-wrapper">
       <el-form ref="form" :inline="true" :model="form" label-width="100px" size="mini">

         <div class="el-form-item-buttons">

          <el-form-item label="服务名称">
            <el-input v-model="form.userDisplayName"></el-input>
          </el-form-item>


        </div>

        <div class="el-form-item-buttons t-btns">
          <el-form-item size="small">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">搜索</el-button>
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

              <el-button
                type="primary"
                size="mini"
                @click="addServe"
              >
                添加服务
              </el-button>
          </el-form-item>
        </div>
      </el-form>

            <el-table
                :data="table"
                stripe
                :highlight-current-row=true
                border
                size="mini"
                max-height="800"
                fit
                style="width: 100%"
                @expand="rowExpand">

                <el-table-column
                    type="expand">

                    <template slot-scope="props">
                        <el-table
                            size="mini"
                            :data="props.row.children"
                            border
                            fit
                            style="width: 100%">
                            <el-table-column label="服务名称" prop="serviceName">
                            </el-table-column>

                            <el-table-column label="服务编号" prop="serviceCode">
                            </el-table-column>

                            <el-table-column label="URL" prop="url">
                            </el-table-column>

                            <el-table-column label="服务上线时间" prop="onlineTime">
                            </el-table-column>

                            <el-table-column label="默认单价(元)" prop="defaultPrice">
                            </el-table-column>

                            <el-table-column label="默认折扣" prop="defaultPriceDiscout">
                            </el-table-column>

                            <el-table-column label="默认总价" prop="defaultPriceFinal">
                            </el-table-column>

                            <el-table-column label="最低优惠单价" prop="lowestPrice">
                            </el-table-column>

                            <el-table-column label="最低优惠折扣" prop="lowestPriceDiscount">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="serviceName"
                    label="服务名称"
                    >
                </el-table-column>


                <el-table-column
                    prop="serviceCode"
                    label="服务编号"
                    >
                </el-table-column>

                <el-table-column
                    prop="url"

                    label="URL">
                </el-table-column>

                <el-table-column
                    prop="onlineTime"
                    label="服务上线时间">
                </el-table-column>

                <el-table-column
                    prop="defaultPrice"
                    label="默认单价(元)">
                </el-table-column>

                <el-table-column
                    prop="defaultPriceDiscout"
                    label="默认折扣">
                </el-table-column>

                <el-table-column
                    prop="defaultPriceFinal"
                    label="默认总价">
                </el-table-column>

                <el-table-column label="最低优惠单价" prop="lowestPrice">
                </el-table-column>

                <el-table-column label="最低优惠折扣" prop="lowestPriceDiscount">
                </el-table-column>
            </el-table>
    </div><!-- .user-management-wrapper -->
    <!-- <galaxy-pagination></galaxy-pagination> -->
    <el-dialog 
      title="添加服务"
      width="900px"
      :visible.sync="showOrderDetail"
      :show-close="showClose"
      :close-on-click-modal="showClose"
      class="add_serve_dialog"
    >
      <el-form
         size="mini"
         class="add_serve_form"
         :model="addServeForm"
         :rules="rules"
         ref="addServeForm"
      >
        <el-form-item class="add_serve_form_item" label="(主)服务名称" prop="serviceName">
          <el-input v-model="addServeForm.serviceName"></el-input>
        </el-form-item>

        <el-form-item class="add_serve_form_item" label="服务编号" prop="serviceCode">
          <el-input v-model="addServeForm.serviceCode"></el-input>
        </el-form-item>

        <el-form-item class="add_serve_form_item" label="URL" prop="url">
          <el-input v-model="addServeForm.url"></el-input>
        </el-form-item>

        <el-form-item class="add_serve_form_item" label="默认单价" prop="defaultPrice">
          <el-input type="number" placeholder="请输入数字" v-model="addServeForm.defaultPrice"></el-input>
        </el-form-item>

        <el-form-item class="add_serve_form_item" label="默认折扣" prop="defaultPriceDiscout">
          <el-input type="number" placeholder="请输入数字" v-model="addServeForm.defaultPriceDiscout"></el-input>
        </el-form-item>

        <el-form-item class="add_serve_form_item" label="最低优惠折扣" prop="lowestPriceDiscount">
          <el-input type="number" placeholder="请输入数字" v-model="addServeForm.lowestPriceDiscount"></el-input>
        </el-form-item>

        <el-form-item class="add_serve_form_item">
          <el-button type="primary" @click="addServeSubmit('addServeForm')">确定</el-button>
          <el-button @click="cancleAddServe('addServeForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> <!-- 添加服务弹窗 -->
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
    this.loadData();
  },

  data() {

    return {
      showReturnBtn: false,
      datePicker: '',
      showOrderDetail: false, // 添加服务弹窗
      showClose: false,
      form: {
        userDisplayName: "",
        serviceName: "",
        userStatus: "",
        productID: ""
      },
      table: [],

      // 添加服务
      addServeForm: {
        serviceName: '',
        serviceCode: '',
        url: '',
        defaultPrice: '',
        defaultPriceDiscout: '',
        lowestPriceDiscount: ''
      },
      rules: {
        serviceName: [
          { required: true, message: '请输入(主)服务名称', trigger: 'blur' },
        ],
        serviceCode: [
          { required: true, message: '请输入服务编号', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入URL', trigger: 'blur' },
        ],
        defaultPrice: [
          { required: true, message: '请输入默认单价', trigger: 'blur' },
        ],
        defaultPriceDiscout: [
          { required: true, message: '请输入默认折扣', trigger: 'blur' },
        ],
        lowestPriceDiscount: [
          { required: true, message: '最低优惠折扣', trigger: 'blur' },
        ],
      }
      // 添加服务
    };
  },

  methods: {
    reloadComponent() {
      console.log('reload component ....');
      this.loadData();
      this.showReturnBtn = false;
      this.clearSearch();
    },

    clearSearch() {
      this.form.userDisplayName = '';
    },

    refreshTablePage(data) {
      console.log(data);
      this.tableLoading = false;
      const table = data.data;
      this.totalPages = data.data.total;
      this.table = table;
    },
    loadData() {
      console.log('%cBill_Management loading...', 'color:green;font-size:16px;');
      this.tableLoading = true;
      let token = localStorage.getItem('token');
      this.$http.get(`mgr/service/main?${token}`)
        .then(res => {
          return res.json();
        }).then(data => {
          if (data.status > -1) {
            this.refreshTablePage(data);
          } else {
            this.$message.error(data.msg);
          }
        }).catch(err => {
          console.log(err);
      });
    },
    rowExpand(row) {
        // this.listChildren = row.children;
        console.log("I'm expanding....");
        console.log(row);
    },

    // 搜索
    onSubmit() {
      console.log("onSubmit...");

      let userDisplayName = this.form.userDisplayName;
      if (userDisplayName == '') {
        this.$message.error('哈罗, 需要填写服务名称哦~ ;-)');
      }
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/service/list?${token}`, {
        name: userDisplayName
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        if (data.status > -1) {
          this.tableLoading = false;
          const table = data.data;
          this.table = table;
          this.showReturnBtn = true;
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 添加服务
    addServe() {
      this.showOrderDetail = true;
    },
    // 确认添加服务
    addServeSubmit(formName) {
      let addServeForm = this.addServeForm

      for(let item in addServeForm) {
        // 传值不能为空
        if(addServeForm[item] == '') {
          this.$message.error('输入内容不能有空');
          return
        } else if(Number(addServeForm[item])) {
          // 数字输入框获取的为string，转换为number
          addServeForm[item] = Number(addServeForm[item])
        }
      }

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/service/add?${token}`, addServeForm).then(res => {
        return res.json();
      }).then(data => {
        if (data.status == 1) {
          this.loadData()
          this.$refs[formName].resetFields();
          this.showOrderDetail = false
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log(err);
      });
      // 重置表单
      
    },
    // 取消添加服务
    cancleAddServe(formName) {
      // 重置表单
      this.$refs[formName].resetFields();
      this.showOrderDetail = false
    },

    changePassword(index, row) {
      console.log(index, row);
    },

    showMore(index, row) {
      console.log(index, row);
    },

    changePaymentStatus(index, row) {
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

.add_serve_dialog{
  margin-top: 15%;
}

.add_serve_form {
  width: 900px;
  height: 200px;
}

.add_serve_form_item {
  width: 200px;
  float: left;
  margin-left: 40px;
}

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
</style>






