<template>
  <div class="dashboard-container">
    <div class="header">
      <el-select style="width: 300px; margin-right: 50px" v-model="type" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="time" type="daterange" value-format="timestamp" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <div class="btn">
        <el-button @click="getScreen">查看</el-button>
        <el-button @click="download">下载</el-button>
      </div>
    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
<!--          <pie-chart v-model="pieData.value" :legend="pieData.legend" />-->
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#FFFFFF;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart />
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { getSummaryScreen } from '@/api/summary'

const lineChartData = {
  expectedData: [100, 120, 161, 134, 105, 160, 165],
  actualData: [120, 82, 91, 154, 162, 140, 145],
  Data1: [110, 62, 51, 134, 122, 110, 125],
  Data2: [130, 72, 61, 144, 132, 120, 135],
  Data3: [140, 92, 71, 154, 142, 130, 145],
  Data4: [150, 52, 81, 164, 152, 160, 165],
}

const downloadData = [
  {
    'consignee': 1,
    'guide': 1,
    'inspector': 1,
    'kitchenWasteCollectors': 2,
    'kitchenWastePositons': 2,
    'recyclableWasteCollectors': 2,
    'recyclableWastePositons': 2,
    'harmfulWasteCollectors': 2,
    'harmfulWastePositons': 2,
    'otherWasteCollectors': 2,
    'otherWastePositons': 2,
    'medicWasteCollectors': 2,
    'medicWastePositons': 2,
    'bulkyWastePositons': 2,
    'kitchenWaste': 3,
    'recyclableWaste': 3,
    'harmfulWaste': 3,
    'otherWaste': 3,
    'medicWaste': 3,
    'reportCount': 1,
  },
  {
    'consignee': 1,
    'guide': 1,
    'inspector': 1,
    'kitchenWasteCollectors': 2,
    'kitchenWastePositons': 2,
    'recyclableWasteCollectors': 2,
    'recyclableWastePositons': 2,
    'harmfulWasteCollectors': 2,
    'harmfulWastePositons': 2,
    'otherWasteCollectors': 2,
    'otherWastePositons': 2,
    'medicWasteCollectors': 2,
    'medicWastePositons': 2,
    'bulkyWastePositons': 2,
    'kitchenWaste': 3,
    'recyclableWaste': 3,
    'harmfulWaste': 3,
    'otherWaste': 3,
    'medicWaste': 3,
    'reportCount': 1,
  },
  {
    'consignee': 1,
    'guide': 1,
    'inspector': 1,
    'kitchenWasteCollectors': 2,
    'kitchenWastePositons': 2,
    'recyclableWasteCollectors': 2,
    'recyclableWastePositons': 2,
    'harmfulWasteCollectors': 2,
    'harmfulWastePositons': 2,
    'otherWasteCollectors': 2,
    'otherWastePositons': 2,
    'medicWasteCollectors': 2,
    'medicWastePositons': 2,
    'bulkyWastePositons': 2,
    'kitchenWaste': 3,
    'recyclableWaste': 3,
    'harmfulWaste': 3,
    'otherWaste': 3,
    'medicWaste': 3,
    'reportCount': 1,
  },
]
const arr = [
  { label: '专兼职收运人员', id: 'consignee', unit: '人' },
  { label: '专兼职看守引导人员', id: 'guide', unit: '人' },
  { label: '专兼职监督检查人员', id: 'inspector', unit: '人' },
  { label: '厨余垃圾收集容器', id: 'kitchenWasteCollectors', unit: '个' },
  { label: '厨余垃圾收集存放处', id: 'kitchenWastePositons', unit: '处' },
  { label: '可回收垃圾收集容器', id: 'recyclableWasteCollectors', unit: '个' },
  { label: '可回收垃圾收集存放处', id: 'recyclableWastePositons', unit: '处' },
  { label: '有害垃圾收集容器', id: 'harmfulWasteCollectors', unit: '个' },
  { label: '有害垃圾收集存放处', id: 'harmfulWastePositons', unit: '处' },
  { label: '其他垃圾收集容器', id: 'otherWastePositons', unit: '个' },
  { label: '其他垃圾收集存放处', id: 'otherWastePositons', unit: '处' },
  { label: '医疗垃圾收集容器', id: 'medicWasteCollectors', unit: '个' },
  { label: '医疗垃圾收集存放处', id: 'medicWastePositons', unit: '处' },
  { label: '大件垃圾存放处', id: 'bulkyWastePositons', unit: '处' },
  { label: '厨余垃圾', id: 'kitchenWaste', unit: '千克' },
  { label: '可回收物', id: 'recyclableWaste', unit: '千克' },
  { label: '有害垃圾', id: 'harmfulWaste', unit: '千克' },
  { label: '医疗垃圾', id: 'medicWaste', unit: '千克' },
  { label: '其他垃圾', id: 'otherWaste', unit: '千克' },
]
const options = [
  { label: '月报', value: '1' },
  { label: '年报', value: '2' },
]
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
      lineChartData,
      chartData: {},
      values: { kitchenWaste: '厨余垃圾', recyclableWaste: '可回收垃圾', harmfulWaste: '有害垃圾', otherWaste: '其他垃圾', medicWaste: '医疗垃圾', bulkyWaste: '大件垃圾' },
    }
  },
  computed: {
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
      const { list } = this.chartData
      if (list && list.length) {
        const keys = Object.keys(list[0])
        const legend = keys.map(key => this.values[key])
        const total = this.sum(list)
        const value = legend.map((item, index) => {
          return { name: item, value: _.get(total, _.get(keys, index)) }
        })
        return { legend, value }
      } else {
        return { legend: [], value: [] }
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
    console.log(this.pieData)
    this.getScreen()
  },
  methods: {
    sum(arr) {
      return arr.reduce((res, v) => {
        return Object.keys(v).reduce((res, k) => {
          res[k] = (res[k] || 0) + v[k]
          return res
        }, res)
      }, {})
    },
    getScreen() {
      const params = { startTime: this.beforeTme, endTime: this.currentTime, type: this.type }
      getSummaryScreen(params).then(res => {
        this.chartData = res.data
      })
    },
    download() {
      const header = []
      const body = []
      arr.forEach(item => {
        header.push(item.label)
        body.push(item.id)
      })
      const data = []
      downloadData.forEach(item => {
        const items = []
        body.forEach(key => {
          items.push(item[key])
        })
        data.push(items)
      })
      import('@/utils/excel').then(excel => {
        excel.export_json_to_excel({
          header,
          data,
          filename: '数据大屏',
          autoWidth: true,
          bookType: 'xlsx',
        })
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
