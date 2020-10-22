<template>
  <div class="dashboard-container">
    <div class="header">
      <el-select style="width: 300px; margin-right: 50px" v-model="type" placeholder="请选择" @change="changeSelect">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="time" type="daterange" value-format="timestamp" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="change" />
    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :legend="mockData.map(item => item.value)" :pie-data="pieData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" :legend="mockData.map(item => item.value)" :x-data="chartData.segments" />
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#FFFFFF;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :bar-data="barChartData" :legend="mockData.map(item => item.value)" :x-data="chartData.segments" />
    </el-row>
  </div>
</template>
<script>
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { getSummaryScreen } from '@/api/summary'

const options = [
  { label: '月报', value: '1' },
  { label: '年报', value: '2' },
]
const colors = ['#FF005A', '#3888FA', '#2EC7C9', '#FEB980', '#B6A2DE', '#5AB1EF']

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      options,
      type: '1',
      time: '',
      chartData: {},
      values: { kitchenWaste: '厨余垃圾', recyclableWaste: '可回收垃圾', harmfulWaste: '有害垃圾', otherWaste: '其他垃圾', medicWaste: '医疗垃圾', bulkyWaste: '大件垃圾' },
    }
  },
  computed: {
    mockData() {
      return [
        { key: 'kitchenWaste', value: '厨余垃圾', show: true },
        { key: 'harmfulWaste', value: '有害垃圾', show: true },
        { key: 'otherWaste', value: '其它垃圾', show: true },
        { key: 'medicWaste', value: '医疗垃圾', show: this.type === '1' },
        { key: 'recyclableWaste', value: '可回收垃圾', show: true },
        { key: 'bulkyWaste', value: '大件垃圾', show: this.type === '2' },
      ].filter(item => item.show)
    },
    lineChartData() {
      if (this.chartData && this.chartData.list?.length) {
        return this.mockData.map((item, index) => {
          const data = []
          this.chartData.list.forEach(i => {
            data.push(i[item.key])
          })
          return {
            name: item.value,
            itemStyle: { normal: { color: colors[index], lineStyle: { color: colors[index], width: 2 } } },
            smooth: true,
            type: 'line',
            data,
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          }
        })
      } else {
        return []
      }
    },
    barChartData() {
      if (this.chartData && this.chartData.list?.length) {
        return this.mockData.map((item) => {
          const data = []
          this.chartData.list.forEach(i => {
            data.push(i[item.key])
          })
          return {
            name: item.value,
            type: 'bar',
            barWidth: '10%',
            data,
          }
        })
      } else {
        return []
      }
    },
    currentTime() {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    },
    beforeTme() {
      const date = new Date()
      date.setMonth(date.getMonth() - (this.type === '1' ? 1 : 4))
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    },
    pieData() {
      if (this.chartData && this.chartData.list?.length) {
        return this.mockData.map((item) => {
          const data = []
          this.chartData.list.forEach(i => {
            data.push(i[item.key])
          })
          return {
            name: item.value,
            value: this.sumArr(data),
          }
        })
      } else {
        return []
      }
    },
  },
  watch: {
    type: {
      handler() {
        this.time = [this.beforeTme, this.currentTime]
      },
      immediate: true,
    },
  },
  mounted() {
    this.getScreen({ startTime: this.beforeTme, endTime: this.currentTime, type: this.type })
  },
  methods: {
    changeSelect() {
      this.getScreen({ startTime: this.beforeTme, endTime: this.currentTime, type: this.type })
    },
    change() {
      this.getScreen({ startTime: this.time[0], endTime: this.time[1], type: this.type })
    },
    sumArr(arr) {
      return arr.reduce(function (prev, cur) {
        return prev + cur
      }, 0)
    },
    getScreen(params) {
      getSummaryScreen(params).then(res => {
        this.chartData = res.data
        console.log(res.data)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        border-bottom: 1px solid #EEEEEE;
        padding-bottom: 30px;
      }
    }
  }
</style>
