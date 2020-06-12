<template> 
  <div>  
    <h1>Galaxy<span>盖世平台</span></h1>

      <div style="float: right; margin-right: 20px;">
        <el-button
          @click="logout" 
          size="mini">退出</el-button>
      </div>

    <!--
    <div style="float: right; margin-right: 20px;">
        <el-button type="primary" size="mini">小悟空</el-button>
    </div>       -->
  </div>
</template>

<script>
export default {
    data() {
      return {

      }
    },

    methods: {
      logout() {
        console.log('hello logout ~ ');
        let token = localStorage.getItem('token');
        this.$http.get(`logout?${token}`).then(res => {
          return res.json();
        }).then(data => {
          console.log(data);

          if (data.status == 1) {
            // success
            console.log('logout success!');

            location.href = data.data;
          } else {
            this.$message.error(data.msg);
          }

        }).errro(err => {
          console.log(err);
        });
      }
    }
}
</script>

<style lang="scss" scoped> 
 div {
    background: #202331;
    color: white;
    font-family: "Microsoft yahei", Arial, Helvetica, sans-serif;
    
    overflow: hidden;
    h1 {
      font-weight: normal;
      font-size: 25px;
      height: 60px;
      line-height: 60px;
      float: left;
      background: #373B52;
      width: 180px;
      span {
        font-size: 14px;
        height: 60px;
        display: inline-block;
        margin-left: 5px;
      }
    }
  }
</style>


