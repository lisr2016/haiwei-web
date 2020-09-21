<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="dialogFormVisible = true">新增通知</el-button>
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
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="状态">
        <template slot-scope="scope">
          {{ scope.row.isDeleted?`取消发布`:`已发布` }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleCancelNotification(scope.row)">`{{ scope.row.isDeleted?`消息发布`:`取消发布`}}</el-button>
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
    <el-dialog title="新增消息" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="标题" label-width="120px" prop="phone">
          <el-input v-model="addForm.title" autocomplete="off" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" label-width="120px" prop="password">
          <el-input v-model="addForm.content" autocomplete="off" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!--  编辑  -->
    <el-dialog title="编辑消息" :visible.sync="editVisible">
      <el-form :model="currentData" ref="editForm" :rules="rules">
        <el-form-item label="标题:" label-width="120px" prop="corporationPhone">
          <el-input v-model="currentData.title" autocomplete="off" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容:" label-width="120px">
          <el-input v-model="currentData.content" type="number" autocomplete="off" placeholder="请输入内容" />
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
import { addNotification, getNotificationList, updateNotification, cancelNotification } from '@/api/table'

export default {
  data() {
    return {
      rules: {
        title: [{ required: true, message: '标题' }],
        content: [{ required: true, message: '内容' }],
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
      editVisible: false,
      currentData: {},
      addForm: {
        title: '',
        content: '',
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
    formatJson(filterVal, data) {
      return data.map(v => filterVal.map(j => v[j] ? v[j] : v.orgInfo[j]))
    },
    handleSizeChange(val) {
      this.params.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.params.offset = val
      this.fetchData()
    },
    async handleCancelNotification (row) {
        const params = {
            isDelete: !row.isDeleted,
            notificationId: row.notificationId
        };
        await cancelNotification(params);
        this.$message({message: `${row.isDeleted ? `发布成功` : `取消发布成功`}`, type: 'info'});
        this.fetchData();
        this.editVisible = false
    },
    add() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          await addNotification(this.addForm)
          this.$message({ message: '新增通知成功', type: 'success' })
          this.fetchData()
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    edit(row) {
      this.editVisible = true
    },
    editSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          const params = Object.assign(
            {},
          )
          await updateNotification(params)
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
        getNotificationList(this.params).then(response => {
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
