<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="dialogFormVisible = true">新增用户</el-button>
      <div class="right">
        <el-input placeholder="搜索用户手机号或者所属机构名称" @keyup.enter.native="fetchData" v-model="params.search" />
        <el-button @click="fetchData">查找</el-button>
      </div>
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
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="所属机构" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orgInfo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完成基础信息填报" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.initialized?`已完成`:`未完成` }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="changePassword(scope.row)">修改密码</el-button>
          <el-button type="text" size="small" @click="editOrg(scope.row)">修改机构</el-button>
<!--          <el-button v-if="!scope.row.isDeleted" type="text" size="small" @click="deleteRow(scope.row.id, true)">注销</el-button>-->
<!--          <el-button v-else type="text" size="small" @click="deleteRow(scope.row.id, false)">恢复</el-button>-->
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
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="用户手机" label-width="120px" prop="phone">
          <el-input v-model="addForm.phone" autocomplete="off" placeholder="请输入用户登录手机号" />
        </el-form-item>
        <el-form-item label="用户密码" label-width="120px" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" placeholder="请输入用户登录密码" />
        </el-form-item>
        <el-form-item label="所属机构名称" label-width="120px" prop="organizationId">
          <el-select v-model="addForm.organizationId" filterable remote reserve-keyword placeholder="请输入关键词搜索机构" :loading="loading" :remote-method="remoteMethod">
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
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更改密码" :visible.sync="dialogFormVisible1">
      <el-form :model="form" ref="form" :rules="editRules">
        <el-form-item label="用户密码" label-width="120px" prop="password">
          <el-input v-model="form.password" autocomplete="off" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px" prop="psw">
          <el-input v-model="form.psw" autocomplete="off" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改机构" :visible.sync="editVisible">
      <el-form :model="editForm" ref="editForm" :rules="editRules">
        <el-form-item label="所属机构名称" label-width="120px" prop="organizationId">
          <el-select v-model="editForm.organizationId" filterable remote reserve-keyword placeholder="请输入关键词搜索机构" :loading="loading" :remote-method="remoteMethod">
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
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="upload">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addUser, deleteUser, getOrgList, getUserList, updateUserOrg, updateUserPassword } from '@/api/table'

const levelValues = ['三级医院', '二级医院', '一级医院', '门诊部', '诊所', '未定级', '医务室', '卫生室', '社区卫生服务中心（区属）',  '社区卫生服务中心（非区属）','社区卫生服务站']
const street = ['万寿路街道', '永定路街道', '羊坊店街道', '甘家口街道', '八里庄街道', '紫竹院街道', '北下关街道', '北太平庄街道', '学院路街道', '中关村街道', '海淀街道', '青龙桥街道', '清华园街道', '燕园街道', '香山街道', '清河街道', '花园路街道', '西三旗街道', '马连洼街道', '田村路街道', '上地街道', '万柳地区', '东升地区', '曙光街道', '温泉地区', '四季青地区', '西北旺地区', '苏家坨地区', '上庄地区']
export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8|9|6][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      rules: {
        phone: [{ required: true, trigger: 'blur', validator: checkPhone }],
        organizationId: [{ required: true, message: '机构名称不能为空' }],
        password: [{ required: true, message: '密码不能为空' }],
      },
      editRules: {
        password: [{ required: true, message: '密码不能为空' }],
        psw: [{ required: true, message: '密码不能为空' }],
        organizationId: [{ required: true, message: '机构名称不能为空' }],
      },
      selectList: [],
      total: 0,
      params: {
        offset: 1,
        limit: 10,
        search: '',
      },
      levelValues,
      levelText: '',
      street,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      editVisible: false,
      loading: false,
      userId: '',
      password: '',
      currentData: {},
      addForm: {
        phone: '',
        organizationId: '',
        password: '',
      },
      form: { password: '', psw: '' },
      editForm: { userId: '', organizationId: '' },
      organizationName: '',
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    dialogFormVisible: {
      handler(val) {
        if (!val) {
          this.$refs.addForm.resetFields()
        }
      },
    },
  },

  methods: {
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
    changePassword(e) {
      this.dialogFormVisible1 = true
      this.userId = e.id
    },
    editOrg(row) {
      const { orgInfo, id } = row
      this.editVisible = true
      this.editForm.userId = id
      this.organizationName = orgInfo.name
      this.editForm.organizationId = orgInfo.name
    },
    upload() {
      if (this.organizationName !== this.editForm.organizationId) {
        updateUserOrg(this.editForm).then(() => {
          this.$message({ message: '修改机构成功', type: 'success' })
          this.fetchData()
        })
      }
      this.editVisible = false
    },
    deleteRow(userId, isDelete) {
      deleteUser({ userId, isDelete }).then(() => {
        this.$message({ message: `${isDelete ? '注销' : '恢复'}成功`, type: 'success' })
        this.fetchData()
      })
    },
    submit() {
      if (this.form.password !== this.form.psw) {
        this.$message({ message: '两次密码不一致，请确认', type: 'error' })
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await updateUserPassword({ userId: this.userId, password: this.form.password })
          this.$message({ message: '修改密码成功', type: 'success' })
          this.fetchData()
          this.editVisible = false
        } else {
          return false
        }
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
    add() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          await addUser(this.addForm)
          this.$message({ message: '新增用户成功', type: 'success' })
          this.fetchData()
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    fetchData() {
      this.listLoading = false
      getUserList(this.params).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        this.listLoading = false
      })
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
