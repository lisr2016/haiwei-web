<template>
  <div class="dashboard-container">
    <el-tabs v-model="active" type="card">
      <el-tab-pane v-for="item in card" :label="item.label" :name="item.active" :key="item.active" />
    </el-tabs>
    <div class="progress-box">
      <span class="text">填报进度：{{ cardData.reportCount }} / {{ num || 0 }}</span>
      <el-progress :percentage="percentage" />
    </div>
    <div class="header">
      <div class="left">
        <div class="header-title">查看日期</div>
        <el-date-picker v-if="active === '0'" value-format="timestamp" :editable="false" v-model="startTime" type="date" placeholder="选择日期" @change="getData" />
        <el-select style="width: 300px" v-else-if="active === '1'" v-model="startTime" placeholder="请选择" @change="getData">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker v-else v-model="startTime" type="month" value-format="timestamp" :editable="false" placeholder="请选择查看月份" @change="getData" />
        <div class="header-title" style="margin-left: 10px">级别</div>
        <el-select style="width: 300px" v-model="level" placeholder="请选择" @change="getData">
          <el-option v-for="(item, index) in levels" :key="index" :label="item" :value="!index ? 'all' : String(index)" />
        </el-select>
      </div>
      <el-button @click="download">下载</el-button>
    </div>
    <div style="margin-bottom: 20px">当前汇总情况</div>
    <el-button type="text" size="small" @click="getSubmittedOrg('1')">已提交机构列表</el-button>
    <el-button v-if="level !== 'all'" type="text" size="small" @click="getSubmittedOrg('2')">未提交机构列表</el-button>
    <div class="table" v-loading="loading">
      <el-card v-for="(item, index) in list" :key="index" class="box-card">
        <div slot="header" class="clearfix">{{ item.title }}</div>
        <div v-for="(i, key) in item.child" :key="key" class="item">
          {{ i.label }}：{{ cardData[i.id] || 0 }}{{ i.unit }}
        </div>
      </el-card>
    </div>

    <el-dialog :title="title" :visible.sync="visible_one">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope">
            {{ (offset - 1) * 10 + scope.$index  + 1  }}
          </template>
        </el-table-column>
        <el-table-column label="机构名称" align="center">
          <template slot-scope="scope">
            <span :style="{ color: otherType === '1' ? '#409EFF' : '' }" @click="visibleChange(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;padding-left: 0"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="allData.length">
      </el-pagination>
    </el-dialog>
    <el-dialog title="报告详情" :visible.sync="visible_two">
      报告详情：
      <el-table-column v-if="type === '1'" align="center" width="300px">
        宣传方式:{{orgDetail.advertise_content}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        宣传次数:{{orgDetail.advertise_times}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        政府检查次数:{{orgDetail.gov_inspection_content}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        是否改正到位:{{orgDetail.gov_inspection_corrected?'是':'否'}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        主要涉及问题:{{orgDetail.gov_inspection_problems}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        存在问题数目:{{orgDetail.gov_inspection_times}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        会议具体事项:{{orgDetail.meeting_content}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        管理工作会议主持人:{{orgDetail.meeting_host}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        管理工作会议次数:{{orgDetail.meeting_times}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        主要涉及问题:{{orgDetail.self_inspection_content}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        是否改正到位:{{orgDetail.self_inspection_corrected?'是':'否'}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        存在问题数目:{{orgDetail.self_inspection_problems}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        自测、巡查次数:{{orgDetail.self_inspection_times}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        培训人数:{{orgDetail.trainees}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        培训内容:{{orgDetail.traning_content}}
      </el-table-column>
      <el-table-column v-if="type === '1'" align="center" width="300px">
        培训次数:{{orgDetail.traning_times}}
      </el-table-column>



      <el-table-column v-if="type === '2'" align="center" width="300px">
        收运人员:{{orgDetail.consignee}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        看守引导人员:{{orgDetail.guide}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        监督检查人员:{{orgDetail.inspector}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        厨余垃圾投放收集容器(个):{{orgDetail.kitchen_waste_collectors}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        厨余垃圾单位暂时存放点(处):{{orgDetail.kitchen_waste_positons}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        可回收物投放收集容器(个):{{orgDetail.recyclable_waste_collectors}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        可回收物单位暂时存放点(处):{{orgDetail.recyclable_waste_positons}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        有害垃圾投放收集容器(个):{{orgDetail.harmful_waste_collectors}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        有害垃圾单位暂时存放点(处):{{orgDetail.harmful_waste_positons}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        其他垃圾投放收集容器(个):{{orgDetail.other_waste_collectors}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        其他垃圾单位暂时存放点(处):{{orgDetail.other_waste_positons}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        医疗垃圾投放收集容器(个):{{orgDetail.medic_waste_collectors}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        医疗垃圾单位暂时存放点(处):{{orgDetail.medic_waste_positons}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        大件垃圾单位暂时存放点(处):{{orgDetail.bulky_waste_positons}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        厨余垃圾(公斤):{{orgDetail.kitchen_waste}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        可回收垃圾(公斤):{{orgDetail.recyclable_waste}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        有害垃圾(公斤):{{orgDetail.harmful_waste}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        其他垃圾(公斤):{{orgDetail.other_waste}}
      </el-table-column>
      <el-table-column v-if="type === '2'" align="center" width="300px">
        医疗废物(公斤):{{orgDetail.medic_waste}}
      </el-table-column>







      <el-table-column align="center" width="300px">
        报告提交人手机号:{{orgDetail.phone}}
      </el-table-column>
      <el-table-column align="center" width="300px">
        报告提交时间:{{orgDetail.submitTime}}
      </el-table-column>
    </el-dialog>
  </div>
</template>

<script>
import { getDomesticDaily, getDomesticMonthly, getDomesticWeekly, getMedicMonthly, getSummaryTotal, getBarrelMonthly, getReportSubmitted, getReportDetail } from '@/api/summary'
import { getWeeks } from '@/utils'
import {saveAs} from 'file-saver'
import ExcelTable from '@/utils/tableUtil'
import dayjs from 'dayjs'

export default {
  name: 'Dashboard',
  data() {
    return {
      active: '0',
      startTime: null,
      total: 0,
      level: 'all',
      levels: ['全部','三级医院', '二级医院', '一级医院', '门诊部', '诊所', '未定级', '医务室', '卫生室', '社区卫生服务中心（区属）',  '社区卫生服务中心（非区属）','社区卫生服务站'],
      card: [
        { label: '生活垃圾日报', active: '0' },
        { label: '生活垃圾周报', active: '1' },
        { label: '生活垃圾月报', active: '2' },
        { label: '医疗垃圾月报', active: '3' },
        { label: '桶前值守月报', active: '4' },
      ],
      cardData: {},
      loading: true,
      api: getDomesticDaily,
      Excel: null,
      tableLoading: true,
      visible_one: false,
      visible_two: false,
      tableData: [],
      allData: [],
      title: '',
      otherType: '',
      type: '',
      orgDetail: '',
      offset: 1
    }
  },
  computed: {
    list() {
      return [
        { title: '生活垃圾分类管理工作会议', child: [{ label: '开展生活垃圾分类管理工作会议次数', id: 'meetingTimes', unit: '次' }], show: this.active === '0' },
        {
          title: '生活垃圾分类管理',
          child: [
            { label: '自测、巡查次数', id: 'selfInspectionTimes', unit: '次' },
            { label: '发现存在问题', id: 'selfInspectionProblems', unit: '个' },
          ],
          show: this.active === '0',
        },
        { title: '生活垃圾分类宣传', child: [{ label: '宣传次数', id: 'advertiseTimes', unit: '次' }], show: this.active === '0' },
        {
          title: '生活垃圾分类培训',
          child: [
            { label: '培训人数', id: 'trainees', unit: '人' },
            { label: '培训次数', id: 'traningTimes', unit: '次' },
          ],
          show: this.active === '0',
        },
        {
          title: '配合相关部门、属地政府进行检查',
          child: [
            { label: '开展检查次数', id: 'govInspectionTimes', unit: '次' },
            { label: '发现存在问题个数', id: 'govInspectionProblems', unit: '个' },
          ],
          show: this.active === '0',
        },
        {
          title: '专兼职人员',
          child: [
            { label: '专兼职收运人员', id: 'consignee', unit: '人' },
            { label: '专兼职看守引导人员', id: 'guide', unit: '人' },
            { label: '专兼职监督检查人员', id: 'inspector', unit: '人' },
          ],
          show: this.active === '1',
        },
        {
          title: '收集设施设备配置',
          child: [
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
          ],
          show: this.active === '1',
        },
        {
          title: '垃圾收集情况',
          child: [
            { label: '厨余垃圾', id: 'kitchenWaste', unit: '千克' },
            { label: '可回收物', id: 'recyclableWaste', unit: '千克' },
            { label: '有害垃圾', id: 'harmfulWaste', unit: '千克' },
            { label: '医疗垃圾', id: 'medicWaste', unit: '千克' },
            { label: '其他垃圾', id: 'otherWaste', unit: '千克' },
          ],
          show: this.active === '1',
        },
        {
          title: '生活垃圾月报汇总',
          child: [
            { label: '厨余垃圾', id: 'kitchenWaste', unit: '千克' },
            { label: '可回收物', id: 'recyclableWaste', unit: '千克' },
            { label: '有害垃圾', id: 'harmfulWaste', unit: '千克' },
            { label: '大件垃圾', id: 'bulkyWaste', unit: '千克' },
            { label: '其他垃圾', id: 'otherWaste', unit: '千克' },
          ],
          show: this.active === '2',
        },
        { title: '医疗垃圾月报', child: [{ label: '医疗垃圾月产量', id: 'totalWeight', unit: '千克' }], show: this.active === '3' },
        { title: '桶前值守月报', child: [{ label: '桶前值守人数', id: 'personCountOnDuty', unit: '人' }], show: this.active === '4' },
      ].filter(item => item.show)
    },
    num() {
      if (!this.total) return 0;
      return this.total[this.level] ? this.total[this.level] : 0
    },
    options() {
      const arr = getWeeks()
      if (arr.length) {
        return arr.map(item => ({ value: item.timestamp, label: `${item.start}到${item.end}` }))
      }
      return []
    },
    percentage() {
      if (this.cardData.reportCount && this.num) {
        return Math.round(this.cardData.reportCount / this.num * 100)
      } else {
        return 0
      }
    },
    downloadData() {
      if (!this.list.length) return []
      const header = [
        { label: `${_.get(this.card, `${this.active}.label`)}处置情况报告`, minWidth: '320', prop: 'label' },
        { label: '数量', minWidth: '220', prop: 'num' },
        { label: '备注', minWidth: '220', prop: 'desc' },
      ]
      const data = []
      this.list.forEach(item => {
        item.child.forEach(i => {
          data.push({ label: i.label, num: this.cardData[i.id] })
        })
      })
      const total = this.add(data)
      data.push({ label: '总计', num: total })
      return [{ header, data }]
    }
  },
  async created() {
    this.Excel = await import(/* webpackChunkName: "exceljs" */'exceljs')
  },
  mounted() {
    getSummaryTotal().then(res => {
      this.total = res.data
    })
  },
  watch: {
    active: {
      handler(val) {
        const date = new Date()
        switch (val) {
          case '0':
            this.startTime = dayjs().startOf('day').toDate().getTime()
            this.api = getDomesticDaily
            this.type = '1'
            break
          case '1':
            this.startTime = this.options[this.options.length - 1].value
            this.api = getDomesticWeekly
              this.type = '2'
            break
          case '2':
            date.setDate(1)
            date.setHours(0, 0, 0, 0)
            this.startTime = date.getTime()
            this.api = getDomesticMonthly
              this.type = '3'
            break
          case '3':
            date.setDate(1)
            date.setHours(0, 0, 0, 0)
            this.startTime = date.getTime()
            this.api = getMedicMonthly
              this.type = '4'
            break
          case '4':
            date.setDate(1)
            date.setHours(0, 0, 0, 0)
            this.startTime = date.getTime()
            this.api = getBarrelMonthly
              this.type = '5'
            break
        }
        this.getData()
      },
      immediate: true,
    },
  },
  methods: {
    visibleChange(row) {
      if (this.otherType === '1') {
        this.visible_two = true
        getReportDetail({ reportId: row.reportId, type: this.type }).then(res => {
          this.orgDetail = res.data
            this.orgDetail.submitTime = dayjs(res.data.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })
      }
    },
    add(arr) {
      let s = 0;
      for (let i = arr.length - 1; i >= 0; i--) {
        s += arr[i].num;
      }
      return s;
    },
    handleCurrentChange(val) {
      this.offset = val
      this.tableData = this.allData.slice((val - 1) * 10, (val - 1) * 10 + 10)
    },
    getSubmittedOrg(type) {
        this.title = type === '1' ? '已提交机构' : '未提交机构'
        this.otherType = type
        const params = {type:this.type,time:this.startTime};
        if(this.level) params.level = this.level
        this.tableLoading = true
        this.visible_one = true
        getReportSubmitted(params).then(res => {
          this.allData = type === '1' ? res.data.submittedOrg : res.data.unSubmittedOrg
          this.tableData = this.allData.slice(0, 10)
          this.tableLoading = false
        })
    },
    async download() {
      // demo 数据格式
      // const header = [
      //   { label: '姓名', width: '120', prop: 'name' },
      //   { label: '年龄', width: '120', prop: 'age' },
      //   { label: '电话', width: '120', prop: 'tel' },
      //   { label: '身高', width: '120', prop: 'high' },
      // ]
      // const data = [
      //   { name: 'lxx', age: 18, tel: '15093408313', high: 178 },
      //   { name: 'lxx', age: 18, tel: '15093408313', high: 178 },
      //   { name: 'lxx', age: 18, tel: '15093408313', high: 178 },
      //   { name: 'lxx', age: 18, tel: '15093408313', high: 178 },
      // ]
      await this.makeExcel(this.downloadData, _.get(this.card, `${this.active}.label`))
      this.$message.success('下载成功！')
    },
    async makeExcel(downloadData, name) {
      const wb = new this.Excel.Workbook()
      this.$lo.each(downloadData, sheet => {
        const ws = wb.addWorksheet(sheet.name)
        const table = new ExcelTable(this.$lo.cloneDeep(sheet.header), sheet.data, sheet.title || name, ws, sheet.desc)
        table.setToExcel()
      })


      const buffer = await wb.xlsx.writeBuffer()

      saveAs(new Blob([buffer], {type: "application/octet-stream"}), `${name}.xlsx`)
    },
    getData() {
      this.loading = true
      const params = { startTime: this.startTime, level: this.level }
      this.api(params).then(res => {
        this.cardData = res.data
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    },
  },
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

        .text {
          width: 170px;
        }

        .el-progress {
          width: calc(100% - 170px);
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
