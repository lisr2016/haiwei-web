<template>
  <div class="dashboard-container">
    <el-tabs v-model="active" type="card">
      <el-tab-pane v-for="item in card" :label="item.label" :name="item.active" :key="item.active" />
    </el-tabs>
    <div class="progress-box">
      <span>填报进度</span>
      <el-progress :percentage="50" />
    </div>
    <div class="header">
      <div class="left">
        <div class="header-title">查看日期</div>
        <el-date-picker v-if="active === '0'" value-format="timestamp" :editable="false" v-model="startTime" type="date" placeholder="选择日期" @change="getData" />
        <el-select style="width: 300px" v-else-if="active === '1'" v-model="startTime" placeholder="请选择" @change="getData">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker v-else v-model="startTime" type="month" value-format="timestamp" :editable="false" placeholder="请选择查看月份" @change="getData" />
      </div>
      <el-button>下载</el-button>
    </div>
    <div style="margin-bottom: 20px">当前汇总情况</div>
    <div v-if="active === '0'" class="table" v-loading="loading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾分类管理工作会议</div>
        <div class="text item">
          开展生活垃圾分类管理工作会议次数：{{ cardData.meetingTimes || 0 }}次
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾分类管理</div>
        <div class="item">自测、巡查次数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">发现存在问题：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾分类宣传</div>
        <div class="item">宣传次数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">宣传方式：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾分类培训</div>
        <div class="item">培训人数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">培训次数：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">配合相关部门、属地政府进行检查</div>
        <div class="item">开展检查次数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">发现存在问题个数：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
    </div>
    <div v-if="active === '1'" class="table" v-loading="loading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">专兼职人员</div>
        <div class="item">专兼职收运人员：{{ cardData.meetingTimes || 0 }}人</div>
        <div class="item">专兼职看守引导人员：{{ cardData.meetingTimes || 0 }}人</div>
        <div class="item">专兼职监督检查人员：{{ cardData.meetingTimes || 0 }}人</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">收集设施设备配置</div>
        <div class="item">自测、巡查次数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">发现存在问题：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾分类宣传</div>
        <div class="item">宣传次数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">宣传方式：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾分类培训</div>
        <div class="item">培训人数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">培训次数：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">配合相关部门、属地政府进行检查</div>
        <div class="item">开展检查次数：{{ cardData.selfTimes || 0 }}次</div>
        <div class="item">发现存在问题个数：{{ cardData.selfProblems || 0 }}次</div>
      </el-card>
    </div>
    <div v-if="active === '2'" class="table" v-loading="loading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">生活垃圾月报汇总</div>
        <div class="item">厨余垃圾：{{ cardData.meetingTimes || 0 }}千克</div>
        <div class="item">可回收物：{{ cardData.meetingTimes || 0 }}千克</div>
        <div class="item">有害垃圾：{{ cardData.meetingTimes || 0 }}千克</div>
        <div class="item">其他垃圾：{{ cardData.meetingTimes || 0 }}千克</div>
      </el-card>
    </div>
    <div v-if="active === '3'" class="table" v-loading="loading">
      <el-card class="box-card">
        <div slot="header" class="clearfix">医疗垃圾月报</div>
        <div class="text item">
          医疗垃圾月产量：{{ cardData.meetingTimes || 0 }}千克
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDomesticDaily, getDomesticWeekly, getDomesticMonthly, getMedicMonthly } from '@/api/summary'
import { getWeeks } from '@/utils'
export default {
  name: 'Dashboard',
  data() {
    return {
      active: '0',
      startTime: null,
      card: [
        { label: '生活垃圾日报', active: '0', method: getDomesticDaily },
        { label: '生活垃圾周报', active: '1', method: getDomesticDaily },
        { label: '生活垃圾月报', active: '2', method: getDomesticDaily },
        { label: '医疗垃圾月报', active: '3', method: getDomesticDaily },
      ],
      cardData: {},
      loading: true,
      api: getDomesticDaily
    }
  },
  computed: {
    options() {
      const arr = getWeeks()
      if (arr.length) {
        return arr.map(item => ({ value: item.timestamp, label: `${item.start}到${item.end}` }))
      }
      return []
    }
  },
  watch: {
    active: {
      handler(val) {
        console.log(val)
        switch (val) {
          case '0':
            this.startTime = new Date().getTime();
            this.api = getDomesticDaily
            break
          case '1':
            this.startTime = this.options[this.options.length - 1].value;
            this.api = getDomesticWeekly
            break
          case '2':
            const date = new Date();
            date.setDate(1);
            date.setHours(0);
            date.setSeconds(0);
            date.setMinutes(0);
            this.startTime = date.getTime();
            this.api = getDomesticMonthly
            break
          case '3':
            this.startTime = new Date().getTime();
            this.api = getMedicMonthly
            break
        }
        this.getData()
      },
      immediate: true
    }
  },
  methods: {
    getData() {
      this.loading = true

      console.log(this.startTime)
      const params = { startTime: this.startTime }
      this.api(params).then(res => {
        this.cardData = res.data
        setTimeout(() => {
          this.loading = false
        }, 1000)
        console.log(this.cardData)
      })
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

    .box-card {
      margin-bottom: 20px;

      .item {
        line-height: 30px;
      }
    }

    .header {
      display: flex;
      height: 40px;
      line-height: 40px;
      margin-bottom: 20px;
      justify-content: space-between;

      .left {
        display: flex;
        .header-title {
          margin-right: 20px;
        }
      }


    }

  }
}
</style>
