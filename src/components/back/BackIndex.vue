<template>
<el-container>
  <el-header>
    <galaxy-header></galaxy-header>
  </el-header>
  <el-container>
    <el-aside width="180px">
      <galaxy-navigation  :navshow="navShow"></galaxy-navigation>
    </el-aside>
    <el-container>
      <el-main>
          <router-view></router-view>
      </el-main>
      <el-footer>
        <galaxy-footer></galaxy-footer>
      </el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
import galaxyHeader from '../shared/Header';
import galaxyNavigation from '../shared/Navigation';
import galaxyFooter from '../shared/Footer';

export default {
  data() {
    return {
      navShow: null
    }
  },
  components: {
    galaxyHeader,
    galaxyNavigation,
    galaxyFooter
  },
  created() {
    let token = location.href.split('?')[1]

    if (token) {
      document.cookie = token
      localStorage.setItem('token', token)
    } else {
      token = localStorage.getItem('token');
    }
    
    // let token = document.cookie.substr(document.cookie.indexOf('=') + 1, 22)
    // console.error(document.cookie.substr(document.cookie.indexOf('=') + 1, 22))
    this.$http.post(`mgr/index?${token}`).then(res=>{
        return res.json()
      }).then(data => {
        console.log(data);
        let max = data.length - 1;
        // 使用冒泡排序根据remark的值来确定显示数据
        for (var j = 0; j < max; j++) {
          let done = true;
          for (var i = 0; i < max - j; i++) {
            if (data[i].remark > data[i + 1].remark) {
              let temp = data[i];
              data[i] = data[i + 1];
              data[i + 1] = temp;
              done = false;
            }
          }
          if (done) {
            break;
          }
        }
        this.navShow = data
      console.log('nav data >>>', data);
        if (data.length > 0) {
          this.$router.push({
            // path: data[0].url + `?${token}`
            path: `/back/index?${token}`
          })
        }
        
      }).catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

 .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    padding: 0;
  }

  .el-footer {
    background: #E9EEF3;
  }
  
  .el-aside {
    background-color: rgb(84, 92, 100);
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    min-height: 1000px;
  }
  
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>




