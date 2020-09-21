<template>
  <div :class="className" :style="{ height, width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['医疗废物', '厨余废物', '可回收物', '有害垃圾', '其他垃圾', '大件废弃物品']
        },
        xAxis: [{
          type: 'category',
          data: ['四月', '五月', '六月', '七月', '八月', '九月', '十月'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        // ['医疗废物', '厨余废物', '可回收物', '有害垃圾', '其他垃圾', '大件废弃物品']
        series: [{
          name: '医疗废物',
          type: 'bar',
          barWidth: '10%',
          data: [79, 52, 200, 334, 390, 330, 220],
        }, {
          name: '厨余废物',
          type: 'bar',
          barWidth: '10%',
          data: [80, 52, 200, 334, 390, 330, 220],
        }, {
          name: '可回收物',
          type: 'bar',
          barWidth: '10%',
          data: [40, 62, 300, 434, 490, 430, 320],
        },{
          name: '有害垃圾',
          type: 'bar',
          
          barWidth: '10%',
          data: [30, 52, 200, 334, 390, 330, 220],
        },{
          name: '其他垃圾',
          type: 'bar',
          
          barWidth: '10%',
          data: [20, 42, 100, 234, 290, 130, 120],
        },{
          name: '大件废弃物品',
          type: 'bar',
          
          barWidth: '10%',
          data: [10, 62, 500, 634, 290, 730, 820],
        }]
      })
    }
  }
}
</script>
