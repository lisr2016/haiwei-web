<template>
  <div class="dashboard-container">
    <div class="header">
      <el-select style="width: 300px; margin-right: 50px" v-model="type" placeholder="请选择" @change="getData">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <div class="btn">
        <el-button>查看</el-button>
        <el-button>下载</el-button>
      </div>
    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart />
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
const lineChartData = {
  expectedData: [100, 120, 161, 134, 105, 160, 165],
  actualData: [120, 82, 91, 154, 162, 140, 145],
  Data1: [110, 62, 51, 134, 122, 110, 125],
  Data2: [130, 72, 61, 144, 132, 120, 135],
  Data3: [140, 92, 71, 154, 142, 130, 145],
  Data4: [150, 52, 81, 164, 152, 160, 165],
}

const options = [
  { label: '周报', value: '0' },
  { label: '年报', value: '1' }
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
      type: '0',
      time: '',
      lineChartData
    }
  },
  methods: {
    getData() {
      console.log('===')
    }
  }
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
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 30px;
      }
    }
  }
</style>
