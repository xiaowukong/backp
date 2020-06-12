
## 依赖下载源设置

1. `$ npm i nrm -g`
1. `$ npm ls`
1. `$ npm use taobao`

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for docker image in linux
# 打包docker前需要修改访问后端的地址（main.js,api_root.js），走nginx反向代理
npm run docker-test
npm run docker
```

## start docker
m
``` bash
docker run -p 8090:8090 --name business-mgr-web ${镜像id}
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 前端配置项

### docker
- main.js
- api_root.js

### 菜单项
- navigation.vue
