<template>
    <div class="content-wrapper">
        <galaxy-breadcrumb></galaxy-breadcrumb>

        <div class="contri-wrapper">
            <el-tabs type="border-card">
                <el-tab-pane label="表格视图">
                <el-form 
                    size="mini"
                    :inline="true"
                >

                <el-form-item
                    label="时间"
                >
                    <el-date-picker
                        v-model="dateContainer"
                        @change="selectDate(1)"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
               </el-form-item>

                <el-form-item
                    label="商户"
                    v-if="merchantStatus"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="merchantId"
                        @change="selectMerchant(1)"
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
                    v-if="deviceStatus"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="deviceId"
                        @change="selectDevice(1)"
                    >
                        <el-option
                            value="H5"
                            label="H5"
                        ></el-option>

                        <el-option
                            value="ANDROID"
                            label="ANDROID"
                        ></el-option>

                        <el-option
                            value="IOS"
                            label="IOS"
                        ></el-option>

                    </el-select>
                </el-form-item>  


                <el-form-item
                    label="产品类型"
                    v-if="productStatus"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="product"
                        @change="selectProduct(1)"
                    >
                        <el-option
                            v-for="(item, index) in productArr"
                            :key="index"
                            :value="item.pipelineGroupId"
                            :label="item.pipelineGroupName"
                        ></el-option>
                    </el-select>
                </el-form-item> 

                <el-form-item
                    label="pipeline"
                    v-if="pipelineStatus"
                >
                    <el-select
                        placeholder="请选择"
                        v-model="pipeline"
                        @change="selectPipeline(1)"
                    >
                        <el-option
                            v-for="(item, index) in pipelineArr"
                            :key="index"
                            :value="item.pipelineId"
                            :label="item.pipelineName"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="规则触碰数"
                >
                     <el-input 
                        style="width: 100px"
                        v-model="triggerCount"
                    ></el-input>
                </el-form-item>

                <br>

                  
                
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="search(1)"
                        :disabled="searchStatus"
                    >查询</el-button>
                </el-form-item> 

                <!-- <el-form-item>
                    <el-button
                        type="primary"
                        @click="reloadComponent"
                        :disabled="quitSearch"
                    >退出查询</el-button>
                </el-form-item>       -->

                <el-form-item>
                    <el-button
                        type="warning"
                        :disabled="exportDisabled"
                        @click="exportXLS"
                    >导出</el-button>
                </el-form-item>

                             
            </el-form>

            <p style="color:#909399; font-size:14px;">订单总量: <strong style="color: blue">{{ totalOrders }}</strong></p>
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
                
                <!-- 编辑按钮=>添加弹框 -->
                <el-table-column
                    prop="itemNumber"
                    label="ID"
                    >
                </el-table-column>

                <el-table-column
                    prop="ruleName"
                    label="规则名称"
                    >
                </el-table-column>

                <el-table-column
                    prop="touchOrderCount"
                    label="触碰数"
                >
                </el-table-column>

                <el-table-column
                    prop="touchRate"
                    label="触碰率"
                >
                </el-table-column>   
            </el-table>   

            <galaxy-pagination
                :totalPages="totalPages"
                :pageSize="300"
                @currentPage="requestPageList($event)"
            ></galaxy-pagination>                    

                </el-tab-pane>

<!-- ### split_line ### --> 

                <el-tab-pane label="图表视图">
                    <div class="form_area" style="">
                        <el-form 
                            size="mini"
                            :inline="true"
                        >
                        <el-form-item label="时间">
                            <el-date-picker
                                v-model="dateContainer2"
                                @change="selectDate(2)"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item
                            label="商户"
                            v-if="merchantStatus2"
                        >
                            <el-select
                                placeholder="请选择"
                                v-model="merchantId2"
                                @change="selectMerchant(2)"
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
                            v-if="deviceStatus2"
                        >
                            <el-select
                                placeholder="请选择"
                                v-model="deviceId2"
                                @change="selectDevice(2)"
                            >
                                <el-option
                                    value="H5"
                                    label="H5"
                                ></el-option>

                                <el-option
                                    value="ANDROID"
                                    label="ANDROID"
                                ></el-option>

                                <el-option
                                    value="IOS"
                                    label="IOS"
                                ></el-option>

                            </el-select>
                        </el-form-item>

                            <el-form-item
                                label="产品类型"
                                v-if="productStatus2"
                            >
                                <el-select
                                    placeholder="请选择"
                                    v-model="product2"
                                    @change="selectProduct(2)"
                                >
                                    <el-option
                                        v-for="(item, index) in productArr"
                                        :key="index"
                                        :value="item.pipelineGroupId"
                                        :label="item.pipelineGroupName"
                                    ></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item
                                label="pipeline"
                                v-if="pipelineStatus2"
                            >
                                <el-select
                                    placeholder="请选择"
                                    v-model="pipeline2"
                                    @change="selectPipeline(2)"
                                >
                                    <el-option
                                        v-for="(item, index) in pipelineArr"
                                        :key="index"
                                        :value="item.pipelineId"
                                        :label="item.pipelineName"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
            
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    @click="search(2)"
                                >查询</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button
                                    type="warning"
                                    @click="exportXLS"
                                >导出</el-button>
                            </el-form-item>

                        </el-form>
                    </div>

                    <!-- <highcharts id="passHighCharts" :options="optionChart"></highcharts> -->
                    <div class="chart_wrapper" v-if="hichartsShow">
                        <contri-chart id="contriHighCharts" :optionChart="optionChart"></contri-chart>
                    </div>
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>

<script>
import galaxyBreadcrumb from "../shared/Breadcrumb";
import galaxyPagination from "../shared/Pagination";
import contriChart from '../shared/ContriHighcharts'
import { second2Date } from '../../../util';
import { EXPORT_URL } from '../../../api_root'

export default {
    components: {
        galaxyBreadcrumb,
        galaxyPagination,
        contriChart
    },

    created() {
        this.firstLoad();
    },


    data() {
        return {
            hichartsShow: false,
            exportDisabled: true,

            pageSize: 300,
            startTime: '',
            endTime: '',
            totalOrders: 0,

            dumpValue: '',
            dateContainer: ['', ''],
            dateContainer2: ['', ''],
            merchant: '',
            merchantStatus: false,
            merchantStatus2: false,
            merchantArr: [],
            merchant2: '',
            merchantArr2: [],
            device: '',
            deviceStatus: false,
            deviceStatus2: false,
            deviceArr: [],
            device2: '',
            deviceArr2: [],
            product: '',
            product2: '',
            productStatus: false,
            productStatus2: false,
            productArr: [],
            productArr2: [],
            pipeline: '',
            pipeline2: '',
            pipelineStatus: false,
            pipelineStatus2: false,
            pipelineArr: [],
            pipelineArr2: [],

            merchantId: '',
            merchantId2: '',

            deviceId: '',
            deviceId2: '',

            searchStatus: false,

            totalPages: 0,
            triggerCount: '',
            quitSearch: true,
            quitSearch2: true,
            tableLoading: false,
            tableData: [],
            optionChart: {
                title: {
                    text: ''
                },
                chart: {
                    height: 800
                },

                credits: {
                    enabled: true
                },

                legend: {
                    enabled: true,
                },
                xAxis: {
                    categories: [],
                    crosshair: true
                },

                yAxis: {
                    title: {
                        text: '百分比%',
                    }
                },

                tooltip: {
                    // head + 每个 point + footer 拼接成完整的 table
                    // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    // pointFormat: '<tr><td style="padding:0">{series.name}: </td>' +
                    // '<td style="padding:5px"><b>{point.y:.1f}%</b></td><td style="padding:5px"><b>总单数：{point.orderNum}</b></td><td style="padding:0"><b>触碰单数:{point.touchOrderCount}</b></td></tr>',
                    // footerFormat: '</table>',

                    // pointFormatter: function() {
                    //     console.log(this.series.data)
                    //     let data = this.series
                    //     let y = this.y
                    //     data.data.map(function(item, index){
                    //         return `<span style="color: ${data.color}">\u25CF</span>
                    //             ${data.name}: <b>${y}%</b><br/>总单数: ${data.data[index].orderNum} ;触碰单数: ${data.data[index].touchOrderCount} <br/>.`
                    //     })
                    // },

                    // 提示框格式化字符串 
                    formatter : function (){
                        let s = `<b style="${this.points[0].series.color}; width:"${100}px">${this.x}</b>`;
                        // s += '<table style=""><th><td>触碰率:' + this.y + '%</td></th></table>'
                        s += "<table>"
                        this.points.forEach(item => {
                            s += `<tr><td style="color: ${item.series.color}">${item.series.name}</td><td style="color: ${item.series.color}">触碰率:${((item.point.touchOrderCount/item.point.orderNum)*100).toFixed(2)}%</td><td style="color: ${item.series.color}">总单数:${item.point.orderNum}</td><td style="color: ${item.series.color}">触碰单数:${item.point.touchOrderCount}</td></tr>`
                        })
                        s += '</table>'

                        return s;
                    },
                    shared: true,
                    useHTML: true,
                    backgroundColor: '#fff',
                },

                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        events: {
                            legendItemClick: function(e) {
                                console.log('click item!');
                                // return false;
                            }
                        },
                    }
                },
                series: [
                    
                ]
            }
        }
    },

    watch: {
        optionChart: {
            handle(newVal, oldVal) {
                console.log(newVal)
            },
        },
        deep: true
    },


    methods: {
        firstLoad() {
            // let self = this;
            console.log('first load ...');
            let token = localStorage.getItem('token');
            this.$http.get(`mgr/pipelineContribution/main?${token}`)
                .then(res => {
                    return res.json();
                }).then(data => {
                    console.log('>>> ', data);
                    this.getMerchant();
                }).catch(err => {
                    console.log(err);
                })
        },

        orderTotal() {

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

            let obj = {
                page: 1, // 页码
                pageSize: 300, // 页数
                asc: false, // 排序
                merchantId, // 商户编号
                deviceId, // 设备ID
                groupId: product, // 产品ID
                startTime: startTime, // 开始时间
                endTime: endTime, // 结束时间
                pipelineCode: pipeline // 规则code
            }

            let token = localStorage.getItem('token');
        
            this.$http.post(`mgr/passingRate/statistics?${token}`, obj)
                .then(res => {
                    return res.json();
                }).then(data => {
                    console.log(data)
          
                if( data.status == 1 ) {
                    this.totalOrders = data.data.orderCount;
                } else {
                    this.$message.error(data.msg);
                    return;
                }
            }).catch(err => {
                console.log(err);
            })
        },

        selectPipeline(num) {
            console.log('select Pipeline ... ');
        },

        selectProduct(num) {
            console.log('select Product ... ');
            console.log(this.product);
            if(num === 1) {  
                this.pipelineStatus = true;
                this.pipeline = "";
            } else if(num === 2) {
                this.pipelineStatus2 = true;
                this.pipeline2 = "";
            }
            this.pipelineArr = [];
            this.getPipeline(num);
        },

        selectProduct2() {
            console.log('select Product 2 ... ');
        },

        selectDevice(num) {
             console.log('select device ... ');
             console.log(this.deviceId);
             if(num === 1) {
                this.product = "";
                this.pipeline = "";
                this.productStatus = true
             } else if(num === 2) {
                this.product2 = "";
                this.pipeline2 = "";
                this.productStatus2 = true
                this.pipelineStatus2 = false
             }

            this.productArr = [];
            this.pipelineArr = [];

            this.getProd(num);
        },

        exportXLS() {
            console.log('export XLS ... ');

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
            // temp.action = `http://10.17.87.72:2000/mgr/pipelineContribution/download?${token}`;
            temp.action = `${EXPORT_URL}/mgr/pipelineContribution/download?${token}`;
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
          var opt = document.createElement("input"); 
          opt.name = key; 
          opt.value = value; // alert(opt.name) 
          form.appendChild(opt); 
        },

        exportXLS2() {
            console.log('export XLS2 ... ');
        },

        reloadComponent() {
            console.log('reload Component ... ');
        },

        search(num) {
            console.log('search ...');
            let {xAxis, series} = this.optionChart
            if(num == 1) {
                let today = second2Date(new Date().getTime(), true);
                let startTime = "";
                let endTime = "";
                if (this.dateContainer[0]) {
                    startTime = second2Date(this.dateContainer[0]);
                } else {
                    startTime = today + ' 00:00:00';
                }
                
                if (this.dateContainer[1]) {
                    endTime = second2Date(this.dateContainer[1]);
                } else {
                    endTime = today + ' 23:59:59';
                }
            } else if(num == 2) {
                let today = second2Date(new Date().getTime(), true);
                let startTime = "";
                let endTime = "";
                if (this.dateContainer2[0]) {
                    startTime = second2Date(this.dateContainer2[0]);
                } else {
                    startTime = today + ' 00:00:00';
                }

                if (this.dateContainer2[1]) {
                    endTime = second2Date(this.dateContainer2[1]);
                } else {
                    endTime = today + ' 23:59:59';
                }
            }

            let merchantId1 = "";
            let merchantId2 = "";
            let deviceId1 = "";
            let deviceId2 = "";
            let groupId1 = "";
            let groupId2 = "";
            let pipelineCode1 = "";
            let pipelineCode2 = "";

            if(num === 1) {
                
                if (this.merchantId) {
                    merchantId1 = this.merchantId;
                }
                
                if (this.deviceId) {
                    deviceId1= this.deviceId;
                }
                
                if (this.product) {
                    groupId1 = this.product;
                }
                
                if (this.pipeline) {
                    pipelineCode1 = this.pipeline;
                }
            } else if(num === 2) {
                if (this.merchantId2) {
                    merchantId2 = this.merchantId2;
                }

                if (this.deviceId2) {
                    deviceId2 = this.deviceId2;
                }
                
                if (this.product2) {
                    groupId2 = this.product2;
                }
                
                if (this.pipeline2) {
                    pipelineCode2 = this.pipeline2;
                }
            }
            
            let merchantId = num == 1?merchantId1:merchantId2
            let deviceId = num == 1?deviceId1:deviceId2
            let groupId = num == 1?groupId1:groupId2
            let pipelineCode = num == 1?pipelineCode1:pipelineCode2

            let hitCount = "";
            if (this.triggerCount) {
                hitCount = this.triggerCount;
            }

            let today = second2Date(new Date().getTime(), true);
                let startTime = "";
                if (this.dateContainer[0]) {
                    startTime = second2Date(this.dateContainer[0]);
                } 

                let endTime = "";
                if (this.dateContainer[1]) {
                    endTime = second2Date(this.dateContainer[1]);
                }

            if (startTime == "" && endTime == "" && merchantId == "" && deviceId == "" && groupId == "" && pipelineCode == "") {
                if (num == 1) {
                    this.$message.error('除 规则触碰数 以外, 其余都为必选项！');
                } else {
                    this.$message.error('都为必填项!');
                }
                
                return;
            }

            if (num == 1) {
                this.orderTotal();
            }

            let page = num == 2 ? 1 : num
            let pageSize = 300;

            let obj = {
                startTime,
                endTime,
                merchantId,
                deviceId,
                groupId,
                pipelineCode,
                hitCount,
                page,
                pageSize
            };

            if(num === 2) {
                let today = second2Date(new Date().getTime(), true);
                let startTime = "";
                if (this.dateContainer2[0]) {
                    startTime = second2Date(this.dateContainer2[0]);
                } 

                let endTime = "";
                if (this.dateContainer2[1]) {
                    endTime = second2Date(this.dateContainer2[1]);
                }

                if (startTime == "" || endTime == "" || merchantId == "" || deviceId == "" || groupId == "" || pipelineCode == "") {
                    this.$message.error('都为必选项！');
                    return;
                }

                let obj = {
                    startTime,
                    endTime,
                    merchantId,
                    deviceId,
                    groupId,
                    pipelineCode,
                    hitCount,
                    page,
                    pageSize                    
                };

                this.hichartsShow = false
                let token = localStorage.getItem('token');
                this.$http.post(`mgr/pipelineContribution/chart?${token}`, obj)
                .then(res => {
                    return res.json();
                }).then(data => {
                    if(data.data) {
                        if (data.status == 1) {
                            let chartList = data.data
                            for(let i=0; i<chartList.length; i++) {
                                for(let j=0; j<series.length; j++) {
                                    series[j].data.length = 0
                                }
                            }

                            for(let i=0; i<chartList.length; i++) {
                                // 动态生成series
                                series[i] = {
                                    name: chartList[i].ruleName,
                                    visible: false,
                                    // data: [
                                    //     {
                                    //         name: '',
                                    //         num: []
                                    //     }
                                    // ]
                                    data: [],
                                }
                                for(let j=0; j<chartList[i].list.length; j++) {
                                    // x轴时间
                                    xAxis.categories.unshift(chartList[i].list[j].updateTime)
                                    // 时间对应数据
                                    // series[i].data.unshift(
                                    //     parseInt(chartList[i].list[j].touchRate)
                                    // )
                                    series[i].data.unshift(
                                        {
                                            y: parseInt(chartList[i].list[j].touchRate),
                                            orderNum: chartList[i].list[j].orderCount*1,
                                            touchOrderCount: chartList[i].list[j].touchOrderCount*1
                                        }
                                    )
                                }
                            }
                            this.hichartsShow = true
                        } else {
                            this.$message.error(data.msg);
                        }
                    } else {
                        this.$message.error('未返回数据');
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                let token = localStorage.getItem('token');
                this.$http.post(`mgr/pipelineContribution/list?${token}`, obj)
                    .then(res => {
                        return res.json();
                    }).then(data => {
                        console.log(data);

                        if (data.status == 1) {
                            let records = data.data.records;
                            if (records.length > 0) {
                                this.exportDisabled = false;
                            }
                            records.forEach((item, key) => {
                                item.itemNumber = (key + 1) + 300 * (num - 1);
                            });

                            this.tableData = records;
                            this.totalPages = data.data.total;
                        } else {
                            this.$message.error(data.msg);
                        }
                    }).catch(err => {
                        console.log(err);
                    })
            }

            
        },

        selectDate(num) {
            console.log('select Date ...');
            console.log(this.dateContainer);
            let date = ''
            let len = null;
            if(num === 1) {
                date = this.dateContainer
            } else if(num === 2) {
                date = this.dateContainer2
            }

            if (date[0]) {
                this.startTime = second2Date(date[0]);
            }

            if (date[1]) {
                len = second2Date(date[1]).indexOf(' ')
                this.endTime = second2Date(date[1]).substring(0,len) + ' 23:59:59';
            }

            if(num === 1) {
                if (date && date.length > 0) {
                    this.merchantStatus = true;
                } else {
                    this.merchantId = "";
                }
            } else if(num === 2) {
                if (date && date.length > 0) {
                    this.merchantStatus2 = true;
                    
                } else {
                    this.merchantId2 = "";
                }
            }
            
        },

        selectMerchant(num) {
            console.log(num)
            console.log('select Merchant ... ');
            console.log(this.merchantId);
            if(num === 1) {
                this.deviceStatus = true;
                this.productStatus = false
                this.pipelineStatus = false
                this.product = "";
                this.pipeline = "";
            } else if(num === 2) {
                // if(this.deviceId2) {
                //     this.productStatus2 = true
                // }
                this.deviceId2 = ""
                this.product2 = "";
                this.pipeline2 = ""
                this.deviceStatus2 = true;
                this.productStatus2 = false;
                this.pipelineStatus2 = false
            }

            // this.deviceId = "";

            this.productArr = [];
            
            this.pipelineArr = [];

            console.log(this.deviceId)

            this.getProd(num);
        },

        requestPageList(page) {
            this.search(page);
        },

        getPipeline(num) {
            console.log('get Pipeline ... ');
            let groupId = num == 1 ? this.product : this.product2;
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/pipelineContribution/pipelineList?${token}`, {
                groupId
            })
                .then(res => {
                    return res.json();
                }).then(data => {
                    console.log(data);
                    if (data.status == 1) {
                        this.pipelineArr = data.data;
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                })
        },

        getMerchant() {
            console.log('get Merchant ...');
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/pipelineContribution/merchantList?${token}`, {})
                .then(res => {
                    return res.json();
                }).then(data => {
                    console.log(data);

                    if (data.status == 1) {
                        this.merchantArr = data.data;
                        
                        
                    }
                }).catch(err => {
                    console.log(err);
                });
        },

        getDevice() {
            console.log('get Device ...');
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/pipelineContribution/deviceList?${token}`, {})
            .then(res => {
                return res.json();
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.log(err);
            });
        },

        getProd(num) {
            console.log('get Prod ...');
            let merchantId
            if(num == 1) {
                merchantId = this.merchantId;
            } else if(num == 2) {
                merchantId = this.merchantId2;
            }
            let deviceId1 = this.deviceId;
            let deviceId2 = this.deviceId2;
            let deviceId = num == 1? deviceId1:deviceId2
            console.log(merchantId, deviceId);
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/pipelineContribution/groupList?${token}`, {
                merchantId,
                deviceId
            }
)
            .then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                if (data.status == 1) {
                    console.log('SUCCESS!');
                    if (data.data.length > 0) {
                        console.log(num)
                        this.productArr = data.data;
                        this.searchStatus = false;
                    } else {
                        this.$message.error('无匹配数据~ !');
                        this.searchStatus = true;
                        if(num === 1) {
                            this.productStatus = "";
                            this.pipelineStatus = "";
                        } else if(num === 2) {
                            this.productStatus2 = "";
                            this.pipelineStatus2 = "";
                        }
                    }
                } else {
                    this.$message.error(data.msg);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    },    
}
</script>

<style lang="scss" scoped>
    .chart_wrapper{
        // overflow:auto;
        height: 1000px;
    }
</style>


