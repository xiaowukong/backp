<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>

export default {

}
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

#unexpand_table {
  .el-table__expand-icon {
    display: none;
  }

  .el-table__expanded-cell {
    padding: 0 20px 20px;
  }
}
</style>


