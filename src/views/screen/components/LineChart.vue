<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

require('echarts/theme/macarons') // echarts theme

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '350px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Array,
      default: () => []
    },
    xData: {
      type: Array,
      default: () => []
    },
    legend: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions()
      },
    },
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
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: this.xData,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: this.legend,
        },
        series: this.chartData,

      })
    },
  },
}
</script>
[
{
name: '医疗废物',
itemStyle: { normal: { color: '#FF005A', lineStyle: { color: '#FF005A', width: 2 } } },
smooth: true,
type: 'line',
data: expectedData,
animationDuration: 2800,
animationEasing: 'cubicInOut',
},
{
name: '厨余废物',
smooth: true,
type: 'line',
itemStyle: {
normal: {
color: '#3888FA',
lineStyle: {
color: '#3888FA',
width: 2,
},
areaStyle: {
color: '#F3F8FF',
},
},
},
data: actualData,
animationDuration: 2800,
animationEasing: 'quadraticOut',
},
{
name: '可回收物',
smooth: true,
type: 'line',
itemStyle: {
normal: {
color: '#2EC7C9',
lineStyle: {
color: '#2EC7C9',
width: 2,
},
areaStyle: {
color: '#F3F8FF',
},
},
},
data: Data1,
animationDuration: 2800,
animationEasing: 'quadraticOut',
},
{
name: '有害垃圾',
smooth: true,
type: 'line',
itemStyle: {
normal: {
color: '#FEB980',
lineStyle: {
color: '#FEB980',
width: 2,
},
areaStyle: {
color: '#F3F8FF',
},
},
},
data: Data2,
animationDuration: 2800,
animationEasing: 'quadraticOut',
},
{
name: '其他垃圾',
smooth: true,
type: 'line',
itemStyle: {
normal: {
color: '#B6A2DE',
lineStyle: {
color: '#B6A2DE',
width: 2,
},
areaStyle: {
color: '#F3F8FF',
},
},
},
data: Data3,
animationDuration: 2800,
animationEasing: 'quadraticOut',
},
{
name: '大件废弃物品',
smooth: true,
type: 'line',
itemStyle: {
normal: {
color: '#5AB1EF',
lineStyle: {
color: '#5AB1EF',
width: 2,
},
areaStyle: {
color: '#F3F8FF',
},
},
},
data: Data4,
animationDuration: 2800,
animationEasing: 'quadraticOut',
}]
