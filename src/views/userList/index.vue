<template>
  <div class="app-container">
    <div class="search-box">
      <el-button>新增</el-button>
      <div class="right">
        <el-input placeholder="请输入搜索内容" />
        <el-button>查找</el-button>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="机构名称" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orgInfo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法人电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.managerPhone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="地址" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.address }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="级别" width="200">
        <template slot-scope="scope">
          {{ levelValues[scope.row.orgInfo.level] }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="街道" width="200">
        <template slot-scope="scope">
          {{ scope.row.orgInfo.street }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

const levelValues = ['三级医院', '二级医院', '一级医院', '门诊部', '诊所', '未定级', '医务室', '卫生室', '社区卫生服务中心', '社区卫生服务站']
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      levelValues,
      list: [
        { phone: '15093408313', orgInfo: { name: '第三人民医院', managerPhone: '15093408313', level: '2', street: '高新区街道', address: '铭功路122号' } },
        { phone: '15093408313', orgInfo: { name: '第三人民医院', managerPhone: '15093408313', level: '2', street: '高新区街道', address: '铭功路122号' } },
        { phone: '15093408313', orgInfo: { name: '第三人民医院', managerPhone: '15093408313', level: '2', street: '高新区街道', address: '铭功路122号' } },
        { phone: '15093408313', orgInfo: { name: '第三人民医院', managerPhone: '15093408313', level: '2', street: '高新区街道', address: '铭功路122号' } },
        { phone: '15093408313', orgInfo: { name: '第三人民医院', managerPhone: '15093408313', level: '2', street: '高新区街道', address: '铭功路122号' } },
        { phone: '15093408313', orgInfo: { name: '第三人民医院', managerPhone: '15093408313', level: '2', street: '高新区街道', address: '铭功路122号' } },
      ],
      listLoading: true,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = false
      const data = { offset: 1, limit: 50 }
      getList(data).then(response => {
        this.list = response.data.list
        this.listLoading = false
      })
    },
    handleClick(row) {
      console.log(row)
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
