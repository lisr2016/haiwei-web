<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="add('1')">新增通知</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" width="60px">
        <template slot-scope="scope">
          {{ (params.offset - 1) * params.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="scope">
          {{ scope.row.publisher }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ formatUTC(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="状态">
        <template slot-scope="scope">
          {{ scope.row.isDeleted ? '取消发布' : '已发布' }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add('2', scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleCancelNotification(scope.row)">{{ scope.row.isDeleted ? '消息发布': '取消发布'}}</el-button>
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

    <el-dialog title="新增消息" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input v-model="form.title" autocomplete="off" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" label-width="120px" prop="content">
          <el-input v-model="form.content" type="textarea" rows="5" autocomplete="off" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="是否发布" label-width="120px">
          <el-switch v-model="form.isDeleted" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addNotification, cancelNotification, getNotificationList, updateNotification } from '@/api/table'

export default {
  data() {
    return {
      rules: {
        title: [{ required: true, message: '标题不能为空' }],
        content: [{ required: true, message: '内容不能为空' }],
      },
      total: 0,
      params: {
        offset: 1,
        limit: 10,
        search: '',
      },
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      isEdit: false,
      messageId: '',
      form: {
        title: '',
        content: '',
        isDeleted: true,
      },
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
          this.form = {
            title: '',
            content: '',
            isDeleted: true,
          }
        }
      },
    },
  },

  methods: {
    formatUTC(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var T_pos = utc_datetime.indexOf('T')
      var Z_pos = utc_datetime.indexOf('Z')
      var year_month_day = utc_datetime.substr(0, T_pos)
      var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1)
      var new_datetime = year_month_day + ' ' + hour_minute_second // 2017-03-31 08:02:06

      // 处理成为时间戳
      timestamp = new Date(Date.parse(new_datetime))
      timestamp = timestamp.getTime()
      timestamp = timestamp / 1000

      // 增加8个小时，北京时间比utc时间多八个时区
      var timestamp = timestamp + 8 * 60 * 60

      // 时间戳转为时间
      return new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ')
    },
    async handleCancelNotification(row) {
      const params = {
        isDelete: !row.isDeleted,
        notificationId: row.notificationId,
      }
      await cancelNotification(params)
      this.$message({ message: `${row.isDeleted ? '发布成功' : '取消发布成功'}`, type: 'info' })
      this.fetchData()
      this.editVisible = false
    },
    add(type, row) {
      this.isEdit = type === '2'
      this.messageId = type === '2' ? row.notificationId : ''
      if (type === '2') {
        Object.keys(this.form).forEach(key => this.form[key] = row[key])
      }
      this.dialogFormVisible = true
    },
    submit() {
      const api = this.isEdit ? updateNotification : addNotification
      const params = this.isEdit ? Object.assign({}, _.pick(this.form, ['content', 'title']), { notificationId: this.messageId }) : Object.assign({}, this.form, { isDeleted: !this.form.isDeleted })
      console.log(params)
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await api(params)
          this.$message({ message: this.isEdit ? '新增通知成功' : '编辑通知成功', type: 'success' })
          this.fetchData()
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    fetchData() {
      this.listLoading = false
      getNotificationList(this.params).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.params.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.params.offset = val
      this.fetchData()
    },
  },
}
</script>
<style lang="scss" scoped>
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

    .el-button {
      width: 100px;
    }

  }
</style>
