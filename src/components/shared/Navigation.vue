<template>

    <el-menu
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        acitve-background-color="#ffff00"
        :default-active="$route.path"
    >
        <el-menu-item
            index="/back/index">
            <template slot="title">
                首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页
            </template>
        </el-menu-item>
        <div
            v-for="(item, key) in navList"
            :key="key"
        >
            <el-submenu
                v-if="item.subs.length && (item.name == '数据中心' || item.name == '订单中心' || item.name == '数据监测')"
                :index="item.url"
            >
                <template slot="title">
                    {{item.name}}
                </template>
                <el-menu-item-group>
                    <el-menu-item
                        v-for="(item, key) in item.subs"
                        :key="key"
                        :index="item.url"
                    >
                        {{item.name}}
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item
                v-else-if="Number.isInteger(Number(item.remark))"
                :index="item.url"
            >
                <template>
                    {{item.name}}
                </template>
            </el-menu-item>
        </div>
    </el-menu>


               <!-- <el-menu

                router
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                acitve-background-color="#ffff00"
                :default-active="$route.path"
            >
                <el-menu-item
                    index="/back/index">
                    <template slot="title">
                    首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页
                    </template>
                </el-menu-item>
                <el-menu-item 
                    index="/back/users">
                    <template slot="title">
                    商户管理
                    </template>
                </el-menu-item>

                <el-menu-item
                    index="/back/operators"
                >
                <template slot="title">
                    账户管理
                </template>
                </el-menu-item>

                <el-submenu index="/back/ordercenter/orders">
                    <template slot="title">
                        <span>订单中心</span>
                    </template>

                    <el-menu-item-group>
                        <el-menu-item 
                            index="/back/ordercenter/orders">订单管理</el-menu-item>
                        <el-menu-item 
                            index="/back/ordercenter/hang">挂单监测</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <el-submenu index="/back/datacenter/dbs">
                    <template slot="title">
                        <span>数据中心</span>
                    </template>

                    <el-menu-item-group>
                        <el-menu-item 
                            index="/back/datacenter/dbs">数据溯源</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <el-submenu index="/back/monitor/pass">
                    <template slot="title">
                        <span>数据监测</span>
                    </template>

                    <el-menu-item-group>
                        <el-menu-item 
                            index="/back/monitor/pass">通过率监测</el-menu-item>
                        <el-menu-item 
                            index="/back/monitor/contri">规则贡献度</el-menu-item>
                        <el-menu-item 
                            index="/back/monitor/loanaftermonitor">贷后监测</el-menu-item>
                        <el-menu-item
                            index="/back/monitor/yqjc">逾期率监测</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
      
                <el-menu-item index="/back/services">
                    <span slot="title">服务计费</span>
                </el-menu-item>

                <el-menu-item index="/back/bills">
                    <span slot="title">计费管理</span>
                </el-menu-item>

                <el-menu-item index="/back/logs">
                    <span slot="title">操作日志</span>
                </el-menu-item>

            </el-menu> -->


</template>

<script>
export default {
    data() {
        return {
            navList: null
        }
    },
    props: [
        'navshow'
    ],
    watch: {
        navshow: function(newVal,oldVal){
            let newValArr = [...newVal]
            let secondArr = []
            for(let i=0; i<newValArr.length; i++) {
                if(!Number.isInteger(Number(newVal[i].remark))) {
                    secondArr.push(newVal[i])
                }
            }
            // for(let i=0; i<secondArr.length; i++) {
            //     for(let j=0; j<newValArr.length; j++) {
            //         if(Math.floor(secondArr[i].remark) == newValArr[j].remark) {
            //             this.$set(newValArr[j], 'subs', [])
            //         }
            //     } 
            // }
            for(let i=0; i<secondArr.length; i++) {
                for(let j=0; j<newValArr.length; j++) {
                    if(Math.floor(secondArr[i].remark) == newValArr[j].remark) {
                        newValArr[j].subs.push(secondArr[i])
                    }
                } 
            }
            console.error(newValArr)
            this.navList = newValArr;  //newVal即是navshow
        }
    },
    beforeUpdate: function() {
        this.activeIndex = this.$route.matched[1].path;
    },
   methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },

    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
   }
}
</script>

<style lang="scss">
   
    div.el-submenu__title::before {
        content: "";
        margin-left: -30px;
        margin-right: 10px;
        display: inline-block;
    }
    .el-menu-vertical-demo {
        border-right: none;
        overflow: hidden;

        ul {
            li.el-menu-item {
                list-style: square inside;
                text-align: left;
                text-indent: 20px;
            }

            
        }

        & > li.el-menu-item::before {
            content: "";
            margin-left: -30px;
            margin-right: 10px;
            display: inline-block;
            }
        .el-submenu .el-menu-item {
            padding: 0 20px 0 0px;
        }
    }

    i.el-submenu__icon-arrow {
        color: #fff;
    }
</style>


