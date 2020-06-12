<template>
<el-container>
  <el-header>
    <galaxy-header></galaxy-header>
  </el-header>
  <el-container>
    <el-aside width="180px">
      <galaxy-navigation></galaxy-navigation>
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
  components: {
    galaxyHeader,
    galaxyNavigation,
    galaxyFooter
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




