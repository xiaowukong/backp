import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import { routes } from './routes';
import HighchartsVue from 'highcharts-vue';


Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(HighchartsVue);


const API_ROOT = {
  yuanhao: "http://10.17.10.117:2000",
  donglei: "http://10.17.87.74:2000",
  haijun: "http://10.17.87.72:2000",
	xudong: "http://10.17.87.67:2000",
  test: "http://47.94.19.116:60004",
	production: "https://39.107.218.199",
	qiufeng: "http://10.17.85.97:2000",
  dev:"http://127.0.0.1:2000",
  // docker配置
  docker: "/api/busi"
};


Vue.http.options.root = API_ROOT.docker;
// Vue.http.options.root = API_ROOT.production;

Vue.http.interceptors.push((req, next) => {
  next(response => {
    let obj = response.headers.map;
    if (obj['sessionstatus'] == "timeout") {
      // location.href = "http://47.94.19.116:60021/Login.html";
      location.href = obj['context-path'];
     return;
    }  
    // if (response.headers.sessionstatus == "timeout") {
    //   location.href = "http://47.94.19.116:60021/Login.html";
    //   return;
    // }
  })
});

const router = new VueRouter({
  routes
});


new Vue({
  el: '#app',
  router,
  render: h => h(App),
  watch: {
    '$route'(to, from) {
      console.log('route change detected!');
    }
  },

  created() {
    this.checkLogin();
    this.goBackIndex();
  },
  methods: {
    goBackIndex() {
    //  this.$router.push('/back/users');
    },
    checkLogin() {
      // if (true) {
      //   this.$router.push('/login');
      // }
    }
  }
})
