<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item 
            v-for="item in $route.matched" 
            :key="item.path"
            :to="{ path: item.path }">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>    
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
    .el-breadcrumb {
        padding-bottom: 20px;
    }
</style>


