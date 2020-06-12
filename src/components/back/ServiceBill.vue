<template>
  <div class="content-wrapper" v-if="true">
    <galaxy-breadcrumb></galaxy-breadcrumb>

    <div class="management-wrapper">
        <el-badge :value="userNum" class="item statisticsItem" type="primary">
          <el-button size="small" >商户数量</el-button>
        </el-badge>
        <el-badge :value="serveAllPrice" class="item statisticsItem" type="primary">
          <el-button size="small" >服务总价</el-button>
        </el-badge>
        <el-badge :value="billingNum" class="item statisticsItem" type="primary">
          <el-button size="small" >计费总次数</el-button>
        </el-badge>
        <br/>
        <br/>
       <el-form ref="form" :inline="true" :model="form" label-width="100px" size="mini">
         <div class="el-form-item-buttons">
          <el-date-picker
            v-model="datePicker"
            type="month"
            size="mini"
            @change="selectDate"
            placeholder="选择年月">
          </el-date-picker>

          <el-form-item label="商户展示名">
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
          </el-form-item>
        </div>
        
      </el-form>
      <!-- TODO 二期实现
      <p class="totalMoney">总价: &yen;9244321.34 <span>根据查询条件计算得出的总价</span></p>
      -->
            <el-table
                :data="table"
                stripe
                :highlight-current-row=true
                border
                v-loading="tableLoading"
                size="mini"
                fit
                style="width: 100%"
                @expand-change="rowExpand">

                <el-table-column
                  type="expand">
                  <template slot-scope="props">
                    <el-table
                      size="mini"
                      :data="props.row.services"
                      border
                      fit
                      style="width:100%">

                    <el-table-column
                      prop="serviceName"
                      label="服务名称">
                    </el-table-column>

                    <el-table-column
                      prop="serviceCode"
                      label="服务编号">
                    </el-table-column>

                    <el-table-column
                      prop="totalServiceCount"
                      label="服务次数">
                    </el-table-column>

                    <el-table-column
                      prop="billingServiceCount"
                      label="计费次数">
                    </el-table-column>

                    <el-table-column
                      prop="totalPrice"
                      label="总价">
                    </el-table-column>

                    <el-table-column
                      prop="bankName"
                      label="银行名称">
                  </el-table-column>
                  <el-table-column
                      prop="bankNumber"
                      label="银行账号">
                  </el-table-column>

                  <el-table-column
                      prop="payStatus"
                      label="支付状态">
                  </el-table-column>

                  <el-table-column
                      prop="changePaymentStatus"
                      label="修改支付状态">

                      <template slot-scope="scope">
                        <template v-if="scope.row.payStatus == '已支付' || selectDis">
                          <el-select
                          size="mini"
                          disabled
                          v-model="scope.row.value"
                          @change="handleEdit(scope.$index, scope.row)"
                          placeholder="请选择">
                              <el-option
                                  v-for="item in paymentStatus.options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  size="mini">
                              </el-option>
                          </el-select>
                        </template>

                        <template v-else>
                          <el-select
                          size="mini"
                          v-model="scope.row.value"
                          @change="handleEdit(scope.$index, scope.row)"
                          placeholder="请选择">
                              <el-option
                                  v-for="item in paymentStatus.options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  size="mini">
                              </el-option>
                          </el-select>
                        </template>
                      </template>
                  </el-table-column>

                  <el-table-column label="操作">
									  <template slot-scope="scope">
										  <el-button
											  size="mini"
											  type="warning"
                        :disabled="scope.row.disabledConfBtn"
											  @click="settings(scope.$index, scope.row)"
											>配置</el-button>
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
                    prop="totalAmount"
                    label="总价"
                    >
                </el-table-column>

                <el-table-column
                    prop="totalCount"
                    label="服务次数"
                    >
                </el-table-column>

                <el-table-column
                    prop="billingCount"
                    label="计费次数"
                    >
                </el-table-column>


                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="editRow(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </div><!-- .user-management-wrapper -->
    <galaxy-pagination
      v-if="pageReset"
      :totalPages = "totalPages"
      :pageSize="10"
      @currentPage="requestList($event)"
    ></galaxy-pagination>

    <div id="unexpand_table">
    <el-dialog 
      title="" 
      width="900px"
      :visible.sync="showServiceDetail">
        <div class="fkhead">
          <p>商户展示名: <strong>{{ currentUser }}</strong></p>
          <!-- <p style="color: blue">注: 双某行即可对这行进行编辑</p> -->
        </div>

        <el-table size="mini"
        :data="detailData"
        :row-key="getRowKeys"
        
        :expand-row-keys="expands"
        v-loading="innerTableLoading0"
        height="600"
        >

          <el-table-column
            type="expand"
            style="height: auto;">
              <template slot-scope="props">
                <el-table
                  size="mini"
                  :data="props.row.children"
                  
                  fit
                  style="width:100%"
                  >

                    <el-table-column
                      prop="serviceName"
                      label="服务名称">
                    </el-table-column>

                    <el-table-column label="服务状态">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.statusFlag"
                          size="mini"
                          @change="switchBtn(scope.$index, scope.row)"
                          >
                        </el-switch>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="price"
                      label="单价(元)">
                    </el-table-column>

                    <el-table-column
                      prop="priceDiscout"
                      label="折扣">
                    </el-table-column>

                    <el-table-column
                      prop="priceFinal"
                      label="折后价格">
                    </el-table-column>

                    <!-- 子表的编辑按钮 -->
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="primary"
                          @click="editRowInner(scope.$index, scope.row)">编辑</el-button>
                       </template>
                    </el-table-column>

              </el-table>
            </template>
          </el-table-column>

          <el-table-column
            prop="serviceName"
            label="服务名称">
          </el-table-column>

          <el-table-column label="服务状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.statusFlag"
                size="mini"
                @change="switchBtn(scope.$index, scope.row)"
                >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
            prop="price"
            sortable
            label="单价/元">
          </el-table-column>

          <el-table-column
            prop="priceDiscout"
            label="优惠折扣/折">
          </el-table-column>

          <el-table-column
            prop="priceFinal"
            label="优惠后单价">
          </el-table-column>

          <el-table-column
            prop="paymentStatus"
            label="支付状态"
          ></el-table-column>

          <!-- 父表的编辑按钮 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.children.length == 0"
                @click="editRowInner(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>          
        </el-table>

        <!-- <galaxy-pagination
          :totalPages="detailTotalRows"
          @currentPage="requestDetailList($event)">
        </galaxy-pagination> -->
      </el-dialog><!-- 订单详情 -->
      </div>


      <!-- 折扣修改弹窗 -->
      <el-dialog
      :visible.sync="showEditPop"
      width="350px"
      @close="closeDiscountPop"
      center>
      <p style="margin-bottom: 10px;"><strong style="color: blue">{{ currentServiceName }}</strong></p>
      <!-- <p style="color: blue; font-size: 12px;">如果有不修改的条目, 留空即可</p> -->
      <el-form :model="fee">
        <!--
        <el-form-item size="mini" label="单价/元">
          <el-input v-model="fee.price" autocomplete="off"></el-input>
        </el-form-item>
        -->
        <p>单价/元 {{ innerPrice }}</p>

        <el-form-item size="mini" label="折扣">
          <el-input v-model="fee.priceDiscount" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="normal" @click="showEditPop = false">取消</el-button>
        <el-button size="mini" type="primary" @click="savePrice">保存</el-button>
      </span>
    </el-dialog>

    <!-- 配置弹窗 -->
    <el-dialog
      :visible.sync="showConfPop"
      width="1080px"
      @close="closeConfPop"
    >
      <p style="margin-top: -20px;margin-bottom:20px">
        商户: <strong style="color:blue;">{{ bankPanelTitleHeading1 }}</strong><br>
        服务名称: <strong style="color:blue;">{{ confServiceName }}</strong>   
      </p>

      <el-table
        size="mini"
        :data="confTable"
        v-loading="confTableLoading"
      >
        <el-table-column
          prop="pgName"
          label="风控规则组名称"
        >
        </el-table-column>

        <el-table-column
          prop="validText"
          label="状态"
        ></el-table-column>

        <el-table-column
          prop="device"
          label="设备类型"
        ></el-table-column>

        <el-table-column
          prop="product"
          label="规则产品"
        ></el-table-column>

        <el-table-column
          prop="groupDays"
          label="产品期限"
        ></el-table-column>

        <el-table-column
          prop="createTime"
          label="更新时间"
        ></el-table-column>

        <el-table-column
          prop="businessPersonnel"
          label="业务人"
        ></el-table-column>

        <el-table-column
          prop="pgDesc"
          label="描述"
        ></el-table-column>

        <el-table-column
          prop=""
          label="校验基础项信息"
        >
          <template slot-scope="scope">
            <el-select 
              v-model="scope.row.checkItem" 
              multiple 
              size="mini"
              @change="getCheckItem(scope.$index, scope.row)"
              placeholder="请选择">
                <el-option
                  v-for="item in checkItemOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="操作"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.valid"
              size="mini"
              :disabled="disableConfBtn"
              @change="confSwitch(scope.$index, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- end of 配置弹窗 -->

    <!-- 银行名, 银行号弹窗 -->
    <el-dialog 
      :visible.sync="showBankPanel" 
      width="450px"
      @close="closeBankPanel(bankInfoRow)"
      >
      <el-form>
        <p>你正在修改得条目是：<br><strong style="color:blue;">{{ bankPanelTitleHeading1 }} => {{ bankPanelTitleHeading2 }}</strong> </p>
        <el-form-item label="银行名称">
          <el-input v-model="bankNamePop" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="银行卡号">
          <el-input v-model="bankNumberPop" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="付款金额/元">
          <el-input v-model="payAmountPop" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="付款月份">
          <br/>
          <!-- <el-input v-model="datePicker" autocomplete="off"></el-input> -->
          <!-- <el-date-picker
            v-model="selectDatePayMonValue"
            type="month"
            @change="selectPayMonthDate"
            placeholder="选择年月">
          </el-date-picker> -->

          <p style="color:blue; font-weight:bold;">{{selectDateValue}}</p>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeBankPanel(bankInfoRow)">取 消</el-button>
        <el-button 
          size="mini" 
          type="primary"
          :disabled="saveBankInfoBtnDisabled" 
          @click="saveBankInfo(bankInfoRow)">确 定</el-button>
      </div>
      </el-dialog>
    </div><!-- .content-wrapper -->
</template>

<script>
import galaxyBreadcrumb from "../shared/Breadcrumb";
import galaxyPagination from "../shared/Pagination";
import { second2Date } from '../../../util';
import { formalDate } from '../../../util';

export default {
  components: {
    galaxyBreadcrumb,
    galaxyPagination
  },

  created() {
    this.showMonth();
    this.loadData();
    this.singNum()
  },

  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      userNum: 0,
      serveAllPrice: 0,
      billingNum: 0,
      checkItemOptions: [
        {
          value: 1,
          label: '客户'
        },

        {
          value: 2,
          label: '账户'
        },

        {
          value: 3,
          label: '登录流水'
        },

        {
          value: 4,
          label: '借款'
        }, 

        {
          value: 5,
          label: '风险'
        },

         {
           value: 6,
           label: '联系人'
         },

         {
           value: 7,
           label: '文件'
         }
      ],
      disableConfBtn: false,
      confServiceName: '',
      showConfPop: false,
      saveBankInfoBtnDisabled: false,
      bankInfoRow: '',
      bankPanelTitleHeading1: '',
      bankPanelTitleHeading2: '',
      innerTableLoading: false,
      innerTableLoading0: false,
      confTableLoading: false,
      fee: {
        original: '',
        discount: '',
        price: '',
        priceDiscount: ''
      },
      row: '',
      displayMode: 'readTable',
      innerPrice: '',
      serviceName: '',
      selectDateValue: '',
      selectDatePayMonValue: '',
      showBankPanel: false,
      bankName: '',
      bankNumber: '',
      bankNamePop: '',
      bankNumberPop: '',
      payAmountPop: '',
      payMonthPop: '',
      showReturnBtn: false,
      totalPages: 0,
      currentServiceName: '',
      showEditPop: false,
      showServiceDetail: false,
      detailTotalRows: 120,
      tableLoading: false,
      currentUser: '',
      datePicker: "",
      selectDis: true,
      msid: '',
      merchantNo: '',
      form: {
        userDisplayName: "",
        serviceName: "",
        userStatus: ""
      },
      detailData: [],
      table: [],
      confTable: [],
      expands: [],
      pageReset: false,

      paymentStatus: {
        options: [
          {
            value: "选项1",
            label: "已支付"
          }
        ],
        pValue: ""
      }
    };
  },

  mounted() {

  },

  methods: {

    singNum(outsearch) {

      let merchantName = this.form.userDisplayName;
      let searchDate = this.selectDateValue;

      let obj

      if(outsearch) {
        obj = {
          asc: true,
          merchantName: '',
          merchantNo: "",
          page: 1,
          pageSize: 100,
          searchDate: searchDate,
          serviceName: ""
        }
      } else {
        obj = {
          asc: true,
          merchantName: merchantName,
          merchantNo: "",
          page: 1,
          pageSize: 100,
          searchDate: searchDate,
          serviceName: ""
        }
      }
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/summary?${token}`, obj)
      .then(res => {
        return res.json();
      }).then(data => {
        if (data.status == 1) {
          if(data.data.priceFinal) {
            this.serveAllPrice = data.data.priceFinal
          } else {
            this.serveAllPrice = 0
          }
          this.billingNum = data.data.id ? data.data.id : 0
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log( err );
      });

      this.$http.post(`mgr/merchant/count?${token}`, {
        merchantName: merchantName
      })
      .then(res => {
        return res.json();
      }).then(data => {
        if (data.status == 1) {
          this.userNum = data.data ? data.data : 0
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log( err );
      });
    },

    getCheckItem(item) {
      console.log(item);
      console.log(item.join(','));
    },

    closeConfPop() {
      console.log('closeConfPop');
    },
    closeBankPanel(row) {
      console.log(row);
      row.value = "";
      this.showBankPanel = false;
      this.bankNamePop = "";
      this.bankNumberPop = "";
      this.payAmountPop = "";
      this.payMonthPop = "";
    },

		settings(index, row) {
      console.log(index, row);
      
      let self = this;
      this.confServiceName = row.serviceName;
      this.bankPanelTitleHeading1 = row.merchantName;

      let merchantNo = row.merchantNo;
      let whiteFlag = row.serviceCode;

      this.confTableLoading = true;
      this.$http.post('mgr/pipelineProduct/loadInfo', {
        merchantNo,
        whiteFlag
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        let checkItemOptions = this.checkItemOptions;
        // let self = this;
        if (data.status == 1) {
          this.showConfPop = true;
          this.disableConfBtn = false;
          let table = data.data;

          table.forEach((item, key) => {
            // console.log('item33 >>>', item.pipelineGroupCode);
            if (item.valid == true) {
              item.validText = "使用中";
            } else {
              item.validText = "未使用";
            }

            // if (typeof item.checkItem == "string") {
              let itemArr = item.checkItem.split(',');
              console.log(itemArr);

              if (itemArr.length == 1 && itemArr[0] == "") {
                item.checkItem = [];
              } else {
                itemArr = itemArr.map((item, key) => {
                  console.log('>>> ', item);
                  return item *= 1;
              });
              // console.log(itemArr);

                item.checkItem = itemArr;
              }

              
        
            // }
          });
          this.confTable = table;
          

          setTimeout(() => {
            self.confTableLoading = false;
          }, 1500);
          
        } else {
          this.$message.error(data.msg);
          setTimeout(() => {
            self.confTableLoading = false;
          }, 1500);
          return;
        }
      }).catch(err => {
        console.log(err);
        setTimeout(() => {
            self.confTableLoading = false;
          }, 1500);
      })
		},

    showMonth() {
      let today = second2Date(new Date().getTime(), true);
      let month = today.slice(0, 7);
      this.datePicker = month;
      this.selectDateValue = month;
    },

    saveBankInfo(row) {
      console.log('save bank info ... ');
      if (row.totalPrice.toString() != this.payAmountPop.toString()) {
        this.$message.error('请确认是否结清!');
        return;
      }
      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/changePayStatus?${token}`, {
        msid: this.msid,
        bankNumber: this.bankNumberPop,
        bankName: this.bankNamePop,
        payAmount: this.payAmountPop,
        // payMonth: this.selectDatePayMonValue
        payMonth: this.selectDateValue
      }).then(res => {
        return res.json();
      }).then(data => {
        if (data.status == 1) {
          // success
          console.log('>>>><<<<');
          console.log(row);

          row.payStatus = "已支付";
          this.showBankPanel = false;
        } else {
          this.$message.error(data.msg);
        }
      }).catch(err => {
        console.log( err );
      });
    },

    confSwitch(index, row) {
      console.log(index, row);
      console.log('confSwitch');
      this.disableConfBtn = true;
      let { merchantNo, checkItem, valid, whiteFlag, device, pipelineGroupCode } = row;

      if (checkItem == "") {
        row.checkItem = [];
      }

      if (checkItem.length == 0) {
        this.$message.error('请先选择校验基础项信息~');
        row.valid = false;
        this.disableConfBtn = false;
        return;
      }

      this.$http.post('mgr/pipelineProduct/save', {
        merchantNo,
        checkItem: checkItem.join(','),
        valid,
        whiteFlag,
        device,
        pipelineGroupCode
      }).then(res => {
        return res.json()
      }).then(data => {
        console.log(data);
        
        if (data.status == 1) {
          this.disableConfBtn = false;
          if (row.validText == "使用中") {
            row.validText = "未使用";
          } else {
            row.validText = "使用中";
          }
        } else {
          this.$message.error(data.msg);
          this.disableConfBtn = false;
          if (row.valid) {
            row.valid = false;
          } else {
            row.valid = true;
          }
          return;
        }
      }).catch(err => {
        console.log(err);
      })
    },

    selectDate() {
      console.log('select date ...');
      let year = "";
      let month = "";

      if (this.datePicker) {
        year = this.datePicker.getFullYear();
        month = formalDate(this.datePicker.getMonth() + 1);
      }
      
      
      let date = `${year}-${month}`;
      console.log(date);
      this.selectDateValue = date;
    },

    selectPayMonthDate(val) {
      console.log('select payMonth date ...');
      let year = null;
      let month = null;
      if(val === 1) {
        let payMonth = new Date();
        year = payMonth.getFullYear();
        month = payMonth.getMonth();
        if(month < 1) {
          month = 12
          year = year - 1
        }
      } else {
        const payMonth = new Date(val);
        year = payMonth.getFullYear();
        month = payMonth.getMonth() + 1;
      }
      if(month < 10) {
        month = '0' + month
        
      }
      let date = `${year}-${month}`;
      this.selectDatePayMonValue = date;
    },

    savePrice() {
      console.log('save price ...'); 
      let price = this.fee.price;
      let priceDiscount = this.fee.priceDiscount;
      let row = this.row;

      if (isNaN(Number(price)) && isNaN(Number(priceDiscount))) {
        this.$message.error('哈罗, 请输入数字~');
        return;
      }

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/changePrice?${token}`, {
        msid: this.msid,
        price: this.innerPrice,
        priceDiscout: priceDiscount,
        merchantNo: this.row.merchantNo
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log( data );
        if (data.status == 1) {
          this.showEditPop = false;
          
          this.getEditPopData(row);
        } else {
          this.$message.error(data.msg);
        }

      }).catch(err => {
        console.log( err );
      });

    },

    reloadComponent() {
      console.log('reload component ....');
      this.form.userDisplayName = ''
      this.loadData();
      this.showReturnBtn = false;
      this.showMonth();
      this.displayMode = "readTable";
      this.singNum('outsearch')
    },

    loadData() {
      console.log('%cService_Bill loading....', 'color:green;font-size:16px');
      this.tableLoading = true;

      let token = localStorage.getItem('token');
      this.$http.get(`mgr/merchantservicerelative/main?${token}`)
      .then(res => {
        return res.json();
      }).then(data => {

        this.pageReset = true;
        this.selectDis = true;
        if (data.status > -1) {
          this.refreshTablePage(data);
        }

      }).catch(err => {
        console.log( err );
      });
    },

    handleEdit(index, row) {
      console.log('handle edit ...');
      console.log(index, row);
      this.bankInfoRow = row;
      this.currentUser = row.merchantName;
      this.bankPanelTitleHeading2 = row.serviceName;
      this.msid = row.msid;
      this.serviceName = row.serviceName;
      this.showBankPanel = true;

      if (this.selectDateValue == "-") {
        
        this.saveBankInfoBtnDisabled = true;
        this.selectDateValue = "请先关闭弹窗，再选择年月～";
      } else {
        this.saveBankInfoBtnDisabled = false;
      }
    },

    refreshTablePage(data) {
      console.log(data);
      this.tableLoading = false;
      const table = data.data.records;

      this.totalPages = data.data.total;

      table.forEach((item, key) => {
        
        if (item.services.length > 0) {
          let services = item.services;

          for (let i = 0; i < services.length; i++) {
            let service = services[i];

            service.merchantName = item.merchantName;
            service.merchantNo = item.merchantNo;
            if (service.serviceCode != "WHITELIST_RC" && service.serviceCode != "RC") {
              service.disabledConfBtn = true;
            } else {
              service.disabledConfBtn = false;
            }
          }
        }
        
        // console.log(key, ' >>> ', item.disabledConfBtn, item.serviceCode);
      });

      console.log('table >>> ');
      console.log(table);
      this.table = table;
    },
    
    requestList(currentPage) {
      console.log(currentPage);
      this.tableLoading = true;
      let obj = {};

      if (this.displayMode == "readTable") {
        obj = {
          asc: true,
          merchantName: '',
          page: currentPage,
          pageSize: 10,
          searchDate: '',
          serviceName: ''
        }
      } else {
        obj = {
          asc: true,
          merchantName: this.form.userDisplayName,
          page: currentPage,
          pageSize: 10,
          searchDate: this.selectDateValue,
          serviceName: ''
        }
      }

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/list?${token}`, obj)
        .then(res => {
          return res.json();
        }).then(data => {
          this.refreshTablePage(data);
        }).catch(err => {
          console.log(err);
        });
    },
    requestDetailList(currentPage) {
      console.log(currentPage);
    },

    // 双击行 弹窗 弃用
    editPop(row) {
      console.log('edit pop ....');
      console.log(row);
      this.msid = row.msid;
      this.currentServiceName = row.serviceName;
      this.showEditPop = true;
      
    },

    switchBtn(index, row) {
      console.log('switch ....');
      console.log(index, row);
      console.log('>>>', row.msid);
      console.log(row.statusFlag);

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/changeOpenFlag?${token}`, {
        msid: row.msid,
        openFlag: row.statusFlag,
        merchantNo: this.merchantNo,
        serviceCode: row.serviceCode
      }).then(res => {
        return res.json();
      }).then(data => {
        this.innerTableLoading = true;
        console.log(data);
        if (data.status == 1) {
          // success
          this.getEditPopData(row);
        } else {
          row.statusFlag = !row.statusFlag;
          this.$message.error( data.msg );

        }
      }).catch(err => {
        console.log(err);
      });
    },

    rowExpand(row) {
      console.log("row expand ...");
      console.log(row);
      this.bankPanelTitleHeading1 = row.merchantName;
      this.merchantNo = row.merchantNo;
    },
    onSubmit() {
      console.log("onSubmit...");
      let merchantName = this.form.userDisplayName;
      let searchDate = this.selectDateValue;
      if ( merchantName == '') {
        if (searchDate == '') {
          this.$message.error('哈罗, 至少要填写一项~');
          return;
        }
      }

      this.displayMode = "readSearch";
      this.tableLoading = true;
      this.pageReset = false

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/list?${token}`, {
        asc: true,
        merchantName,
        page: 1,
        pageSize: 10,
        searchDate,
      }).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        if (data.status == 1) {
          let date = new Date();
          let nowMonth = date.getMonth() + 1
          let selMonth = searchDate.substring(searchDate.length-2) * 1
          this.table = data.data.records;
          this.tableLoading = false;
          this.totalPages = data.data.total;
          this.showReturnBtn = true;
          this.pageReset = true
          if(selMonth < nowMonth) {
            this.selectDis = false
          } else {
            this.selectDis = true
          }
          this.singNum()
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

    getEditPopData(row) {
      this.innerTableLoading = true;

      let token = localStorage.getItem('token');
      this.$http.post(`mgr/merchantservicerelative/edit?${token}`, {
        merchantNo: row.merchantNo
      }).then(res => {
        return res.json();
      }).then(data => {
        let detailData = data.data;
        this.detailData = detailData;
        this.expands.push(this.detailData[1].id);
        this.innerTableLoading = false;
      }).catch(err => {
        console.log(err);
      });
    },

    closeDiscountPop() {
      this.currentServiceName = "";
      this.innerPrice = "";
      this.fee.priceDiscount = "";
    },

    editRow(index, row) {
      console.log(index, row);
      this.showServiceDetail = true;
      this.merchantNo = row.merchantNo;
      this.currentUser = row.merchantName;

      this.getEditPopData(row);
    },

    editRowInner(index, row) {
      console.log(row);
      this.row = row;
      this.msid = row.msid;
      this.innerPrice = row.price;
      this.currentServiceName = row.serviceName;
      this.fee.priceDiscount = row.priceDiscout;
      
      this.showEditPop = true;
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
.statisticsItem{
  margin-right: 40px;
  margin-left: 20px;
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

.fkhead {
  overflow: hidden;
  margin-right: 15px;
  p {
    float: left;
    margin-right: 20px;

  }
}

p.totalMoney {
  clear: both;
  color: #606266;
  font-size: 12px;
  padding-left: 20px;
  position: relative;
  top: -10px;
}
</style>




