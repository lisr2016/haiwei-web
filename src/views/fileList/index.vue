<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="add('1')">发布文件</el-button>
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
          {{ (params.offset - 1) * params.limit + scope.$index  + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="政策内容" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center" width="300px">
        <template slot-scope="scope">
          <template v-if="scope.row.levels.length" >
            <span v-if="scope.row.levels.length === levels.length">所有机构</span>
            <template v-else>
              <span v-for="(item,index) in scope.row.levels" :key="item">{{ levels[Number(item)] }}{{ index === scope.row.levels.length - 1 ? '' : ',' }}</span>
            </template>
          </template>
          <span v-else>所有机构</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add('2', scope.row)">编辑</el-button>
<!--          <el-button type="text" size="small" @click="handleDeleteOrg(scope.row)">{{ scope.row.isDeleted?`恢复`:`注销`}}</el-button>-->
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

    <el-dialog :title="isEdit ? '编辑发布' : '发布文件'" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input v-model="form.title" autocomplete="off" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="政策内容:" label-width="120px" prop="content">
          <el-input v-model="form.content" type="textarea" autocomplete="off" placeholder="请输入政策内容" />
        </el-form-item>
        <el-form-item label="级别:" label-width="120px">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部</el-checkbox>
          <el-checkbox-group v-model="form.levels" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(item, index) in levels" :label="String(index)" :key="index">{{ item }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="上传文件:" label-width="120px" prop="url">
          <el-upload
            class="upload-demo"
            ref="upload"
            :data="uploadParams"
            action="https://chiateocean.com.cn/hdhq/cms/upload/file"
            :headers="{ token }"
            :before-upload="beforeAvatarUpload"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            accept=".xlsx,.pdf,.xls,.docx,.PDF,.doc">
            <el-button size="small" type="primary">{{ isEdit ? '重新上传': '点击上传' }}</el-button>
          </el-upload>
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
import { addPolicyList, updatePolicyList, getPolicyList } from '@/api/table'
import { getToken } from '@/utils/auth'
const levels = ['三级医院', '二级医院', '一级医院', '门诊部', '诊所', '未定级', '医务室', '卫生室', '社区卫生服务中心', '社区卫生服务站']

export default {
  data() {
    return {
      levels,
      checkAll: true,
      rules: {
        title: [{ required: true, message: '标题不能为空' }],
        content: [{ required: true, message: '政策内容不能为空' }],
        url: [{ required: true, message: '请上传政策文件' }],
      },
      isIndeterminate: true,
      total: 0,
      params: { offset: 1, limit: 10, },
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      id: '',
      isEdit: false,
      token: getToken(),
      form: {
        url: '',
        title: '',
        content: '',
        filename: '',
        levels: levels.map((item, index) => String(index)),
      },
      uploadParams: { filename: '' }
    }
  },
  mounted() {
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
    handleCheckAllChange(val) {
      this.form.levels = val ? levels.map((item, index) => String(index)) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === levels.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < levels.length;
    },
    beforeAvatarUpload(file) {
      this.uploadParams.filename = file.name
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`).then(() => {
        this.form.filename = ''
      });
    },
    add(type, row) {
      this.isEdit = type === '2'
      this.id = type === '2' ? row.id : ''
      if (type === '2') {
        Object.keys(this.form).forEach(key => this.form[key] = row[key])
      }
      this.dialogFormVisible = true
    },

    submit() {
      const api = this.isEdit ? updatePolicyList : addPolicyList
      if (!this.form.filename) {
        this.$message({ message: '请上传文件', type: 'error' })
        return
      }
      const params = this.isEdit ? Object.assign({}, this.form, { policyId: this.id }) : this.form;
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await api(params);
          this.$message({ message: this.isEdit ? '编辑成功' : '新增成功', type: 'success' })
          this.fetchData();
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    handleSuccess(res, file) {
      this.form.url = res.data
      this.form.filename = file.name
    },
    fetchData() {
      this.listLoading = false
      getPolicyList(this.params).then(response => {
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
