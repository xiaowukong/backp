<template>
  <div class="content-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>
    <div class="management-wrapper">
       <el-form ref="form" :inline="true" :model="searchForm" label-width="100px" size="mini">
        <el-form-item label="商户展示名">
          <el-input v-model="searchForm.userDisplayName"></el-input>
        </el-form-item>

         <!-- <el-form-item label="商户ID">
          <el-input v-model="searchForm.userID"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="商户状态">
          <el-select v-model="searchForm.userStatus" @change="getUserStatus" placeholder="请选择">
            <el-option label="正常" value="normal"></el-option>
            <el-option label="禁用" value="banned"></el-option>
          </el-select>
        </el-form-item> -->

        <div class="el-form-item-buttons">
          <el-form-item size="small">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">搜索</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="clearSearch">清空条件</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="addUser"
              >添加商户</el-button>

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
                v-loading="tableLoading"
                size="mini"
                max-height="800"
                fit
                style="width: 100%">

                <el-table-column
                    prop="merchantName"
                    label="商户展示名"
                    >
                </el-table-column>

                <el-table-column
                    prop="merchantStatus"
                    label="商户状态">
                </el-table-column>

                <el-table-column
                  prop="merchantNo"
                  label="商户编号"
                >

                </el-table-column>

                <el-table-column
                    prop="reportsRemainDays"
                    label="报告有效期(天数)">
                </el-table-column>


                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="warning"
                            @click="showSecretKeys(scope.$index, scope.row)">查看密钥</el-button>


                        <el-dropdown @command="handleCommand" trigger="click">
                          <el-button size="mini" @click="showMore(scope.$index, scope.row)">
                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>

                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="editDay">编辑报告有效期</el-dropdown-item>
                            <el-dropdown-item command="editKey">编辑密钥</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
    </div><!-- .user-management-wrapper -->
    <galaxy-pagination
      :totalPages="totalPages"
      :pageSize="10"
      @currentPage="requestPageList($event)"></galaxy-pagination>

    <!-- 查看密钥弹窗 -->
    <el-dialog
      :visible.sync="showKeys"
      width="30%"
      @close="closeKeyPanel"
      center>
      <p style="margin-bottom: 10px;">您正在查看的用户是: <strong style="color: blue">{{ currentUser }}</strong></p>
      <p><strong>公钥</strong></p>
      <p style="word-break:break-word;font-size:12px;">{{ publicKey }}</p>
      <p><strong>私钥</strong></p>
      <p style="word-break:break-word;font-size:12px;">{{ privateKey }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="showKeys = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改有效期弹窗 -->
    <el-dialog 
      :visible.sync="showEditDayPop" 
      width="300px"
      @close="closeExpiredDayPanel">
      <el-form>
        <el-form-item label="">
           <p>哈罗,<br> 你正在修改 <strong style="color:blue;">{{ currentUser }}</strong> 的报告有效期(天)</p>
          <el-input v-model="reportsRemainDays" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelPostDays">取 消</el-button>
        <el-button size="mini" type="primary" @click="postDays">确 定</el-button>
      </div>
      </el-dialog>

      <!-- 编辑密钥弹窗 -->
      <el-dialog 
        :visible.sync="showEditKeyPop" 
        width="450px"
        @close="closeEditKeyPanel">
      <el-form :model="keysForm">
        <p>哈罗,<br> 你正在修改 <strong style="color:blue;">{{ currentUser }}</strong> 的公私钥</p>
        <el-form-item label="私钥">
          <el-input type="textarea" :rows="14" v-model="keysForm.privateKey" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="公钥">
          <el-input type="textarea" :rows="6" v-model="keysForm.publicKey" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeEditKeyPanel">取 消</el-button>
        <el-button size="mini" type="primary" @click="postKeys">确 定</el-button>
      </div>
      </el-dialog>

      <!-- 添加商户弹窗 -->
      <el-dialog 
        :width="addUserDialogWidth" :visible.sync="addNewUserVisible"
        @close="closeAddNewUserPanel">
        <el-form
          :model="addUserDialogData"
          :rules="addUserDialogRules"
          ref="addUserRefs"
          status-icon>
          <el-form-item size="mini" label="商户名" prop="loginName" required>
            <el-input size="mini" v-model="addUserDialogData.loginName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item size="mini" label="商户地址" prop="address">
            <el-input size="mini" v-model="addUserDialogData.merchantAddress" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item size="mini" label="URL" prop="url">
            <el-input size="mini" v-model="addUserDialogData.url" autocomplete="off"></el-input>
          </el-form-item>

          <!-- <el-form-item size="mini" label="商户地址" prop="number">
            <el-input size="mini" v-model="addUserDialogData.number" autocomplete="off"></el-input>
          </el-form-item> -->

          <!--
          <el-form-item size="mini" prop="secretKey" label="私钥">
            <p>{{ addUserDialogData.secretKey }}</p>
          </el-form-item> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            @click="closeAddNewUserPanel">取消</el-button>
          <el-button
            type="primary"
            @click="postUser"
            size="mini">确定</el-button>
        </div>
      </el-dialog>
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
    var loginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商户名不能为空'));
      }
    };

    var number = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商户编号不能为空'));
      }
    };


    return {
      showReturnBtn: false,
      currentUser: '',
      currentId: '',
      currentUser: '',
      merchantNo: '',
      currentPrivateKey: '',
      currentPublicvKey: '',
      currentPage: '',
      publicKey: '',
      privateKey: '',
      totalPages: 0,
      reportsRemainDays: '',
      tableLoading: false,
      addNewUserVisible: false,
      addUserDialogWidth: '400px',
      showKeys: false,
      showEditDayPop: false,
      showEditKeyPop: false,
      displayMode: 'readTable',
      addUserDialogRules: {
        loginName: [
          { validator: loginName, trigger: 'blur' }
        ],
        number: [
          { validator: number, trigger: 'blur'}
        ]
      },
      addUserDialogData: {
        loginName: '',
        secretKey: 'feg34pfdd98323s',
        number: '',
        merchantAddress: '',
        url: ''
      },

      searchForm: {
        userDisplayName: "",
        userID: "",
        userStatus: ""
      },

      keysForm: {
        privateKey: '',
        publicKey: ''
      },

      table: []
    };
  },

  methods: {
    closeKeyPanel() {
      console.log('close key panel ...');
      this.currentUser = "";
      this.publicKey = "";
      this.privateKey = "";
    },

    closeAddNewUserPanel() {
      console.log('close add_new_user_panel ...');
      this.addUserDialogData.loginName = "";
      this.addUserDialogData.number = "";
      this.addNewUserVisible = false;
    },

    closeEditKeyPanel() {
      console.log('close edit key panel...');
      this.currentUser = "";
      this.keysForm.privateKey = "";
      this.keysForm.publicKey = "";
      this.showEditKeyPop = false;
    },

    closeExpiredDayPanel() {
      console.log('close expired day panel ...');
      this.currentUser = "";
      this.reportsRemainDays = "";
    },

    reloadComponent() {
      console.log('reload component ....');
      this.loadData();
      this.showReturnBtn = false;
      this.clearSearch();
      this.displayMode = "readTable";
    },
    postDays() {
      let self = this;
      console.log('post days ...');

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchant/update?${token}`, {
        id: this.currentId,
        merchantAddress: '',
        merchantName: this.currentUser,
        merchantNo: this.merchantNo,
        merchantStatus: '',
        privateKey: this.currentPrivateKey,
        publicKey: this.currentPublicKey,
        reportsRemainDays: this.reportsRemainDays
      }).then(res => {
        return res.json();
      }).then(data => {
        if (data.status == -1) {
          this.$message.error(data.msg);
          return;
        }
        this.showEditDayPop = false;
        this.reportsRemainDays = '';
        this.requestPageList(self.currentPage);
      }).catch(err => {
        console.log( err );
      });

    },

    cancelPostDays() {
      this.reportsRemainDays = '';
      this.showEditDayPop = false;
    },

    postKeys() {
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchant/change/keys?${token}`, {
        merchantNo: this.merchantNo,
        privateKey: this.keysForm.privateKey,
        publicKey:  this.keysForm.publicKey
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        if (data.status > -1) {
          this.keysForm.privateKey = '';
          this.keysForm.publicKey = '';
          this.showEditKeyPop = false;
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
      let requestObj = {};
      console.log('>>>>>', this.displayMode);
      if (this.displayMode == 'readTable') {
        requestObj = {
          merchantName: '',
          merchantNo: '',
          page: currentPage,
          pageSize: 10
        };
      } else {
        requestObj = {
          merchantName: this.searchForm.userDisplayName.trim(),
          merchantNo: this.searchForm.userID.trim(),
          page: currentPage,
          pageSize: 10
        }
      }

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchant/list?${token}`, requestObj)
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
        // table.forEach((item) => {
        //   if ( item.merchantStatus.toLowerCase() == "locked" ) {
        //     item.merchantStatus = '禁用';
        //   }

        //   if ( item.merchantStatus.toLowerCase() == "normal" ) {
        //     item.merchantStatus = '正常';
        //   }
        // });

      this.table = table;
    },

    loadData() {
     
    // let token = location.href.split('?')[1];
    // console.log(token);
    // localStorage.setItem('URL_TOKEN_STRING', token);
    // localStorage.setItem('token', token);
    // document.cookie = token;
    console.log('%cuser_management loading...', 'color:green;font-size:16px;');
    this.tableLoading = true;

    let token = localStorage.getItem('token');
    this.$http.get(`mgr/merchant/main?${token}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log('main: ', data);
        this.refreshTablePage(data);
      }).catch(err => {
        console.log( err );
      });
    },

     postUser() {
        console.log('post to server ...');

        var user = this.addUserDialogData.loginName;
        // var number = this.addUserDialogData.number;

        var merchantAddress = "";
        if (this.addUserDialogData.merchantAddress) {
          merchantAddress = this.addUserDialogData.merchantAddress;
        }

        var url = "";
        if (this.addUserDialogData.url) {
          url = this.addUserDialogData.url;
        }

        let token = localStorage.getItem('token');
        this.$http.post(`mgr/merchant/add?${token}`, {
          merchantAddress,
          merchantName: user,
          // merchantNo: number,
          privateKey: '',
          publicKey: '',
          reportsRemainDays: 0,
          url
        }).then(res => {
          return res.json();

        }).then(data => {
          console.log('load data again ....');
          if (data.status > -1) {
            this.loadData();
            this.addNewUserVisible = false;
          } else {
            this.$message.error(data.msg);
          }

        }).catch(err => {
          console.log( err );
        });


      },

    // 点击添加商户按钮
    addUser() {
      this.reloadComponent();
      this.addUserDialogData.loginName = "";
      this.addUserDialogData.number = "";
      this.addNewUserVisible = true;
      console.log('get secret key....');
    },
    handleCommand( command ) {


      switch( command ) {
        case 'editDay':
          this.showEditDayPop = true;
          console.log('edit day ....');
          break;

        case 'editKey':
          this.showEditKeyPop = true;
          console.log('edit key ....');
          break;
      }
    },

    clearSearch() {
      this.searchForm = {
        userDisplayName: '',
        userID: '',
        userStatus: ''
      };
      this.displayMode = "readTable";
    },

    getUserStatus(item) {
      console.log( item );
    },

    onSubmit() {
      this.tableLoading = true;
      console.log("搜索开始了！...");
      this.displayMode = 'search';
      let merchantName = this.searchForm.userDisplayName;
      let merchantNo = this.searchForm.userID;

      if ( merchantName == "" && merchantNo == "" ) {
        this.$message.error('哈罗, 至少要填写一项才能搜索哦~ :-)');
        this.tableLoading = false;
        return;
      }
      
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchant/list?${token}`, {
        merchantName: this.searchForm.userDisplayName,
        merchantNo: this.searchForm.userID,
        page: 1,
        pageSize: 10
      }).then(res => {
        return res.json();
      }).then(data => {

        console.log( data );

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

    showSecretKeys(index, row) {
      console.log(index, row);
      this.currentUser = row.merchantName;
      this.publicKey = row.publicKey;
      this.privateKey = row.privateKey;
      this.showKeys = true;
    },

    showMore(index, row) {
      console.log(index, row);
      this.currentId = row.id;
      this.currentUser = row.merchantName;
      this.currentPrivateKey = row.privateKey;
      this.currentPublicKey = row.publicKey;
      this.merchantNo = row.merchantNo;

      this.keysForm.privateKey = row.privateKey;
      this.keysForm.publicKey = row.publicKey;
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


