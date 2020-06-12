<template>
    <div class="content-wrapper">
        <galaxy-breadcrumb></galaxy-breadcrumb>

        <div class="dbs-wrapper">
            <el-form 
                size="mini"
                :inline="true"
                >

                <el-form-item label="order_no">
                    <el-input 
                        v-model.trim="orderNo"
                        style="width: 240px"
                    ></el-input>
                </el-form-item>

               <el-form-item label="report_no">
                    <el-input 
                        v-model.trim="reportNo"
                        style="width: 240px"
                    ></el-input>
                </el-form-item>                 
                
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="search"
                        :disabled="disabledSearch"
                    >查询</el-button>
                </el-form-item> 

                <el-form-item>
                    <el-button
                        type="warning"
                        @click="emptyForm"
                    >清空</el-button>
                </el-form-item>

                <!-- <el-form-item>
                    <el-button
                        type="primary"
                        @click="reloadComponent"
                        :disabled="quitSearch"
                    >退出查询</el-button>
                </el-form-item> -->
            </el-form>

            <div class="legend-wrapper">
                <span class="text">贷后表现</span>
                <span class="dhbx box"></span>

                <span class="text">风控结果</span>
                <span class="fkjg box"></span>

                <span class="text">规则结果</span>
                <span class="gzjg box"></span>

                <span class="text">判断条件</span>
                <span class="pdtj box"></span>

                <span class="text">风控规则</span>
                <span class="fkgz1 box"></span>
                <span class="fkgz2 box"></span>
                <span class="fkgz3 box"></span>
            </div>

            <div class="network-wrapper">
                <div 
                    v-if="showLoading"
                    class="loading">
                    <div class="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <network
                    v-if="showNetwork"
                    ref="network"
                    class="network"
                    :edges="edges"
                    :nodes="nodes"
                    :events="['hoverNode', 'blurNode','selectNode', 'deselectNode']"
                    :options="options"
                    @select-node="selectNode"
                    @deselect-node="deseletNode"
                    @hover-node="hoverNode"
                    @blur-node="blurNode"
                ></network>
            </div>

        </div><!-- .dbs-wrapper -->

        <el-dialog
            title=""
            :visible.sync="showDataDialog"
            width="550px"
            :before-close="closeDataDialog"
            >
            <pre v-if="showDataDialog">{{ insertData | pretty }}</pre>
            <br>
            <el-button 
            type="primary" 
            size="mini"
            style="position: absolute; right: 15px; bottom:15px;"
            @click="closeDataDialog">确 定</el-button>
            
        </el-dialog>
    </div><!-- .content-wrapper -->
</template>

<script>
import { Network } from 'vue2vis';
import galaxyBreadcrumb from '../shared/Breadcrumb'
// import "vue2vis/dist/vue2vis.css";

export default {
    data() {
        return {
            // orderNo: 'ON3910618031937526373645840',
            orderNo: '',
            reportNo: '',
            // reportNo: 'RN4495357850573404775983058',
            showNetwork: false,
            showLoading: false,
            showDataDialog: false,
            insertData: {},
            disabledSearch: false,
            oriData: '',
            popsArr: [],
            nodes: [],
            edges: [],
            
            options: {
                autoResize: true,
                height: '4000px',
                clickToUse: true,
                interaction: {
                    dragNodes: true
                },
                edges: {
                    arrows: 'to'
                },
                nodes: {
                    shape: 'box',
                    fixed: false,
                    widthConstraint: {
                        maximum: 300,
                        minimum: 100
                    },
                    font: {
                        multi: 'html'
                    }
                },
                
                layout: {
                    improvedLayout: true,
                    hierarchical: {
                        direction: 'LR',
                        levelSeparation: 500,
                        nodeSpacing: 150
                    }
                    // randomSeed: 9
                },
                physics: {
                    enabled: false
                    // hierarchicalRepulsion: {
                    //     centralGravity: 0.0,
                    //     springLength: 500,
                    //     springConstant: 0.01,
                    //     nodeDistance: 400,
                    //     damping: 0.09
                    // },
                    // solver: 'hierarchicalRepulsion'
                }
            }
        }
    },
    components: {
        galaxyBreadcrumb,
        Network
    },

    filters: {
        pretty(value) {
            return JSON.stringify(JSON.parse(value), null, 2);
        }
    },

    methods: {
        emptyForm() {
            this.orderNo = "";
            this.reportNo = "";
            this.showNetwork = false;
            this.showLoading = false;
        },
        search() {
            this.disabledSearch = true;
            console.log('search');
            let self = this;
            this.showLoading = true;
            let orderNo = "";
            if (this.orderNo) {
                orderNo = this.orderNo;
            }

            let reportNo = "";
            if (this.reportNo) {
                reportNo = this.reportNo;
            }

            if (orderNo == "" && reportNo == "") {
                this.$message.error('至少填写一项查询条件～');
                this.showLoading = false;
                this.disabledSearch = false;
                return;
            }
            
            this.showNetwork = false;
            this.nodes = [];
            this.edges = [];
            this.popsArr = [];
            let token = localStorage.getItem('token');
            this.$http.post(`mgr/rcReportSource/rcReport?${token}`, {
                orderNo,
                reportNo
            }).then(res => {
                return res.json()
            }).then(oriData => {
                // console.log(oriData);
                
                if (oriData.status == 1) {
                    this.oriData = oriData.data
                    // this.oriData = debugJSON;

                    let data = oriData.data;
                    // let data = debugJSON;
                    let nodes = this.nodes;
                    let edges = this.edges;
                    let list = data.ruleResultDTOList;

                    let popsArr = this.popsArr;

                    let layer2Arr = list.map((item, key) => {
                        return {
                            id: key + 2,
                            label: `${item.ruleResult}

                                    ${item.ruleName}
                                    
                                    ${item.decisionFlag}`,
                            group: 'layer2'
                        }
                    });

                    let layer3Arr = list.map((item, key) => {
                        return {
                            id: (key + 2) * 999,
                            label: `${item.judgeFunctionDTO.functionName}

                                    <i>判断条件</i>`,
                            group: 'layer3'
                        }
                    });

                    let layer4Arr = list.map((item, key) => {
                        let obj = {};
                        let id = (key + 2) * (-9);
                        let type = item.leftFunctionDTO.calculateDataType;

                        let paramDTOList = item.leftFunctionDTO.paramDTOList;
                        let gender = "";
                        for (let i = 0; i < paramDTOList.length; i++) {
                            gender += `\n${paramDTOList[i].paramName}`;
                        }

                        // console.log('type >>> ', type);
                        if (type == "java.util.List" || type == "java.util.Map") {
                            obj = {
                                id,
                                label: `<i>左变量函数返回值</i>

                                        ${item.leftFunctionDTO.functionName}
                                        
                                        点击查看详情`,
                                group: 'layer4'
                            }

                            popsArr.push(
                                {
                                    id,
                                    label: item.leftFunctionDTO.calculateDataResult
                                }
                            )
                        } else {
                            obj = {
                                id,
                                label: `<i>左变量函数返回值</i>

                                        ${item.leftFunctionDTO.calculateDataResult}`,
                                group: 'layer4'
                            }
                        }
                        return obj;
                    })

                    let layer4Arr2= list.map((item, key) => {
                        let obj = {};
                        let id = (key + 2) * (-9) * 1000;

                        if (item.rightFunctionDTO) {
                            let type = item.rightFunctionDTO.calculateDataType;

                            let paramDTOList = item.rightFunctionDTO.paramDTOList;
                            let gender = "";

                            for (let i = 0; i < paramDTOList.length; i++) {
                                gender += `\n${paramDTOList[i].paramName}`;
                            }
                                              // console.log('type: ', type);
                            if (type == "java.util.List" || type == "java.util.Map") {
                                obj = {
                                    id,
                                    label: `<i>右变量函数返回值</i>

                                            ${item.rightFunctionDTO.functionName}
                                            
                                            点击查看详情`,
                                    group: 'layer4'
                                }

                                popsArr.push(
                                    {
                                        id,
                                        label: item.rightFunctionDTO.calculateDataResult
                                    }
                                )
                            } else {
                                obj = {
                                    id,
                                    label: `<i>右变量函数返回值</i>

                                            ${item.rightFunctionDTO.calculateDataResult}`,
                                    group: 'layer4'
                                }
                            }
                            
                        } else {
                            obj = {
                                id,
                                label: '',
                                group: 'layer4'
                            }
                        }
                        
                        return obj;
                    })                    

                    let layer5Arr= list.map((item, key) => {
                        
                        let id = key + "l6";

                        return {
                            id,
                            label: `<i>函数名称</i>

                                    ${item.leftFunctionDTO.functionName}`,
                            group: 'layer5'
                        }
                    })

                    let layer5Arr2= list.map((item, key) => {
                        let obj = {};
                        let id = key + "l62";

                        if (item.rightFunctionDTO) {
                            obj = {
                                id,
                                label: `<i>函数名称</i>

                                        ${item.rightFunctionDTO.functionName}`,
                                group: 'layer5'
                            }
                        } else {
                            obj = {
                                id,
                                label: '',
                                group: 'layer5'
                            }
                        }
                        
                        return obj;
                    });     
                    
                    let layer6Arr = [];
                    list.forEach((item, key) => {
                        let obj = {};
                        let id = key + 'l6';
                        
                        let paramDTOList = item.leftFunctionDTO.paramDTOList;
                        // let gender = "";
                        // let tempArr = [];

                        for (let i = 0; i < paramDTOList.length; i++) {
                            
                            let item = paramDTOList[i];
                            // console.log('item >>>', i, item);
                            // gender += `${item.paramName} ${item.paramValue}`;

                            if (item.paramType == "java.util.List" || item.paramType == "java.util.Map") {
                                popsArr.push({
                                    id: `${id}-${i}`,
                                    label: item.paramValue
                                });


                                 layer6Arr.push({
                                    id: `${id}-${i}`,
                                    label: `<i>左变量字段</i>

                                            ${item.paramName}
                                            
                                            点击查看详情`,
                                    group: 'layer6'
                                });

                                
                            } else {
                                
                                 layer6Arr.push( {
                                    id: `${id}-${i}`,
                                    label: `<i>左变量字段</i>

                                            ${item.paramName} ${item.paramValue}`,
                                    group: 'layer6'
                                });
                            }
                             
                        }
                       
                    });

                    // console.log('layer6Arr >>> ', layer6Arr);
                    let layer6Arr2 = [];
                    list.map((item, key) => {
                        let obj = {};
                        let id = key + 'l62';

                        if (item.rightFunctionDTO) {
                            let paramDTOList = item.rightFunctionDTO.paramDTOList;

                            let gender = "";

                            for (let i = 0; i < paramDTOList.length; i++) {
                                let item = paramDTOList[i];
                                // gender += `${item.paramName} ${item.paramValue}`;
                                // console.log('item >>> ', item);
                                if (item.paramType == "java.util.List" || item.paramType == "java.util.Map") {
                                    popsArr.push({
                                        id: `${id}-${i}`,
                                        label: item.paramValue
                                    });

                                    layer6Arr2.push({
                                        id: `${id}-${i}`,
                                        label: `<i>右变量字段</i>

                                                ${item.paramName}
                                                
                                                点击查看详情`,
                                        group: 'layer6'
                                    });
                                } else {
                                    layer6Arr2.push(
                                        {
                                            id: `${id}-${i}`,
                                            label: `<i>右变量字段</i>
                                        
                                                    ${item.paramName} ${item.paramValue}`,
                                            group: 'layer6'
                                        }
                                    ) 
                                }
                            }
                        } else {
                            layer6Arr2.push({
                                id: `${id}-xxxx`,
                                label: '',
                                group: 'layer6'
                            })
                        }
                    });
                    // console.log('layer6Arr2: ', layer6Arr2);
                    // console.log(layer2Arr);
                    nodes.push(
                        {
                            id: 0,
                            label: `<i>customerId</i>: ${data.customerId}

                                    <i>flowNo</i>: ${data.flowNo}

                                    <i>应还款日期</i>: ${data.paidOffTime}

                                    ${data.loanStatus}`,
                            group: 'layer0'
                        },
                        
                        {
                            id: 1,
                            label: `风控结果: ${data.riskLevel}`,
                            group: 'layer1'
                        }
                    );
                    layer2Arr.forEach((item, key) => {
                        nodes.push(item);
                        edges.push({
                            from: 1,
                            to: key + 2
                        })
                    });

                    layer3Arr.forEach((item, key) => {
                        nodes.push(item);
                        edges.push({
                            from: key + 2,
                            to: (key + 2) * 999
                        })
                    });

                    layer4Arr.forEach((item, key) => {
                        
                        nodes.push(item);
                        edges.push({
                            from: (key + 2) * 999,
                            to: (key + 2) * (-9)
                        })
                    });

                    layer4Arr2.forEach((item, key) => {
                        if (item.label != "") {
                            nodes.push(item);
                        }
                        
                        edges.push({
                            from: (key + 2) * 999,
                            to: (key + 2) * (-9) * 1000
                        })
                    });    
                    
                    layer5Arr.forEach((item, key) => {
                        
                        nodes.push(item);
                        edges.push({
                            from: (key + 2) * (-9),
                            to: key + "l6"
                        })
                    });

                    layer5Arr2.forEach((item, key) => {
                        if (item.label != "") {
                            nodes.push(item);
                        }
                        
                        edges.push({
                            from: (key + 2) * (-9) * 1000,
                            to: key + "l62"
                        })
                    });

                    layer6Arr.forEach((item, key) => {
                        // console.log('item.id >>>', key + 'l6', item.id);
                        let nodeId = "";
                        if (item.id.length == 6 || item.id.length == 7) {
                            nodeId = item.id.slice(0, 4);
                        } else {
                            nodeId = item.id.slice(0, 3);
                        }

                        // console.log('nodeId >>>', key, nodeId);
                        let obj = {
                            from : nodeId,
                            to: item.id
                        }
                        // console.log(nodeId, item.id);

                        nodes.push(item);
                        edges.push(obj);
                    });

                    layer6Arr2.forEach((item, key) => {
                        // console.log('>>> ', item.id);
                        let nodeId = "";
                        if (item.id.length == 6) {
                            nodeId = item.id.slice(0, 4);
                        }

                        if (item.id.length == 7 || item.id.length == 5) {
                            nodeId = item.id.slice(0, 5);
                        }

                        console.log('nodeId >>>', nodeId);
                        let obj = {
                            from : nodeId,
                            to: item.id
                        }
                        console.log(item.id.length, item.id);
                        
                        if (item.label != "") {
                            nodes.push(item);
                            
                        }
                        edges.push(obj);
                        
                    })

                    edges.push(
                        {
                            from: 0,
                            to: 1
                        }
                    );

               
                    this.showNetwork = true;

                    this.$nextTick(() => {
                        
                    });
                    

                    this.showLoading = false;
                    setTimeout(() => {
                        self.disabledSearch = false;
                    }, 1500);
                    // console.log('nodes >>> ', this.nodes);
                } else {
                    this.showLoading = false;
                    this.$message.error(oriData.msg);
                    setTimeout(() => {
                        self.disabledSearch = false;
                    }, 1500);

                    return;
                }
                // let self = this;
                
                
            }).catch(err => {
                this.showLoading = false;

                // let self = this;
                setTimemout(() => {
                    self.disabledSearch = false;
                }, 2500);
                console.log(err);
            })
        },

        reloadComponent() {
            console.log('reloadComponent');
        },

        hoverNode() {
          console.log('hoverNode');  
        },

        blurNode() {
            console.log('blurNode');
        },

        deseletNode(params) {
            console.log('deselectNode');
        },
        closeDataDialog() {
            console.log('closeDataDialog');
            this.$refs.network.unselectAll();
            this.showDataDialog = false;
        },
        selectNode(params) {
            console.log('select my node ...')
            // console.log(params);

            let itemId = params.nodes[0];
            console.log('select node >>> ', itemId);

            let popsArr = this.popsArr;
            // console.log('popsArr >>> ', popsArr);
            let selectItem = popsArr.find((item, key) => {
                // console.log('>>> ', item.id, itemId);
                return item.id == itemId;
            });

            console.log('selectItem >>> ', selectItem);

            if (typeof selectItem != "undefined") {
                if (selectItem.label == "") {
                    this.$message.error('数据为空～');
                    this.closeDataDialog();
                    return;
                }

                this.insertData = selectItem.label;
                this.showDataDialog = true;
            }
            
          }

            

        }

    }
// }
</script>

<style lang="scss" scoped>
    pre {
        font-family: Monaco, Arial, Helvetica, sans-serif;
        word-break: break-word; 
    }
    .dbs_wrapper {
        padding: 20px;
        
    }
    
    .network-wrapper {
        border: 1px solid #fff;
        height: 4000px;
        position: relative;
    }

    .loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .lds-roller {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  left: -webkit-calc(50% - 32px);
  left: -moz-calc(50% - 32px);
  top: 258px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #666;
  margin: -3px 0 0 -3px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 50px;
  left: 50px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 54px;
  left: 45px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 57px;
  left: 39px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 58px;
  left: 32px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 57px;
  left: 25px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 54px;
  left: 19px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 50px;
  left: 14px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 45px;
  left: 10px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

    .legend-wrapper {
        margin-bottom: 15px;
        .text {
            color: #606266;
            font-size: 14px;
        }

        .box {
            width: 30px;
            height: 10px;
            border: 1px solid black;
            display: inline-block;
            margin-right: 20px;
            position: relative;
            top: 2px;
        }

        .dhbx {
            background: #8cbafc;
            border: 1px solid #246ddd;
        }

        .fkjg {
            background: #ffff99;
            border: 1px solid #ff9a02;
        }

        .gzjg {
            background: rgb(255, 160, 163);
            border: 1px solid rgb(255, 0, 1);
        }

        .pdtj {
            background: rgb(62, 224, 72);
            border: 1px solid rgb(61, 185, 93);
        }

        .fkgz1 {
            background: #e872f2;
            border: 1px solid #dd25ee;
            margin-right: 10px;
        }

        .fkgz2 {
            background: #a37ae0;
            border: 1px solid #7026ee;
            margin-right: 10px;
        }

        .fkgz3 {
            background: #ff9e0b;
            border: 1px solid #cb8618;
            margin-right: 10px;
        }
    }

</style>


