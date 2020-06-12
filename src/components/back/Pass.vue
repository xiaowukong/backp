<template>
  <div class="content-wrapper">
    <galaxy-breadcrumb></galaxy-breadcrumb>
    <el-tabs type="border-card">
      <el-tab-pane label="表格视图">
        <div class="pass-wrapper">
          <el-form
            size="mini"
            :inline="true"
          >
            <el-form-item
              label="时间"
            >
              <el-date-picker
                v-model="dateContainer"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item
              label="商户名称"
            >
              <el-select
                placeholder="请选择"
                v-model="typeValue.merchantValue"
                @change="merchChange"
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
              v-if="deviceDis"
            >
              <el-select
                placeholder="请选择"
                v-model="typeValue.deviceValue"
                @change="deviceChange"
              >
                <el-option
                  v-for="(item, index) in deviceArr"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="产品类型"
              v-if="groupDis"
            >
              <el-select
                placeholder="请选择"
                v-model="typeValue.groupValue"
                @change="groupChange"
              >
                <el-option
                  v-for="(item, index) in groupArr"
                  :key="index"
                  :value="item.pipelineGroupId"
                  :label="item.pipelineGroupName"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="pipeline"
              v-if="pipelineDis"
            >
              <el-select
                placeholder="请选择"
                v-model="typeValue.pipelineValue"
                @change="pipelineChange"
              >
                <el-option
                  v-for="(item, index) in pipelineArr"
                  :key="index"
                  :value="item.pipelineId"
                  :label="item.pipelineName"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="button">
              <el-button size="small" type="primary" @click="search">查询</el-button>
              <el-button size="small" type="primary" :disabled="quitSearchStatus" @click="reloadComponent">退出查询</el-button>
              <el-button 
                size="small" 
                type="warning" 
                @click="download"
              >导出</el-button>
              <br/>
              <br/>
              <el-badge :value="this.statistics.orderCounts" class="item statisticsItem">
                <el-button size="small" >总单数</el-button>
              </el-badge>
              <el-badge :value="this.statistics.passOrderCount" class="item statisticsItem">
                <el-button size="small" >总通过单数</el-button>
              </el-badge>
              <el-badge :value="this.statistics.pipelneCount" class="item statisticsItem">
                <el-button size="small" >pipeline总数</el-button>
              </el-badge>
            </div>
          </el-form>

          <!-- 流水 -->
          <el-table
            :data="tableData"
            style="width:100%"
            ref="repushTable"
            row-key="orderNo"
            height="550"
            fit
            v-loading="tableLoading"
            stripe
            size="mini"
          >


            <el-table-column
              prop="currentId"
              label="ID"
            >
            </el-table-column>

            <el-table-column
              prop="merchantName"
              label="商户名称"
            >
            </el-table-column>

            <el-table-column
              prop="pipelineName"
              label="pipeline"
            >
            </el-table-column>

            <el-table-column
              prop="orderCount"
              label="风控成功单数"
            >
            </el-table-column>

            <el-table-column
              prop="passOrderCount"
              label="通过"
            >
            </el-table-column>

            <el-table-column
              prop="passingRate"
              label="通过率"
            >
            </el-table-column>
          </el-table>

          <galaxy-pagination
            :totalPages="totalPages"
            :pageSize="pageSize"
            @currentPage="requestPageList($event)"
            v-if="showPages"
          ></galaxy-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图表视图">
        <div class="pass-wrapper">
          <el-form
            size="mini"
            :inline="true"
          >

            <el-form-item
              label="时间"
            >
              <el-date-picker
                v-model="dateContainerChart"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item
              label="商户名称"
            >
              <el-select
                placeholder="请选择"
                v-model="typeValue.merchantVauleChart"
                @change="merchChangeChart"
              >
                <el-option
                  v-for="(item, index) in merchantArrChart"
                  :key="index"
                  :value="item.id"
                  :label="item.merchantName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="chart_wrapper" v-if="showChart">
            <x-chart id="passHighCharts" :optionChart="optionChart"></x-chart>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Highcharts from 'highcharts'
  import galaxyBreadcrumb from '../shared/Breadcrumb';
  import galaxyPagination from '../shared/Pagination';
  import xChart from '../shared/PassHighcharts';
  import { second2Date } from '../../../util';
  import { EXPORT_URL } from '../../../api_root'

  export default {
    data() {
      return {
        exportDisabled: true,
        quitSearchStatus: true,
        currentId: 0,
        pageSize: 300,
        totalPages: 0,
        merchantName: '',
        customerId: '',
        merchantOrderNo: '',
        passTableLoading: false,
        displayMode: 'readTable',
        ids: '',
        tempSelectedArr: [],
        quitSearch: true,
        merchantNo: "",
        merchantNoChart: "",
        showChart: false,
        merchantArr: [
          {
            id: '',
            merchantName: '全部'
          }
        ], // 商户名称
        merchantArrChart: [
          {
            id: '',
            merchantName: '全部'
          }
        ], // 商户名称
        deviceArr: [
          {
            label: '全部',
            value: ''
          },
          {
            label: 'IOS',
            value: 'IOS'
          },
          {
            label: 'ANDROID',
            value: 'ANDROID'
          },
          {
            label: 'H5',
            value: 'H5'
          }
        ], // 设备类型
        groupArr: [
          {
            pipelineGroupId: '',
            pipelineGroupName: '全部'
          }
        ], // 产品列表
        pipelineArr: [
          {
            pipelineId: '',
            pipelineName: '全部'
          }
        ], // pipeline列表
        statistics: {
          orderCounts: '',
          passOrderCount: '',
          pipelneCount: '',
          rejectOrderCount: ''
        },
        tableLoading: false,
        deleteBtnDisabled: false,
        showFlow: false,
        showWarning: false,
        typeValue: {
          merchantValue: '',
          merchantVauleChart: '',
          deviceValue: '',
          groupValue: '',
          pipelineValue: '',
        },
        emailArr: [""],
        flowData: [],
        tableData: [],
        dateContainer: ['', ''],
        dateContainerChart: ['', ''],
        optionChart:{
          chart: {
            type: 'column'
          },
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories: [],
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            stackLabels: {  // 堆叠数据标签
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
            }
          },
          tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><br/><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                style: {
                  // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
                  textOutline: 'none'
                }
              }
            },
            series: { animation: false }
          },
          series: [{
            name: 'reject',
            data: []
          },{
            name: 'pass',
            data: []
          }],
          credits: {
            enabled: true
          },
        },
        // 选项禁用状态
        deviceDis: false,
        groupDis: false,
        pipelineDis: false,
        // 是否进行查询
        searchNo: false,
        pipelineCode: '',
        pipelineGroupId: '',
        pipelineId: '',
        showPages: false
      }
    },

    components: {
      galaxyBreadcrumb,
      galaxyPagination,
      xChart
    },

    created() {
      this.tableLoading = true;
      this.showToday();
      this.firstLoad();
      this.statistic();
      this.merchantList();
    },

    watch: {
      'typeValue.merchantValue': {
        handler(curVal, oldVal) {
          this.typeValue.deviceValue = ""
          this.typeValue.groupValue = ""
          this.typeValue.pipelineValue = ""
          // this.pipelineArr = []
        },
        deep: true
      },
      dateContainerChart: 'chartList',
      merchantNoChart: 'chartList',
    },

    methods: {
      // 显示今天日期
      showToday() {
        this.dateContainer = ['', '']
        let today = second2Date(new Date().getTime(), true);
        this.dateContainer[0] = today + ' 00:00:00';
        this.dateContainer[1] = today + ' 23:59:59';
      },

      merchChangeChart(item) {
        this.merchantNoChart = item
      },

      // 选项联动状态
      merchChange(item) {
        this.groupDis = false
        this.pipelineDis = false
        if(item) {
          this.deviceDis = true
          this.merchantNo = item
        } else {
          this.deviceDis = false
          this.merchantNo = ''
          this.pipelineGroupId = ''
          this.pipelineId = ''
        }
      },
      deviceChange(item) {
        this.typeValue.groupValue = ''
        this.pipelineDis = false
        if(item) {
          this.groupDis = true
          this.groupList();
        } else {
          this.groupDis = false
          this.typeValue.pipelineValue = ''
          this.pipelineGroupId = ''
          this.pipelineId = ''
        }
      },
      groupChange(item) {
        this.typeValue.pipelineValue = ''
        if(item) {
          this.pipelineDis = true
          this.pipelineGroupId = item
          this.pipelineList();
        } else {
          this.pipelineDis = false
          this.pipelineGroupId = ''
          this.pipelineId = ''
        }
      },
      pipelineChange(item) {
        this.pipelineId = item
      },
      // 查询
      search() {
        console.log('search');
        let {deviceValue, groupValue, merchantValue, pipelineValue} = this.typeValue
        if(this.dateContainer == null) {
          this.dateContainer = ["",""]
        }
        this.displayMode = "searchTable";

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

        let merchantNo = "";
        if (this.merchantNo) {
          merchantNo = this.merchantNo;
        }
        console.log(merchantNo)

        let pipelineGroupId = '';
        if(this.pipelineGroupId) {
          pipelineGroupId = this.pipelineGroupId + ''
        }

        let pipelineId = '';
        if(this.pipelineId) {
          pipelineId = this.pipelineId + ''
        }

        console.log(merchantNo, startTime, endTime, deviceValue, groupValue, merchantValue, pipelineValue);

        // if (startTime == "" || endTime == "" || deviceValue == "" || merchantValue == "") {
        //   this.$message.error('请选择时间/商户名称/类型~');
        //   return;
        // }

        this.searchNo = true
        
        let GlxPassingRateFindAO = {
          page: 1, // 页码
          pageSize: 300, // 页数
          asc: false, // 排序
          merchantId: merchantNo, // 商户编号
          deviceId: deviceValue, // 设备ID
          groupId: pipelineGroupId, // 产品ID
          startTime: startTime, // 开始时间
          endTime: endTime, // 结束时间
          pipelineCode: pipelineId // 规则code
        }
        console.log(GlxPassingRateFindAO);
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/list?${token}`, GlxPassingRateFindAO).then(res => {
          return res.json();
        }).then(data => {
          if (data.status == 1) {
            this.quitSearchStatus = false;
            this.tableData = data.data.records;
            this.quitSearch = false;
            this.totalPages = data.data.total;
            for(let i=0; i<data.data.records.length; i++) {
              data.data.records[i].currentId = (i + 1) + (data.data.current -1) * 300
            }
            this.statistic()
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 退出查询
      reloadComponent() {
        let {deviceValue, groupValue, merchantValue, pipelineValue} = this.typeValue

        this.merchantNo = ''
        deviceValue = ''
        this.pipelineGroupId = ''
        this.pipelineId = ''

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

        if (this.searchNo) {
          for(let item in this.typeValue) {
            if(item != "merchantVauleChart") {
              this.typeValue[item] = ''
            }
          }
          this.groupDis = false;
          this.pipelineDis = false;
          this.deviceDis = false;
          this.searchNo = false;
          this.quitSearchStatus = true;
          this.showToday()
          this.firstLoad();
          this.statistic('outSearch')
          return;
        } else {
          this.$message.error('没有查询操作~');
        }

      },

      // 首页渲染列表
      firstLoad() {
        console.log('first load');
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/main?${token}`, {
          pageSize: 300, // 页数
        })
          .then(res => {
            return res.json();
          }).then(data => {
          if (data.status == 1) {
            this.showPages = true
            let records = data.data.records;
            if (records.length > 0) {
              this.exportDisabled = true;
            }
            this.tableData = records;
            this.totalPages = data.data.total;
            this.tableLoading = false;
            for(let i=0; i<data.data.records.length; i++) {
              data.data.records[i].currentId = (i + 1) + (data.data.current -1) * 10
            }
            console.log(data.data.records)
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 图表列表
      chartList() {
        this.showChart = false
        console.log(this.merchantNoChart)
        let {xAxis, series} = this.optionChart
        let sriesData = null

        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        let defaultDateStart = year + '-' + month + '-' + day + ' ' + '00:00:00'
        let defaultDateEnd = year + '-' + month + '-' + day + ' ' + '23:59:59'


        let merchantNoChart = "";
        // if (this.merchantNoChart) {
          merchantNoChart = this.merchantNoChart;
        // }

        let startTime = defaultDateStart;
        if (this.dateContainerChart[0]) {
          startTime = second2Date(this.dateContainerChart[0]) + '';
        }

        let endTime = defaultDateEnd;
        if (this.dateContainerChart[1]) {
          endTime = second2Date(this.dateContainerChart[1]) + '';
        }

        let GlxPassingRateFindAO = {
          page: 1, // 页码
          pageSize: 10, // 页数
          asc: false, // 排序
          merchantId: merchantNoChart, // 商户编号
          deviceId: '', // 设备ID
          groupId: '', // 产品ID
          startTime: startTime, // 开始时间
          endTime: endTime, // 结束时间
          pipelineCode: '' // 规则code
        }


        // 图表数据
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/chart?${token}`, GlxPassingRateFindAO)
          .then(res => {
            return res.json();
          }).then(data => {
          if (data.status == 1) {
            this.showChart = true
            if(data.data) {
              this.showChart = true
              for(let i=0; i<data.data.length; i++) {
                xAxis.categories.unshift(data.data[i].updateTime)
                for(let j=0; j<series.length; j++) {
                  series[j].data.length = 0
                }
              }
              for(let i=0; i<data.data.length; i++) {
                xAxis.categories.unshift(data.data[i].updateTime)
                for(let j=0; j<series.length; j++) {
                  series[j].data.unshift(series[j].name == 'pass' ? data.data[i].passOrderCount*1 : data.data[i].rejectOrderCount*1 )
                }
              }
              this.optionChart.series = series
            } else {
              this.$message.error("没有匹配数据");
              this.showChart = false
            }
          } else {
            this.showChart = false
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },


      // 商户列表
      merchantList() {
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/merchantList?${token}`, {})
          .then(res => {
            return res.json();
          }).then(data => {
          if( data.status == 1 ) {
            if(data.data.length <= 0) {
              this.$message.error('无匹配数据~');
              return
            } else {
              console.log(data.data)
              this.merchantArr = [...this.merchantArr, ...data.data]
              this.merchantArrChart = [...this.merchantArrChart, ...data.data]
              // this.merchantArrChart = data.data
            }
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 统计
      statistic(outSearch) {

        let {deviceValue, groupValue, merchantValue, pipelineValue} = this.typeValue
        if(this.dateContainer == null) {
          this.dateContainer = ["",""]
        }
        this.displayMode = "searchTable";
        let merchantNo = "";
        if (this.merchantNo) {
          merchantNo = this.merchantNo;
        }
        console.log(merchantNo)


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

        let pipelineGroupId = '';
        if(this.pipelineGroupId) {
          pipelineGroupId = this.pipelineGroupId + ''
        }

        let pipelineId = '';
        if(this.pipelineId) {
          pipelineId = this.pipelineId + ''
        }


        let GlxPassingRateFindAO
        if(outSearch) {
          GlxPassingRateFindAO = {
            page: 1, // 页码
            pageSize: 300, // 页数
            asc: false, // 排序
            merchantId: '', // 商户编号
            deviceId: '', // 设备ID
            groupId: '', // 产品ID
            startTime: startTime, // 开始时间
            endTime: endTime, // 结束时间
            pipelineCode: '' // 规则code
          }
        } else {
          GlxPassingRateFindAO = {
            page: 1, // 页码
            pageSize: 300, // 页数
            asc: false, // 排序
            merchantId: merchantNo, // 商户编号
            deviceId: deviceValue, // 设备ID
            groupId: pipelineGroupId, // 产品ID
            startTime: startTime, // 开始时间
            endTime: endTime, // 结束时间
            pipelineCode: pipelineId // 规则code
          }
        }
        
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/statistics?${token}`, GlxPassingRateFindAO)
          .then(res => {
            return res.json();
          }).then(data => {
          console.log(data.data)
          let {orderCounts} = data.data
          if( data.status == 1 ) {
            this.statistics.orderCounts = data.data.orderCount;
            this.statistics.passOrderCount = data.data.passOrderCount;
            this.statistics.pipelneCount = data.data.pipelneCount;
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 产品类型
      groupList() {
        this.groupArr = [
          {
            pipelineGroupId: '',
            pipelineGroupName: '全部'
          }
        ]
        let GlxPassingRateFindAO = {
          merchantId: "" + this.merchantNo,
          deviceId: this.typeValue.deviceValue
        }
        

        console.log(GlxPassingRateFindAO)
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/pipelineContribution/groupList?${token}`, GlxPassingRateFindAO)
          .then(res => {
            return res.json();
          }).then(data => {
          if( data.status == 1 ) {
            console.log(data.data)
            if(data.data.length <=0) {
              this.$message.error("没有匹配的产品类型");
              return
            } else {
              this.groupArr = [...this.groupArr, ...data.data]
            }
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // pipeline
      pipelineList() {
        this.pipelineArr = [
          {
            pipelineId: '',
            pipelineName: '全部'
          }
        ]
        let pipelineGroupId = '';
        if(this.pipelineGroupId) {
          pipelineGroupId = this.pipelineGroupId + ''
        }
        let GlxPassingRateFindAO = {
          groupId: pipelineGroupId
        }
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/pipelineList?${token}`, GlxPassingRateFindAO)
          .then(res => {
            return res.json();
          }).then(data => {
          if( data.status == 1 ) {
            console.log(data.data)
            if(data.data.length <= 0) {
              this.pipelineDis = false
              this.$message.error("没有匹配的pipeline");
              return
            } else {
              this.pipelineArr = [...this.pipelineArr, ...data.data]
            }
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //  导出
      download() {
        let {deviceValue, groupValue, merchantValue, pipelineValue} = this.typeValue
        if(this.dateContainer == null) {
          this.dateContainer = ["",""]
        }
        this.displayMode = "searchTable";
        let merchantNo = "";
        if (this.merchantNo) {
          merchantNo = this.merchantNo;
        }
        console.log(merchantNo)


        let startTime = null;
        if (this.dateContainer[0]) {
          startTime = second2Date(this.dateContainer[0]);
        }

        let endTime = null;
        if (this.dateContainer[1]) {
          endTime = second2Date(this.dateContainer[1]);
        }

        let pipelineGroupId = '';
        if(this.pipelineGroupId) {
          pipelineGroupId = this.pipelineGroupId + ''
        }

        let pipelineId = '';
        if(this.pipelineId) {
          pipelineId = this.pipelineId + ''
        }

        let GlxPassingRateFindAO = {
          page: 1, // 页码
          pageSize: 300, // 页数
          asc: false, // 排序
          merchantId: merchantNo, // 商户编号
          deviceId: deviceValue, // 设备ID
          groupId: pipelineGroupId, // 产品ID
          startTime: startTime, // 开始时间
          endTime: endTime, // 结束时间
          pipelineCode: pipelineId // 规则code
        }

        let token = localStorage.getItem('token');

        let temp = document.createElement("form"); 
        // temp.action = `http://10.17.87.72:2000/mgr/passingRate/download?${token}`;
        temp.action = `${EXPORT_URL}/mgr/passingRate/download?${token}`;
        temp.method = "post"; 
        temp.style.display = "none";
        
        startTime ? this.addPara(temp,"startTime",`${startTime}`) : null
        endTime ? this.addPara(temp,"endTime",`${endTime}`) : null
        this.addPara(temp,"merchantId",`${merchantNo}`);
        this.addPara(temp,"deviceId",`${deviceValue}`);
        this.addPara(temp,"groupId",`${pipelineGroupId}`);
        this.addPara(temp,"pipelineCode",`${pipelineId}`);

        document.body.appendChild(temp);
        temp.submit();
      },

      addPara(form,key,value) {
        var opt = document.createElement("input");
        opt.name = key; 
        opt.value = value; // alert(opt.name)
        form.appendChild(opt);
      },



      // 跳转页面
      requestPageList(page) {
        let {deviceValue, groupValue, merchantValue, pipelineValue} = this.typeValue
        console.log(page)
        this.tableLoading = true;
        console.log('requestPageList');

        let obj = {};

        let merchantNo = "";
        if (this.merchantNo) {
          merchantNo = this.merchantNo;
        }

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

        let pipelineGroupId = '';
        if(this.pipelineGroupId) {
          pipelineGroupId = this.pipelineGroupId + ''
        }

        let pipelineId = '';
        if(this.pipelineId) {
          pipelineId = this.pipelineId + ''
        }

        // console.log(page)

        console.log(merchantNo, deviceValue, pipelineGroupId, startTime, endTime, pipelineId)
        let GlxPassingRateFindAO = {
          page: page, // 页码
          pageSize: 300, // 页数
          asc: false, // 排序
          merchantId: merchantNo, // 商户编号
          deviceId: deviceValue, // 设备ID
          groupId: pipelineGroupId, // 产品ID
          startTime: startTime, // 开始时间
          endTime: endTime, // 结束时间
          pipelineCode: pipelineId // 规则code
        }
        let token = localStorage.getItem('token');
        this.$http.post(`mgr/passingRate/list?${token}`, GlxPassingRateFindAO).then(res => {
          return res.json();
        }).then(data => {
          // console.log(data)
          if (data.status == 1) {
            console.log('>>> ');
            console.log(data);
            this.tableData = data.data.records;
            this.quitSearch = false;
            this.tableLoading = false;
            for(let i=0; i<data.data.records.length; i++) {
              data.data.records[i].currentId = (i + 1) + (data.data.current -1) * 300
            }
          } else {
            this.$message.error(data.msg);
            return;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      batRecreate() {
        console.log('batRecreate');
      },
    }
  }
</script>

<style lang="scss" scoped>
  .pass_wrapper {
    padding: 20px;
    border: 1px solid red;
  }

  .chart_wrapper {
    margin-top: 10px;
  }

  .button {
    text-align: left;
  }

  .statisticsItem {
    margin-right: 40px;
  }

  .outMenu {
    width: 100%;
    display: inline-block;
  }

  strong {
    color: blue;
  }
</style>


