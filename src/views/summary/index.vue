<template>
  <div class="dashboard-container">
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in card" :label="item.label" :name="item.active" :key="item.active" />
    </el-tabs>
    <div class="progress-box">
      <span>填报进度</span>
      <el-progress :percentage="50" />
    </div>
    <div v-if="active === '0'" class="day-table">
      <div class="header">
        <div class="header-title">查看日期</div>
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </div>
<!--   周报box -->
    <div v-if="active === '1'" class="week-table">周报</div>
    <div v-if="active === '2'" class="month-table">月报</div>
    <div v-if="active === '3'" class="month">医疗</div>
  </div>
</template>

<script>
import { getDomesticDaily } from '@/api/summary'
export default {
  name: 'Dashboard',
  data() {
    return {
      active: '0',
      startTime: '',
      card: [
        { label: '生活垃圾日报', active: '0', method: getDomesticDaily },
        { label: '生活垃圾周报', active: '1', method: getDomesticDaily },
        { label: '生活垃圾月报', active: '2', method: getDomesticDaily },
        { label: '医疗垃圾月报', active: '3', method: getDomesticDaily },
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .progress-box {
      display: flex;
      font-size: 16px;
      margin: 20px 0;

      .el-progress {
        width: 90%;
        margin-left: 20px;
      }
    }

    .day-table {
      .header {
        display: flex;
        height: 40px;
        line-height: 40px;

        .header-title {
          margin-right: 20px;
        }
      }
    }

  }
}
</style>
