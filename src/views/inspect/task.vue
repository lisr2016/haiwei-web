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
      <el-table-column align="center" width="60px">
        <template slot-scope="scope">
          {{ (params.offset - 1) * params.limit + scope.$index  + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="考核类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="模板名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.templateId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核目标" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核单位" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核对象" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作" align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">修改模板</el-button>
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
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="模板名称" label-width="120px" prop="phone">
          <el-input v-model="addForm.phone" autocomplete="off" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="考核内容" label-width="120px" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTask, getTask, deleteTask } from '@/api/table'

    export default {
        data() {
            return {
                rules: {
                    name: [{ required: true, message: '模板名称不能为空'}],
                    content: [{ required: true, message: '机构名称不能为空' }],
                },
                selectList: [],
                total: 0,
                params: {
                    offset: 1,
                    limit: 10,
                    search: '',
                },
                list: [],
                listLoading: true,
                dialogFormVisible: false,
                editVisible: false,
                loading: false,
                currentData: {},
                addForm: {
                    phone: '',
                    organizationId: '',
                    password: '',
                },
                form: { password: '' },
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
                        this.$refs.form.resetFields()
                    }
                },
            },
        },

        methods: {
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    getTask({ search: query }).then(res => {
                        this.loading = false;x
                        this.selectList = res.data.list.map(item => ({ value: item.organizationId, label: item.name }))
                    })
                } else {
                    this.selectList = [];
                }
            },
            edit(e){
                this.dialogFormVisible = true
                this.userId = e.id
            },
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        await ({ userId: this.userId, password: this.form.password })
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
                        await addTemplate(this.addForm)
                        this.$message({ message: '新增模板成功', type: 'success' })
                        this.fetchData()
                        this.dialogFormVisible = false
                    } else {
                        return false
                    }
                })
            },
            fetchData() {
                this.listLoading = false
                getTask(this.params).then(response => {
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
