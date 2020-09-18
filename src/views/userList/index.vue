<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="dialogFormVisible = true">新增</el-button>
      <div class="right">
        <el-input placeholder="请输入搜索内容" v-model="params.search" />
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
      <el-table-column align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="机构名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orgInfo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.corporationPhone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.address }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="负责人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.managerPhone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="床位数" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.bednum }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="级别">
        <template slot-scope="scope">
          {{ levelValues[scope.row.orgInfo.level] }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="街道">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.street }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <!--          <el-button type="text" size="small" @click="handleClick(scope.row)">删除</el-button>-->
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
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
        <el-form-item label="机构名称" label-width="120px" prop="organizationName">
          <el-input v-model="addForm.organizationName" autocomplete="off" placeholder="请输入用户机构名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!--  编辑  -->
    <el-dialog title="编辑" :visible.sync="editVisible">
      <el-form :model="currentData" ref="editForm" :rules="rules">
        <el-form-item label="机构名称:" label-width="120px">
          <span style="font-size: 14px">{{ currentData.name }}</span>
        </el-form-item>
        <el-form-item label="法人电话:" label-width="120px" prop="corporationPhone">
          <el-input v-model="currentData.corporationPhone" autocomplete="off" placeholder="请输入用户法人电话" />
        </el-form-item>
        <el-form-item label="负责人电话:" label-width="120px">
          <el-input v-model="currentData.managerPhone" type="number" autocomplete="off" placeholder="请输入负责人电话" />
        </el-form-item>
        <el-form-item label="床位数:" label-width="120px">
          <el-input v-model="currentData.bednum" autocomplete="off" type="number" placeholder="请输入床位数" />
        </el-form-item>
        <el-form-item label="地址:" label-width="120px" prop="address">
          <el-input v-model="currentData.address" autocomplete="off" placeholder="请输入用户地址" />
        </el-form-item>
        <el-form-item label="级别:" label-width="120px" prop="levelText">
          <el-select v-model="currentData.levelText" placeholder="请选择用户级别">
            <el-option v-for="(item, index) in levelValues" :label="item" :value="item" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="街道:" label-width="120px" prop="street">
          <el-select v-model="currentData.street" placeholder="请选择用户街道">
            <el-option v-for="(item, index) in street" :label="item" :value="item" :key="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, getList, updateUser } from '@/api/table'

const levelValues = ['三级医院', '二级医院', '一级医院', '门诊部', '诊所', '未定级', '医务室', '卫生室', '社区卫生服务中心', '社区卫生服务站']
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
        corporationPhone: [{ required: true, trigger: 'blur', validator: checkPhone }],
        organizationName: [{ required: true, message: '机构名称不能为空' }],
        password: [{ required: true, message: '登录密码不能为空' }],

        street: [{ required: true, message: '请选择街道', trigger: 'change' }],
        levelText: [{ required: true, message: '请选择级别', trigger: 'change' }],
        address: [{ required: true, message: '请填写地址' }],
      },
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
      editVisible: false,
      currentData: {},
      addForm: {
        phone: '',
        organizationName: '',
        password: '',
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
          this.$refs.addForm.resetFields()
        }
      },
    },
    editVisible: {
      handler(val) {
        if (!val) {
          this.$refs.editForm.resetFields()
        }
      },
    },
  },

  methods: {
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
    edit(row) {
      this.editVisible = true
      this.currentData = Object.assign({}, row.orgInfo, { levelText: this.levelValues[row.orgInfo.level] })
    },
    editSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          const params = Object.assign(
            {},
            this.$lo.pick(this.currentData, ['address', 'bednum', 'managerPhone', 'organizationId', 'street', 'corporationPhone']),
            { level: String(this.levelValues.findIndex(item => item === this.currentData.levelText)) },
          )
          await updateUser(params)
          this.$message({ message: '编辑成功', type: 'success' })
          this.fetchData()
          this.editVisible = false
        } else {
          return false
        }
      })
    },
    fetchData() {
      this.listLoading = false
      getList(this.params).then(response => {
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
