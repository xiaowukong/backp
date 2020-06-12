<template>
  <div class="content-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>
    <div class="management-wrapper">
        <el-form ref="form" :inline="true" :model="form" label-width="100px" size="mini">

            <el-form-item label="商户">
                <el-select
                  v-model="form.comTenant.value"
                  placeholder="请选择"
                  @change="comTenantSel"
                >
                  <el-option
                    v-for="item in form.comTenant.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="账户名">
                <el-input v-model="form.operatorName">账户名</el-input>
            </el-form-item>

            <el-form-item size="mini">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">搜索</el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" @click="clearSearch">清空条件</el-button>
                <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addOperator">添加账户</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-if="showReturnBtn"
                  @click="reloadComponent">
                  退出搜索
                </el-button>

                <el-button
                  type="primary"
                  size="mini"
                  v-else
                  disabled>
                  退出搜索
                </el-button>
            </el-form-item>
          </el-form>
                
            <el-table
                :data="table"
                stripe
                border
                size="mini"
                fit
                max-height="800"
                v-loading="tableLoading"
                style="width: 100%">

                <el-table-column
                    prop="username"
                    label="账户名">
                </el-table-column>

                <el-table-column
                    prop="merchantName"
                    label="商户名">
                </el-table-column>

                <el-table-column
                    prop="roles[0].name"
                    label="角色">
                </el-table-column>

                <el-table-column
                    prop="createTime"
                    label="创建时间">
                </el-table-column>

                <el-table-column
                    prop="mobile"
                    label="手机号">
                </el-table-column>

                <el-table-column
                    prop="status"
                    label="账户状态">
                </el-table-column>                  

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  
                            size="mini"
                            type="warning"
                            @click="changePasswordPanel(scope.$index, scope.row)">修改密码</el-button>

                        <el-button
                            size="mini"
                            type="danger"
                            v-if="scope.row.normalBtn"
                            @click="banUser(scope.$index, scope.row)">禁用</el-button>

                        <el-button
                            size="mini"
                            v-else
                            @click="activeUser(scope.$index, scope.row)">启用</el-button>
                    </template>
                </el-table-column>
            </el-table>                   
    </div><!-- .user-management-wrapper -->   
    <galaxy-pagination 
      :totalPages="totalPages"
      :pageSize="10"
      @currentPage="requestPageList($event)"></galaxy-pagination>

    <el-dialog :width="addUserDialogWidth" :visible.sync="addNewUserVisible">
        <el-form 
          :model="addUserDialogData"
          :rules="addUserDialogRules"
          ref="addUserRefs"
          status-icon>
          <el-form-item size="mini" label="账户名" prop="loginName" required>
            <el-input size="mini" v-model="addUserDialogData.loginName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item size="mini" label="姓名" prop="name" required>
            <el-input size="mini" v-model="addUserDialogData.name" autocomplete="off"></el-input>
          </el-form-item>          
    
          <el-form-item size="mini" label="手机号" prop="cellphone" required>
            <el-input size="mini" v-model="addUserDialogData.cellphone" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item size="mini" prop="password" label="密码【如果留空, 则使用默认密码】">
            <el-input type="password" size="mini" v-model="addUserDialogData.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item size="mini" prop="role" label="所属商户" required>
            <el-select @change="selectRole" v-model="selectItem" placeholder="请选择">
                <el-option 
                   v-for="item in userCategories"
                   :key="item.merchantNo"
                  :label="item.merchantName" 
                  :value="item.merchantNo">
                </el-option>
            </el-select>
          </el-form-item>

  
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button 
            size="mini"
            @click="closeOperatorPanel">取消</el-button>
          <el-button 
            type="primary" 
            @click="postNewOperator"
            size="mini">确定</el-button>
        </div>
      </el-dialog>

      <!-- 修改密码弹窗 -->
        <el-dialog 
          width="300px" 
          center 
          title="" 
          :visible.sync="showChangePasswordPanel"
          @close="closeChangePasswordPanel">
          <el-form :model="changePassword">
            <p style="margin-bottom: 10px;">您正在准备修改 <strong style="color:blue;">{{ currentRow.username }}</strong> 的密码</p>
            <el-form-item size="mini" label="">
              <el-input type="password" v-model="changePassword.first" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeChangePasswordPanel">取 消</el-button>
            <el-button size="mini" type="primary" @click="postChangePassword">确 定</el-button>
          </div>
          </el-dialog>
      <!-- end of 修改密码弹窗 -->
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

  data() {
    var loginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商户登录名不能为空'));
      }
    };

    var cellphone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'));
      }
    };

    var name = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'));
      }
    };

    return {
      showReturnBtn: false,
      changePassword: {
        first: ''
      },
      currentRow: {},
      userCategories: [],
      showChangePasswordPanel: false,
      totalPages: 0,
      tableLoading: false, 
      addNewUserVisible: false,
      addUserDialogWidth: '400px',
      selectMerchatId: '',
      selectItem: '',
      name: '',
      addUserDialogData: {
        loginName: "",
        cellphone: '',
        password: '',
        name: '',
        role: {
          key1: 'Alice',
          key2: 'Steve'
        }
      },

      addUserDialogRules: {
        loginName: [
          { validator: loginName, trigger: 'blur' }
        ],

        name: [
          { validator: name, trigger: 'blur' }
        ],

        cellphone: [
          { validator: cellphone, trigger: 'blur' }
        ]
      },

      form: {
        comTenant: {
          value: '',
          options: [

          ]
        },
        operatorName: ""
      },

      table: []
    };
  },

  // onload
  created() {
    this.loadData();
    this.comTenant()
  },

  methods: {

    // 选择商户
    comTenantSel() {
      this.form.operatorName = ''
    },

    // 商户
    comTenant() {
      let token = localStorage.getItem('token');

      this.$http.post(`mgr/merchant/list?${token}`, {
        pageSize: 100
      })
      .then(res => {
        return res.json();
      })
      .then( data => {
        if (data.status == 1) {
          data.data.records.forEach(item => {
            this.form.comTenant.options.push({
              label: item.merchantName,
              value: item.merchantNo
            })
          })
        } else {
          this.$message.error(data.msg);
        }
        
      })
      .catch(err => {
        console.log(err);
      });
    },
    

    clearAddOperator() {
      console.log('clear add operator ...');
      this.addUserDialogData.loginName = "";
      this.addUserDialogData.cellphone = "";
      this.addUserDialogData.password = "";
      this.addUserDialogData.selectItem = "";
    },
    reloadComponent() {
      console.log('reload component ....');
      this.loadData();
      this.showReturnBtn = false;
      this.clearSearch();
    },
    postNewOperator() {
      console.log('post new operator ....');
      let token = localStorage.getItem('token');

      this.$http.post(`mgr/user/add?${token}`, {
        username: this.addUserDialogData.loginName,
        mobile: this.addUserDialogData.cellphone,
        password: this.addUserDialogData.password,
        merchantNo: this.selectMerchantId,
        name: this.addUserDialogData.name
      })
      .then(res => {
        return res.json();
      })
      .then( data => {
        console.log(data);
        if (data.status > -1) {
          this.addNewUserVisible = false;
          this.clearAddOperator();
          this.loadData();
        } else {
          this.$message.error(data.msg);
        }
        
      })
      .catch(err => {
        console.log(err);
      });
      
    },

    loadData() {
    console.log('%cOperator_management loading...', 'color:green;font-size:16px');
    this.tableLoading = true;
    
    let token = localStorage.getItem('token');
      this.$http.get(`mgr/user/add/form?${token}`)
        .then( res => {
          return res.json();
        })
        .then( data => {
          console.log(data);
          console.log('^^^^^^^^^^^^');
          this.userCategories = data.data.merchants;
          console.log(data.data.merchants);
          console.log('$$$$$$$$$$$');

          let token = localStorage.getItem('token');

          this.$http.get(`mgr/user/main?${token}`)
            .then( res => {
              return res.json();
            })
            .then(data => {
              this.refreshTablePage(data);
            })
            .catch( err => {
              console.log( err );
          });

        })
        .catch( err => {
          console.log(err);
        });
    },

    refreshTablePage(data) {
      console.log(data);

      this.tableLoading = false;
        const table = data.data.records;
        table.forEach(( item ) => {
          if (item.status == 1) {
            item.status = '禁用';
            item.normalBtn = false;
          }

          if (item.status == 2) {
            item.status = '启用';
            item.normalBtn = true;
          }
        });
        this.table = table;
        this.totalPages = data.data.total;    
    },

    // 分页
    requestPageList(currentPage) {
      this.tableLoading = true;

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/user/list?${token}`, {
        asc: false,
        page: currentPage,
        pageSize: 10,
        username: ''
      }).then(res => {
        return res.json();
      }).then(res => {

        const table = res.data.records;
        table.forEach(( item ) => {
          if (item.status == 1) {
            item.status = ' 正常';
            item.normalBtn = true;
            console.log('<<<<');
            console.log(item);
          }

          if (item.status == 2) {
            item.status = '禁用';
            item.normalBtn = false;
            console.log('>>>>');
            console.log(item);
          }
        });
        this.table = table;
        this.totalPages = res.data.total;
        this.tableLoading = false;
      }).catch(err => {
        console.log(err)
      });
    },

    // 搜索按钮
    onSubmit() {
      this.tableLoading = true;
      // if(!this.form.comTenant.value) {
      //   this.$message.error('请选择商户');
      //   this.tableLoading = false;
      //   return
      // }
      // if( !this.form.operatorName ) {
      //   this.$message.error('请输入账户名');
      //   this.tableLoading = false;
      //   return;
      // }

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/user/list?${token}`, {
        username: this.form.operatorName,
        asc: true,
        page: 1,
        pageSize: 10,
        merchantId: this.form.comTenant.value
      }).then(res => {
        return res.json();
      }).then(data => {
        
        console.log( data );
        this.tableLoading = false;
        const table = data.data.records;
        this.totalPages = data.data.total;
        this.table = table;
        this.showReturnBtn = true;
      }).catch( err => {
        console.log( err );
      });

      console.log('搜索中...');
    },

    // 添加账户 选择所属商户
    selectRole( item ) {
      console.log( item );
      this.selectMerchantId = item;
    },

    // 清空搜索
    clearSearch() {
      this.form.comTenant.value = ''
      this.form.operatorName = "";
    },

    // 添加账户
    addOperator() {
      this.addNewUserVisible = true;
      this.clearAddOperator();
    },

    // 关闭“添加账户”面板
    closeOperatorPanel() {
      this.addNewUserVisible = false;
      this.addUserDialogData.selectItem = "";
      this.addUserDialogData.loginName = "";
      this.addUserDialogData.displayName = "";
      this.addUserDialogData.password = "";
    },

    changePasswordPanel(index, row) {
      console.log(index, row);
      this.showChangePasswordPanel = true;
      this.currentRow = row;
    },

    closeChangePasswordPanel() {
      this.changePassword.first = '';
      this.showChangePasswordPanel = false;
    },

    postChangePassword() {
      console.log('changing password ...');
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/user/resetPassword?${token}`, {
        password: this.changePassword.first,
        uid: this.currentRow.id
      }).then(res => {
        return res.json();
      }).then(data => {
        if ( data.status > 0 ) {
          this.closeChangePasswordPanel();
        } else {
          this.$message.error( data.msg );
        }
      }).catch( err => {
        console.log( err );
      });
      
    },

    activeUser(index, row) {
      console.log(index, row);

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/user/unlock/${row.id}?${token}`, {

      }).then( res => {
        return res.json();
      }).then( data => {
        console.log(data);

        if (data.status == 1) {
          row.status = '正常';
          row.normalBtn = !row.normalBtn;
        } else {
          this.$message.error(data.msg);
        }
      }).catch( err => {
        console.log(err);
      });
    },

    banUser(index, row) {
      console.log(index, row);

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/user/lock/${row.id}?${token}`, {

      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        if (data.status == 1) {
          row.status = '禁用';
          row.normalBtn = !row.normalBtn;
        }

        if (data.status == -1) {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log(err);
      });
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
</style>





