<template>
  <div class="x-bar">
    <div :id="id" :optionChart="optionChart"></div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
export default {
    data() {
        return {
            
        }
    },
    // 验证类型
    props: {
        id: {
            type: String
        },
        optionChart: {
            type: Object
        },
    },

    mounted() {
        Highcharts.chart(this.id,this.optionChart)
    },
}
</script>
<style>
    .x-bar{
    }
</style>
