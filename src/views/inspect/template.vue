<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="add('1')">新增机构</el-button>
      <div class="right">
        <el-input placeholder="搜索机构名称" v-model="params.search" />
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
          {{ (params.offset - 1) * params.limit + scope.$index  + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="机构名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.corporationPhone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="负责人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.managerPhone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="床位数" align="center">
        <template slot-scope="scope">
          {{ scope.row.bednum }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="级别">
        <template slot-scope="scope">
          {{ levelValues[scope.row.level] }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="街道">
        <template slot-scope="scope">
          {{ scope.row.street }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="状态">
        <template slot-scope="scope">
          {{ scope.row.isDeleted?`已注销`:`正常` }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="add('2', scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDeleteOrg(scope.row)">{{ scope.row.isDeleted?`恢复`:`注销`}}</el-button>
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

    <el-dialog title="新增机构" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="机构名称" label-width="120px" prop="name">
          <el-input v-model="form.name" :disabled="isEdit" autocomplete="off" placeholder="请输入用户机构名称" />
        </el-form-item>
        <el-form-item label="法人电话:" label-width="120px">
          <el-input v-model="form.corporationPhone" autocomplete="off" placeholder="请输入用户法人电话" />
        </el-form-item>
        <el-form-item label="负责人电话:" label-width="120px" prop="managerPhone">
          <el-input v-model="form.managerPhone" autocomplete="off" placeholder="请输入负责人电话" />
        </el-form-item>
        <el-form-item label="床位数:" label-width="120px">
          <el-input v-model="form.bednum" autocomplete="off" type="number" placeholder="请输入床位数" />
        </el-form-item>
        <el-form-item label="地址:" label-width="120px" prop="address">
          <el-input v-model="form.address" autocomplete="off" placeholder="请输入用户地址" />
        </el-form-item>
        <el-form-item label="级别:" label-width="120px" prop="level">
          <el-select v-model="form.level" placeholder="请选择用户级别">
            <el-option v-for="(item, index) in levelValues" :label="item" :value="String(template)" :key="template" />
          </el-select>
        </el-form-item>
        <el-form-item label="街道:" label-width="120px" prop="street">
          <el-select v-model="form.street" placeholder="请选择用户街道">
            <el-option v-for="(item, index) in street" :label="item" :value="item" :key="template" />
          </el-select>
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
    import { addOrg, deleteOrg, getOrgList, updateOrg } from '@/api/table'

    const levelValues = ['三级医院', '二级医院', '一级医院', '门诊部', '诊所', '未定级', '医务室', '卫生室', '社区卫生服务中心', '社区卫生服务站']
    const street = ['万寿路街道', '永定路街道', '羊坊店街道', '甘家口街道', '八里庄街道', '紫竹院街道', '北下关街道', '北太平庄街道', '学院路街道', '中关村街道', '海淀街道', '青龙桥街道', '清华园街道', '燕园街道', '香山街道', '清河街道', '花园路街道', '西三旗街道', '马连洼街道', '田村路街道', '上地街道', '万柳地区', '东升地区', '曙光街道', '温泉地区', '四季青地区', '西北旺地区', '苏家坨地区', '上庄地区']
    export default {
        data() {
            const checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('联系方式不能为空'))
                } else {
                    const reg = /^1[3|4|5|7|8|9|6][0-9]\d{8}$/
                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的联系方式'))
                    }
                }
            };
            return {
                rules: {
                    name: [{ required: true, message: '机构名称不能为空' }],
                    managerPhone: [{ required: true, trigger: 'blur', validator: checkPhone }],
                    street: [{ required: true, message: '请选择街道', trigger: 'change' }],
                    level: [{ required: true, message: '请选择级别', trigger: 'change' }],
                    address: [{ required: true, message: '请填写地址' }],
                },
                total: 0,
                params: { offset: 1, limit: 10, search: '', },
                levelValues,
                street,
                list: [],
                listLoading: true,
                dialogFormVisible: false,
                organizationId: '',
                isEdit: false,
                form: {
                    bednum: '',
                    name: '',
                    managerPhone: '',
                    corporationPhone: '',
                    address: '',
                    level: '',
                    street: '',
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
                    }
                },
            }
        },

        methods: {
            add(type, row) {
                this.isEdit = type === '2'
                this.organizationId = type === '2' ? row.organizationId : ''
                if (type === '2') {
                    Object.keys(this.form).forEach(key => this.form[key] = row[key])
                }
                this.dialogFormVisible = true
            },
            async handleDeleteOrg(row) {
                this.currentData = Object.assign({}, row, { levelText: this.levelValues[row.level] })
                const params = {
                    isDelete: !row.isDeleted,
                    organizationId: this.currentData.organizationId,
                };
                await deleteOrg(params);
                this.$message({ message: `${row.isDeleted ? `恢复成功` : `注销成功`}`, type: 'info' })
                this.fetchData()
                this.editVisible = false
            },
            submit() {
                const api = this.isEdit ? updateOrg : addOrg
                const params = this.isEdit ? Object.assign({}, this.form, { organizationId: this.organizationId }) : this.form;
                delete params.name;
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        await api(params);
                        this.$message({ message: this.isEdit ? '编辑机构成功' : '新增机构成功', type: 'success' })
                        this.fetchData();
                        this.dialogFormVisible = false
                    } else {
                        return false
                    }
                })
            },
            fetchData() {
                this.listLoading = false
                getOrgList(this.params).then(response => {
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
