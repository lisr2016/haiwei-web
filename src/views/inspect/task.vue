<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="dialogFormVisible = true">新增考核任务</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" width="60px" fixed>
        <template slot-scope="scope">
          {{ (params.offset - 1) * params.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="考核名称" align="center" fixed>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="考核类型" align="center" fixed>
        <template slot-scope="scope">
          {{ scope.row.type === '1' ? '自审' : '互审' }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核目标" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核内容" min-width="200px" align="center">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.content" :key="index" @click="getDetail(scope.row, index)" :class="scope.row.assessorDone || scope.row.assesseeDone ? 'active' : ''">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column label="考核单位1" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.assessorOrgName }}{{ scope.row.assessorDone ? '(已提交)' : '(未提交)' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核单位2" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.assesseeOrgName }}{{ scope.row.type === '1'?'':scope.row.assesseeDone ? '(已提交)' : '(未提交)' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作" align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" style="color: red" @click="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px;padding-left: 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.offset"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    <!--  新增  -->
    <el-dialog title="新增考核" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="考核类型" label-width="120px">
          <el-radio-group v-model="form.type">
            <el-radio label="1">自审</el-radio>
            <el-radio label="2">互审</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考核名称" label-width="120px" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请填写考核名称" />
        </el-form-item>
        <el-form-item label="考核时间" label-width="120px" prop="time">
          <el-date-picker
            style="width: 100%;"
            v-model="form.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考核目标" label-width="120px" prop="target">
          <el-input v-model="form.target" autocomplete="off" placeholder="请填写考核目标" />
        </el-form-item>
<!--        <el-form-item label="考核模版" label-width="120px" prop="templateId">-->
<!--          <el-select v-model="form.templateId" style="width: 100%;" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in templateList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="考核单位" label-width="120px" prop="assessorId">
          <el-select v-model="form.assessorId" style="width: 100%;" filterable remote reserve-keyword placeholder="请输入关键词搜索机构" :loading="loading" :remote-method="remoteMethod">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === '2'" label="考核对象" label-width="120px" prop="assesseeId">
          <el-select v-model="form.assesseeId" filterable remote reserve-keyword placeholder="请输入关键词搜索机构" :loading="loading" :remote-method="remoteMethod">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="考核项详情" :visible.sync="contentDetailVisible">
      <div v-if="contentDetail && contentDetail.assesseeContent && contentDetail.assesseeContent.length" class="assessee">
        <div class="cell">
          <div class="label">考核单位：</div>
          <div class="value">{{ contentDetail.assesseeOrgName }}</div>
        </div>
        <div v-for="(item, index) in contentDetail.assesseeContent" :key="index">
          <div class="cell">
            <div class="label">考核项：</div>
            <div class="value">{{ contentDetail.content[index] }}</div>
          </div>
          <div class="cell">
            <div class="label">评语：</div>
            <div class="value">{{ item.description }}</div>
          </div>
          <div class="cell">
            <div class="label">图片：</div>
            <el-image v-for="(i, k) in item.urls" :src="i" :key="k" class="image" :preview-src-list="srcList" />
          </div>
        </div>
      </div>
      <div v-if="contentDetail && contentDetail.assessorContent && contentDetail.assessorContent.length" class="assessor">
        <div class="cell">
          <div class="label">考核单位：</div>
          <div class="value">{{ contentDetail.assessorOrgName }}</div>
        </div>
        <div v-for="(item, index) in contentDetail.assessorContent" :key="index">
          <div class="cell">
            <div class="label">考核项：</div>
            <div class="value">{{ contentDetail.content[index] }}</div>
          </div>
          <div class="cell">
            <div class="label">评语：</div>
            <div class="value">{{ item.description }}</div>
          </div>
          <div class="cell">
            <div class="label">图片：</div>
            <el-image v-for="(i, k) in item.urls" :src="i" :key="k" class="image" :preview-src-list="srcList" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTask, deleteTask, getOrgList, getTaskList, getTemplateList } from '@/api/table'

export default {
  data() {
    return {
      rules: {
        target: [{ required: true, message: '考核目标不能为空' }],
        name: [{ required: true, message: '考核名称不能为空' }],
        assessorId: [{ required: true, message: '考核单位不能为空' }],
        assesseeId: [{ required: true, message: '考核对象不能为空' }],
        time: [{ required: true, message: '请选择考核开始/结束日期', trigger: 'change' }],
      },
      selectList: [],
      total: 0,
      params: { offset: 1, limit: 10 },
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      editVisible: false,
      loading: false,
      form: {
        type: '1',
        name: '',
        startTime: '',
        endTime: '',
        target: '',
        assessorId: '',
        assesseeId: '',
        time: '',
      },
      contentDetailVisible: false,
      contentDetail: null,
      srcList: [],
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    dialogFormVisible: {
      handler(val) {
        if (!val) {
          this.$refs.form.resetFields()
        }
      },
    },
    'form.time': {
      handler(val) {
        if (val && val.length) {
          this.form.startTime = val[0]
          this.form.endTime = val[1]
        }
      },
    },
  },

  methods: {
    deleteRow(id) {
      deleteTask({ taskId: id }).then(() => {
        this.$message({ message: '删除成功', type: 'success' })
        this.fetchData()
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        getOrgList({ search: query }).then(res => {
          this.loading = false
          this.selectList = res.data.list.map(item => ({ value: item.organizationId, label: item.name }))
        })
      } else {
        this.selectList = []
      }
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const params = _.omit(this.form, this.form.type === '1' ? ['time', 'assesseeId'] : 'time')
          await addTask(params)
          this.$message({ message: '添加成功', type: 'success' })
          this.fetchData()
          Object.keys(this.form).forEach(key => {
            this.form[key] = key === 'type' ? '1' : ''
          })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    getDetail(row, index) {
      this.srcList = []
      const { assesseeDone, assessorDone, assessorContent, assesseeContent } = row
      if (assessorDone || assesseeDone) {
        this.contentDetailVisible = true
        this.contentDetail = row
        console.log(this.contentDetail)
        if (assessorContent) {
          assessorContent.forEach(item => {
            item.urls.forEach(i => {
              this.srcList.push(i)
            })

          })
        }
        if (assesseeContent) {
          assesseeContent.forEach(item => {
            item.urls.forEach(i => {
              this.srcList.push(i)
            })

          })
        }

      } else {
        return false
      }
    },
    handleSizeChange(val) {
      this.params.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.params.offset = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = false
      getTaskList(this.params).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.listLoading = false
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  .cell {
    width: 100%;
    display: flex;
    justify-content: start;
    min-height: 50px;
    line-height: 50px;

    .label {
      color: #333333;
      font-weight: 500;
      min-width: 80px;
      text-align: right;
      margin-right: 10px;
    }

    .image {
      width: 80px;
      height: 80px;
    }
  }

  .active {
    color: #409EFF;
    cursor: pointer
  }

  .search-box {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;

    .right {
      display: flex;

      .el-input {
        width: 300px;
        margin-right: 10px;
      }
    }

  }
</style>
