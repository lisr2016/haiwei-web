<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="openDialog('1')">新增模板</el-button>
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
      <el-table-column label="模板名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="考核内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content.join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作" align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog('2', scope.row)">修改模板</el-button>
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
    <el-dialog title="新增模板" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="模板名称" label-width="120px" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item v-for="item in num" :key="item" label="考核内容" label-width="120px">
          <div style="display: flex; align-items: center">
            <el-input v-model="contentForm[`num_${item}`]" autocomplete="off" placeholder="请输入考核内容，点击后方加号可添加多条考核内容" />
            <i class="el-icon-plus" style="margin-left: 10px" @click="num++" />
          </div>
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
import { addTemplate, getTemplateList, updateTemplate } from '@/api/table'

export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '模板名称不能为空' }],
        content: [{ required: true, message: '考核内容不能为空' }],
      },
      selectList: [],
      total: 0,
      params: {
        offset: 1,
        limit: 10,
      },
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      loading: false,
      currentData: {},
      form: {
        name: '',
        content: [],
      },
      contentForm: {},
      num: 1,
      id: '',
      isEdit: false,
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
    }
  },

  methods: {
    openDialog(type, row) {
      this.isEdit = type === '2'
      this.form.name = this.isEdit ? row.name : ''
      this.num = this.isEdit ? row.content.length : 1
      if (type === '2') {
        row.content.forEach((item, index) => {
          this.$set(this.contentForm, `num_${index + 1}`, item)
        })
        this.id = row.id
      } else {
        this.contentForm = {}
      }
      this.dialogFormVisible = true
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        getTemplateList({ search: query }).then(res => {
          this.loading = false
          this.selectList = res.data.list.map(item => ({ value: item.organizationId, label: item.name }))
        })
      } else {
        this.selectList = []
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
    submit() {
      const api = this.isEdit ? updateTemplate : addTemplate
      this.form.content = Object.values(this.contentForm)
      if (!this.form.content.length) return this.$message({ message: '请填写模版内容', type: 'error' })
      const params = this.isEdit ? _.assign({}, this.form, { templateId: this.id }) : this.form
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await api(params)
          this.$message({ message: `${this.isEdit ? '编辑' : '新增'}模版成功`, type: 'success' })
          this.fetchData()
          this.dialogFormVisible = false
          this.num = 1

          this.contentForm = {}
        } else {
          return false
        }
      })
    },
    fetchData() {
      this.listLoading = false
      getTemplateList(this.params).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.listLoading = false
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  .el-table {
    ::v-deep .cell {
      white-space: pre-line;
    }
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

    .el-button {
      width: 100px;
    }

  }
</style>
