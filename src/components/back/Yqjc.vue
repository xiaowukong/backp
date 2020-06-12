<template>
  <div class="contente-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>

    <div class="yqjc-wrapper">
      <el-form size="mini" :inline="true">
        <span
          style="color:#606266;                      
                 font-size:14px;
                 display:inline-block;
                 margin-right:10px;"
        >应还款日期</span>

        <el-date-picker 
            size="mini" 
            v-model="yearMonth" 
            type="month" 
            placeholder="年份-月份">
        </el-date-picker>

        <el-form-item label="商户">
          <el-select 
            v-model="merchant"
            @change="selectMerchant">
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
          v-if="showDevice"
        >
            
            <el-select
                v-model="device"
                @change="selectDevice"
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
          label="产品类型"
          v-if="productShow"
        >
          <el-select 
            v-model="product"
            @change="selectProduct"
          >
            <el-option
              v-for="(item, index) in productArr"
              :key="index"
              :value="item.pipelineGroupId"
              :label="item.pipelineGroupName"
            ></el-option>
          </el-select>
        </el-form-item>

        <div>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>

          <!-- <el-form-item>
            <el-button type="primary" @click="reloadComponent" :disabled="quitSearchDisabled">退出查询</el-button>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" @click="emptyForm">重置条件</el-button>
          </el-form-item>

          <el-form-item>
            <el-button 
              type="warning" 
              :disabled="exportDisabled"
              @click="exportExcel">导出</el-button>
          </el-form-item>
        </div>
      </el-form>

      <el-table size="mini" 
        stripe 
        :data="tableData" 
        v-loading="tableLoading">

        <el-table-column 
          label="应还款日期" 
          prop="dueDate">
        </el-table-column>

        <el-table-column 
          label="应还款订单" 
          prop="orderCount">
        </el-table-column>

        <el-table-column 
        label="正常还款订单" 
        prop="paidOffOrderCount">
        </el-table-column>

        <el-table-column 
        label="D1逾期率" 
        prop="overdueD1">
          <template slot-scope="props">
            <p style="color:red;">{{props.row.overdueD1[0]}}</p>
            <p>{{props.row.overdueD1[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D2逾期率" 
        prop="overdueD2">
          <template slot-scope="props">
            <p style="color:red">
              {{props.row.overdueD2[0]}}
            </p>
            <p>{{props.row.overdueD2[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D3逾期率" 
        prop="overdueD3">
          <template slot-scope="props">
            <p style="color:red">
              {{props.row.overdueD3[0]}}
            </p>
            <p>{{props.row.overdueD3[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D4逾期率" 
        prop="overdueD4">
          <template slot-scope="props">
            <p style="color:red">
              {{props.row.overdueD4[0]}}
            </p>
            <p>{{props.row.overdueD4[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D5逾期率" 
        prop="overdueD5">
          <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD5[0]}}</p>
            <p>{{props.row.overdueD5[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D6逾期率" 
        prop="overdueD6">
          <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD6[0]}}</p>
            <p>{{props.row.overdueD6[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D7逾期率" 
        prop="overdueD7">
          <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD7[0]}}</p>
            <p>{{props.row.overdueD7[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D8-D15逾期率" 
        prop="overdueD15">
          <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD15[0]}}</p>
            <p>{{props.row.overdueD15[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D16-D30逾期率" 
        prop="overdueD30">
                  <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD30[0]}}</p>
            <p>{{props.row.overdueD30[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D31-D90逾期率" 
        prop="overdueD90">
                  <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD90[0]}}</p>
            <p>{{props.row.overdueD90[1]}}</p>
          </template>
        </el-table-column>

        <el-table-column 
        label="D91+逾期率" 
        prop="overdueD91">
                  <template slot-scope="props">
            <p style="color:red">{{props.row.overdueD91[0]}}</p>
            <p>{{props.row.overdueD91[1]}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import galaxyBreadcrumb from "../shared/Breadcrumb";
import { yearMonth2Str, formPara } from '../../../util';
import { EXPORT_URL } from '../../../api_root';

export default {
  components: {
    galaxyBreadcrumb
  },

  data() {
      return {
          yearMonth: "",

          merchant: '',
          merchantArr: [
            {
              id: '',
              merchantName: '全部'
            }
          ],

          showDevice: true,
          device: '',

          productShow: true,
          product: '',
          productArr: [
            {
              pipelineGroupId: '',
              pipelineGroupName: '全部'
            }
          ],

          quitSearchDisabled: true,
          exportDisabled: true,

          tableLoading: false,
          tableData: [],

          productSelectorDisabled: false
        
      }
  },

  created() {
    this.getMerchant();
  },

  methods: {
      getMerchant() {
        this.merchantArr = [
          {
            id: '',
            merchantName: '全部'
          }
        ],
        console.log('get merchant ...');
        
        let token = localStorage.getItem('token');
        this.$http.get(`mgr/loanstatistic/merchant?${token}`)
          .then(res => {
            return res.json()
          }).then(data => {
            console.log(data);

            if (data.status == 1) {
              this.merchantArr = [...this.merchantArr, ...data.data];
            } else {
              this.$message.error(data.msg);
              return;
            }
          }).catch(err => {
            console.log(err);
          })
      },

      getProduct() {
        this.productArr = [
          {
            pipelineGroupId: '',
            pipelineGroupName: '全部'
          }
        ]
        console.log('get product ...');
        let merchantId = this.merchant;
        let deviceId = this.device;

        let token = localStorage.getItem('token');
        this.$http.post(`mgr/loanstatistic/groupList?${token}`, {
          merchantId,
          deviceId
        }).then(res => {
          return res.json()
        }).then(data => {
            console.log('getProduct: >>>', data);

            if (data.status == 1) {
              if(data.data.length) {
                this.product = "";
              
                if (data.data.length > 0) {
                  this.productSelectorDisabled = true;
                } else {
                  this.productSelectorDisabled = false;
                }

                this.productArr = [...this.productArr, ...data.data];
              } else {
                this.$message.error('没有产品类型');
                return
              }
            } else {
              this.$message.error(data.msg);
              return;
            }
        }).catch(err => {
          console.log(err);
        });

      },

      search() {
        console.log('search ... ');
        
        if (!this.yearMonth) {
          this.$message.error('请先选择应还款日期～');
          return;
        }

        // if (!this.merchant) {
        //   this.$message.error('请选择商户～');
        //   return;
        // }

        this.tableLoading = true;

        let merchantId = this.merchant;
        let deviceId = this.device;
        let productId = this.product;
        let searchTime = yearMonth2Str(this.yearMonth) + '-10';

        let obj = {
          merchantId,
          deviceId,
          productId,
          searchTime
        };

        console.log(obj)

        let token = localStorage.getItem('token');
        this.$http.post(`mgr/loanstatistic/list?${token}`, obj)
          .then(res => {
            return res.json();
          }).then(data => {
            console.log(data);

            if (data.status == 1) {
              let tableData = data.data;
              if (tableData.length > 0) {
                this.exportDisabled = false;
              } else {
                this.exportDisabled = true;
              }

              this.tableData = tableData;
            } else {
              this.$message.error(data.msg);
              this.tableLoading = false;
              return;
            }
            this.tableLoading = false;
          }).catch(err => {
            console.log(err);
            this.tableLoading = false;
          })
      },

      selectMerchant(value) {
        if(value) {
          this.showDevice = true
          this.productShow = false
          this.device = ''
          this.product = ''
        }
          console.log('select merchant ...');
      },

      selectDevice() {
        this.productShow = true
        this.product = ''
          console.log('select device ...');
          this.getProduct();
      },

      selectProduct() {
        console.log('select product ...');
      },

      emptyForm() {
        console.log('empty form ...');

        this.yearMonth = "";
        this.merchant = "";
        this.device = "";
        this.product = "";
        this.exportDisabled = true;
      },

      exportExcel() {
        console.log('export excel ...');

        let token = localStorage.getItem('token');
        let form = document.createElement('form');
        // form.action = `http://10.17.87.67:2000/mgr/loanstatistic/download?${token}`;
        let url = `${EXPORT_URL}/mgr/loanstatistic/download?${token}`;

        form.action = url;
        form.method = "post";
        form.style.display = "none";
        //  merchantId,
        //   deviceId,
        //   productId,
        //   searchTime
        let searchTime = yearMonth2Str(this.yearMonth) + '-10';
        let merchantId = this.merchant;
        
        let deviceId = "";
        if (this.deviceId) {
          deviceId = this.deviceId;
        }

        let productId = "";
        if (this.productId) {
          productId = this.productId;
        }

        formPara(form, "searchTime", `${searchTime}`);
        formPara(form, "merchantId", `${merchantId}`);
        formPara(form, "deviceId", `${deviceId}`);
        formPara(form, "productId", `${productId}`);

        document.body.appendChild(form);
        form.submit();
      },

      reloadComponent() {
        console.log('reload component ...');
      }
  }
};
</script>

<style lang="scss" scoped>
</style>

