// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;

// 首页
const main = function() {
    let data = 
        {
            records: [],
            total: 100
        }
    ;
    for (let i = 0; i < 10; i++) {
        let newArticleObject = {
            merchantName: `商户名称${i+1}`, // 商户名称
            pipelineName: `pipelineName${i+1}`, // pipeline名称
            orderCount: Random.integer(1, 100),  // 风控成功单数
            passOrderCount: Random.integer(1, 100), // 通过单数
            passingRate: '', // 通过率
            merchantNo: (i+1) * 100 + '', // 商户编号
            pipelineCode: '', // pipeline编码
            createTime: '', // 创建时间
            orderCompletTime: '' // 订单完成时间
            // title: Random.csentence(5, 6), //  Random.csentence( min, max )
            // thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
            // author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
            // date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
        }
        data.records.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: "",
        data: data
    }
}

// 列表
const list = function() {
    let data = [];
    for (let i = 0; i < 100; i++) {
        let newArticleObject = {
            title: Random.csentence(5, 30), //  Random.csentence( min, max )
            thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
            author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
            date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
        }
        data.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: "",
        data: [
          {
            merchantName: "",
            pipelineName: "",
            orderCount: 1,
            passOrderCount: 1,
            passingRate: "",
            merchantNo: "",
            pipelineCode: "",
            createTime: "",
            orderCompletTime: ""
          }
        ]
      }
}

// 导出
const download = function() {
    let data = [];
    for (let i = 0; i < 100; i++) {
        let newArticleObject = {
            title: Random.csentence(5, 30), //  Random.csentence( min, max )
            thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
            author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
            date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
        }
        data.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: "",
        downloadUrl: ""
      }
}

// 商户列表
const merchantList = function() {
    let data = [];
    for (let i = 0; i < 10; i++) {
        let newArticleObject = {
            merchantNo: '',
            merchantName: `商户名称${i+1}`, // Random.cname() 随机生成一个常见的中文姓名
        }
        data.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: 1,
        data: data,
      }
}

// 设备列表
const deviceList = function() {
    let data = [];
    let dataArr = ['iOS', '安卓', 'H5'];
    for (let i = 0; i < 3; i++) {
        let newArticleObject = {
            deviceId: '',
            deviceName: `${dataArr[i]}`
        }
        data.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: 1,
        data: data
      }
}

// 产品列表
const groupList = function() {
    let data = [];
    let groupArr = ['小蜜蜂7天payday', '14天', '30天']
    for (let i = 0; i < groupArr.length; i++) {
        let newArticleObject = {
            groupId: "",
            groupName: `${groupArr[i]}`
        }
        data.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: 1,
        data: data
      }
}

// 规则列表
const pipelineList = function() {
    let data = [];
    let dataArr = ['pipeline-A', 'pipeline-B', 'pipeline-C'];
    for (let i = 0; i < dataArr.length; i++) {
        let newArticleObject = {
            pipelineId: "",
            pipelineName: `${dataArr[i]}`
        }
        data.push(newArticleObject)
    }
 
    return {
        status: 1,
        msg: "",
        timestamps: 1,
        data: data
      }
}



 
// Mock.mock( url, post/get , 返回的数据)；
// 首页
Mock.mock('/mgr/passingRate/main', 'get', main);
// 列表
Mock.mock('/mgr/passingRate/list', 'post', list);
// 导出
Mock.mock('/mgr/passingRate/download', 'post', download);
// 商户列表
Mock.mock('/mgr/passingRate/merchantList', 'post', merchantList);
// 设备列表
Mock.mock('/mgr/passingRate/deviceList', 'post', deviceList);
// 产品列表
Mock.mock('/mgr/passingRate/groupList', 'post', groupList);
// 规则列表
Mock.mock('/mgr/passingRate/pipelineList', 'post', pipelineList);