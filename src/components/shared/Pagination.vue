<template>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 25]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalPages">
    </el-pagination>
</template>

<script>
export default {
    props: ['totalPages', 'pageSize'],
    methods: {
        handleSizeChange(val) {
            console.log(`${val} items per page.`);
        },

        handleCurrentChange(val) {
            console.log(`current: ${val}`);
            this.$emit('currentPage', val);
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-pagination {
        margin-top: 20px;
        float: right;
    }
</style>


