import UserManagement from './components/back/UserManagement';
import OperatorManagement from './components/back/OperatorManagement';
import OrderManagement from './components/back/OrderManagement';
import Hang from './components/back/Hang';
import LoanAfterMonitor from './components/back/LoanAfterMonitor'
import Pass from './components/back/Pass';
import Contri from './components/back/Contri';
import Index from './components/back/Index';
import Monitor from './components/back/Monitor';
import DataCenter from './components/back/DataCenter';
import Dbs from './components/back/Dbs';
import OrderCenter from './components/back/OrderCenter';
import ServiceBill from './components/back/ServiceBill';
import BillManagement from './components/back/BillManagement';
import OperateLog from './components/back/OperateLog';
import Login from './components/back/Login';
import ChangePassword from './components/back/ChangePassword';
import BackIndex from './components/back/BackIndex';
import Yqjc from './components/back/Yqjc';
import BackIndexContent from './components/back/BackIndexContent';
import NotFound from './components/shared/NotFound';

export const routes = [
    {
        path: '',
        redirect: '/back'
    },
    
    {
        path: '/login',
        component: Login,
        name: 'Galaxy登录'
    },

    {
        path: '/cpw',
        component: ChangePassword,
        name: 'Galaxy修改登录密码'
    },

    {
        path: '/back',
        redirect: '/back/index'
    },

    {
        path: '/back/ordercenter',
        redirect: '/back/ordercenter/orders'
    },

    {
        path: '/back/monitor',
        redirect: '/back/monitor/pass'
    },

    {
        path: "/back",
        component: BackIndex,
        name: '后台管理',
        children: [
            {
                path: "index",
                component: Index,
                name: '后台首页'
            },
            {
                path: "users",
                component: UserManagement,
                name: '商户管理'
            },
            
            {
                path: "operators",
                component: OperatorManagement,
                name: '账户管理'
            },

            {
                path: 'ordercenter',
                component: OrderCenter,
                name: '订单中心',
                children: [
                    {
                        path: "orders",
                        component: OrderManagement,
                        name: "订单管理"
                    },

                    {
                        path: 'hang',
                        component: Hang,
                        name: '挂单监测'
                    }
                ]
            },

            {
                path: 'datacenter',
                component: DataCenter,
                name: '数据中心',
                children: [
                    {
                        path: 'dbs',
                        component: Dbs,
                        name: '数据溯源'
                    }
                ]
            },

            {
                path: 'monitor',
                component: Monitor,
                name: '数据监测',
                children: [
                    {
                        path: 'pass',
                        component: Pass,
                        name: '通过率监测'
                    },

                    {
                        path: 'contri',
                        component: Contri,
                        name: '规则贡献度'
                    },

                    {
                        path: 'loanaftermonitor',
                        component: LoanAfterMonitor,
                        name: '贷后监测'
                    },

                    {
                        path: 'yqjc',
                        component: Yqjc,
                        name: '逾期监测'
                    }
                ]
            },
        
            {
                path: "services",
                component: ServiceBill,
                name: "服务计费"
            },
        
            {
                path: "bills",
                component: BillManagement,
                name: '计费管理'
            },
        
            {
                path: "logs",
                component: OperateLog,
                name: '操作日志'
            }
        ]
    },

    {
        path: '*',
        component: NotFound,
        name: '页面不存在'
    },

    
];