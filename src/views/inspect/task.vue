<template>
  <div class="app-container">
    <div class="search-box">
      <el-button @click="dialogFormVisible = true">新增考核任务</el-button>
      <div class="right">
        <el-select
          v-model="params.organizationId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词搜索机构"
          :loading="loading"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in selectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          {{ scope.row.type === "1" ? "自审" : "互审" }}
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
      <el-table-column label="单位名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>
            {{ scope.row.assessorOrgName
            }}{{ scope.row.assessorDone ? "(已提交)" : "(未提交)" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="考核评分" align="center" min-width="150px">
        <template slot-scope="scope">
          <span
            :style="{ color: scope.row.assessorContent ? '#409EFF' : '' }"
            @click="
              getFractionDetail(
                scope.row.assessorContent,
                scope.row.assessorOrgName
              )
            "
          >
            {{
              scope.row.assessorContent
                ? getFraction(scope.row.assessorContent)
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="单位名称" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>
            {{ scope.row.assesseeOrgName
            }}{{
              scope.row.type === "1"
                ? ""
                : scope.row.assesseeDone
                ? "(已提交)"
                : "(未提交)"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="考核评分" align="center" min-width="150px">
        <template slot-scope="scope">
          <span
            :style="{ color: scope.row.assesseeContent ? '#409EFF' : '' }"
            @click="
              getFractionDetail(
                scope.row.assesseeContent,
                scope.row.assesseeOrgName
              )
            "
          >
            {{
              scope.row.assesseeContent
                ? getFraction(scope.row.assesseeContent)
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            style="color: red"
            @click="deleteRow(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px;padding-left: 0"
      :current-page="params.offset"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!--  新增  -->
    <el-dialog title="新增考核" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="考核类型" label-width="120px">
          <el-radio-group v-model="form.type">
            <el-radio label="1">自审</el-radio>
            <el-radio label="2">互审</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考核名称" label-width="120px" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请填写考核名称"
          />
        </el-form-item>
        <el-form-item label="考核时间" label-width="120px" prop="time">
          <el-date-picker
            v-model="form.time"
            style="width: 100%;"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="考核目标" label-width="120px" prop="target">
          <el-input
            v-model="form.target"
            autocomplete="off"
            placeholder="请填写考核目标"
          />
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
        <el-form-item
          v-if="!form.level"
          label="考核单位"
          label-width="120px"
          prop="assessorId"
        >
          <el-select
            v-model="form.assessorId"
            clearable
            style="width: 100%;"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索机构"
            :loading="loading"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!form.assessorId && form.type === '1'"
          label="级别:"
          label-width="120px"
          prop="level"
        >
          <el-select
            v-model="form.level"
            clearable
            placeholder="请选择用户级别"
          >
            <el-option
              v-for="(item, index) in levelValues"
              :key="index"
              :label="item"
              :value="String(index + 1)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type === '2'"
          label="考核对象"
          label-width="120px"
          prop="assesseeId"
        >
          <el-select
            v-model="form.assesseeId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索机构"
            :loading="loading"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type === '1'"
          label="注：选择级别即该级别下所有机构"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="`考评内容得分：${getFraction(row)}分;   机构名称： ${name}`"
      :visible.sync="visible"
      width="80%"
    >
      <el-table
        :data="detailList"
        border
        fit
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="考核项" align="center" fixed min-width="300px">
          <template slot-scope="scope">
            {{ scope.row.text }}
          </template>
        </el-table-column>
        <el-table-column label="考核结果" align="center" fixed>
          <template slot-scope="scope">
            {{ scope.row.value }}
          </template>
        </el-table-column>
        <el-table-column label="上传图片" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-image
              v-for="(i, k) in scope.row.pics"
              :key="k"
              :src="i.url"
              class="image"
              :preview-src-list="srcList"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="考核项详情" :visible.sync="contentDetailVisible">
      <div
        v-if="
          contentDetail &&
            contentDetail.assesseeContent &&
            contentDetail.assesseeContent.length
        "
        class="assessee"
      >
        <div class="cell">
          <div class="label">考核单位：</div>
          <div class="value">{{ contentDetail.assesseeOrgName }}</div>
        </div>
        <div
          v-for="(item, index) in contentDetail.assesseeContent"
          :key="index"
        >
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
            <el-image
              v-for="(i, k) in item.urls"
              :key="k"
              :src="i"
              class="image"
              :preview-src-list="srcList"
            />
          </div>
        </div>
      </div>
      <div
        v-if="
          contentDetail &&
            contentDetail.assessorContent &&
            contentDetail.assessorContent.length
        "
        class="assessor"
      >
        <div class="cell">
          <div class="label">考核单位：</div>
          <div class="value">{{ contentDetail.assessorOrgName }}</div>
        </div>
        <div
          v-for="(item, index) in contentDetail.assessorContent"
          :key="index"
        >
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
            <el-image
              v-for="(i, k) in item.urls"
              :key="k"
              :src="i"
              class="image"
              :preview-src-list="srcList"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addTask,
  deleteTask,
  getOrgList,
  getTaskList,
  getTemplateList
} from "@/api/table";
const mockData = {
  a1: {
    text: "有垃圾收集设施、日产生垃圾数量等数据的“一本台账”",
    value: 3,
    type: "1"
  },
  a2: {
    text: "与有资质的收运处置单位签订转运处置协议，交接手续明晰",
    value: 2,
    type: "1"
  },
  a3: { text: "有明确的内部转运时间和路线", value: 2, type: "1" },
  a4: { text: "确保厨余垃圾“日产日清”", value: 3, type: "2" },
  b1: { text: "科学合理布局四类垃圾桶，优化桶站点位", value: 2, type: "2" },
  b2: { text: "有规范标识", value: 2, type: "4" },
  b3: { text: "设备设施尽快落成到位不足的要补足欠缺", value: 1, type: "2" },
  b4: {
    text: "食品加工区设置厨余垃圾、其他垃圾容器，配置油水分离装置",
    value: 2,
    type: "2"
  },
  b5: { text: "集中用餐区设置厨余垃圾、其他垃圾收集容器", value: 2, type: "2" },
  b6: {
    text:
      "职工工作区因地制宜设置厨余垃圾、可回收物、有害垃圾、其他垃圾收集容器",
    value: 2,
    type: "2"
  },
  b7: {
    text:
      "门急诊和住院部区域因地制宜设置厨余垃圾、可回收物、有害垃圾、其他垃圾收集容器",
    value: 2,
    type: "2"
  },
  b8: {
    text:
      "办公区域内每个办公室设置其他垃圾收集容器，公共区域因地制宜设置、厨余垃圾、可回收物、有害垃圾、其他垃圾收集容器",
    value: 2,
    type: "2"
  },
  b9: {
    text: "有废旧纸、金属、有害垃圾、大件废弃物品等存储点",
    value: 2,
    type: "1"
  },
  b10: { text: "垃圾桶站有专人值守、引导投放", value: 3, type: "1" },
  c1: {
    text:
      "压实主体责任，细化落实1个包干，单位领导责任人职责明确（五类责任各1分）",
    value: 1,
    type: "3"
  },
  c2: {
    text:
      "压实主体责任，细化落实1个包干，职能部门责任人职责明确（五类责任各1分）",
    value: 1,
    type: "3"
  },
  c3: {
    text:
      "压实主体责任，细化落实1个包干，科（室）责任人职责明确（五类责任各1分）",
    value: 1,
    type: "3"
  },
  c4: {
    text:
      "压实主体责任，细化落实1个包干，物业公司责任人职责明确（五类责任各1分）",
    value: 1,
    type: "3"
  },
  c5: {
    text: "压实主体责任，细化落实1个包干，个人责任人职责明确（五类责任各1分）",
    value: 1,
    type: "3"
  },
  d1: { text: "单位落实党政“一把手”双组长制", value: 1, type: "1" },
  d2: {
    text: "有明确的工作标准，能够体现“管理精细、数据精准、问题精确”",
    value: 1,
    type: "2"
  },
  d3: { text: "监督管理制度", value: 2, type: "1" },
  d4: { text: "奖评标准和奖惩措施", value: 1, type: "1" },
  e1: { text: "做好一进一出“两桶一袋”进病房", value: 1, type: "1" },
  e2: { text: "医疗废物及时转运出病房", value: 2, type: "2" },
  e3: {
    text: "管好“一个棉球和一个输液袋”进一步加强医疗废物监管",
    value: 5,
    type: "2"
  },
  e4: { text: "引导患者行为，自觉遵守垃圾分类规定", value: 2, type: "2" },
  e5: { text: "生活垃圾分类桶内无混装混放", value: 5, type: "2" },
  e6: { text: "严禁生活垃圾和医疗废物混装混运", value: 5, type: "1" },

  f1: {
    text:
      "党建引领有措施：开展“一个支部动员”、党员先锋岗、责任制、志愿服务等工作，发挥党员先锋模范作用",
    value: 5,
    type: "1"
  },
  f2: { text: "公共区域有志愿者参与引导", value: 2, type: "1" },
  f3: { text: "对专职人员和医务工作者有培训", value: 3, type: "1" },

  g1: {
    text:
      "有科普宣传、政策解读、舆情监测和应对等宣传引导工作，积极培养患者及家属垃圾分类意识行为的形成",
    value: 3,
    type: "1"
  },
  g2: {
    text:
      "有针对诊室、病房、食堂等区域垃圾分类的“一张宣传海报”，引导患者逐渐养成垃圾分类的良好习惯",
    value: 3,
    type: "1"
  },
  g3: {
    text: "医院入口及相关位置贴有1张生活垃圾主要投放点、集中存储点的位置示意图",
    value: 2,
    type: "1"
  },
  g4: { text: "有示范典型部门、科（室）“一个标杆”", value: 2, type: "1" },

  h1: { text: "各类垃圾桶整洁，定人定时清洁维护", value: 3, type: "2" },
  h2: { text: "无暴露垃圾", value: 5, type: "1" },
  h3: { text: "桶站张贴生活垃圾分类公示牌", value: 2, type: "1" },
  h4: {
    text:
      "单位厨余垃圾、其他垃圾集中存储点有防鼠、防蝇等措施，有大件垃圾集中存放点",
    value: 5,
    type: "1"
  },
  h5: { text: "垃圾桶站设施、设备保持清洁整齐完好", value: 5, type: "" }
};
const levelValues = [
  "三级医院",
  "二级医院",
  "一级医院",
  "门诊部",
  "诊所",
  "未定级",
  "医务室",
  "卫生室",
  "社区卫生服务中心（区属）",
  "社区卫生服务中心（非区属）",
  "社区卫生服务站"
];
export default {
  data() {
    return {
      rules: {
        target: [{ required: true, message: "考核目标不能为空" }],
        name: [{ required: true, message: "考核名称不能为空" }],
        assessorId: [{ required: true, message: "考核单位不能为空" }],
        assesseeId: [{ required: true, message: "考核对象不能为空" }],
        time: [
          {
            required: true,
            message: "请选择考核开始/结束日期",
            trigger: "change"
          }
        ]
      },
      selectList: [],
      total: 0,
      mockData,
      params: { offset: 1, limit: 10, organizationId: "" },
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      editVisible: false,
      loading: false,
      levelValues,
      form: {
        type: "1",
        name: "",
        startTime: "",
        endTime: "",
        target: "",
        assessorId: "",
        assesseeId: "",
        time: "",
        level: ""
      },
      contentDetailVisible: false,
      visible: false,
      contentDetail: null,
      srcList: [],
      detailList: [],
      row: {},
      name: ""
    };
  },
  watch: {
    dialogFormVisible: {
      handler(val) {
        if (!val) {
          this.$refs.form.resetFields();
        }
      }
    },
    "form.time": {
      handler(val) {
        if (val && val.length) {
          this.form.startTime = val[0];
          this.form.endTime = val[1];
        }
      }
    }
  },
  created() {
    this.fetchData();
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      return `row-${row.id}`;
    },
    getFractionDetail(row, name) {
      if (row) {
        this.row = row;
        console.log(name);
        this.name = name;
        this.visible = true;
        this.detailList = [];
        this.srcList = [];
        Object.keys(row).forEach(key => {
          const { value, text } = this.mockData[key];
          const arr = ["有/无", "是/否", "明确/不明确", "规范/不规范"];
          const index = _.get(this.mockData, key).type;
          const [one, two] = arr[index ? Number(index) - 1 : 0].split("/");
          this.detailList.push({
            text,
            value: row[key].value === "1" ? one : two,
            pics: row[key].pics,
            id: key.slice(0, 1)
          });
          row[key].pics.forEach(item => {
            this.srcList.push(item.url);
          });
        });
      } else {
        return;
      }
    },
    getFraction(row) {
      let value = 0;
      Object.keys(row).forEach(key => {
        if (row[key].value === "1") {
          value += this.mockData[key].value;
        }
      });
      return value;
    },
    deleteRow(id) {
      deleteTask({ taskId: id }).then(() => {
        this.$message({ message: "删除成功", type: "success" });
        this.fetchData();
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        getOrgList({ search: query }).then(res => {
          this.loading = false;
          this.selectList = res.data.list.map(item => ({
            value: item.organizationId,
            label: item.name
          }));
        });
      } else {
        this.selectList = [];
      }
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = _.omit(
            this.form,
            this.form.type === "1" ? ["time", "assesseeId"] : "time"
          );
          await addTask(params);
          this.$message({ message: "添加成功", type: "success" });
          this.fetchData();
          Object.keys(this.form).forEach(key => {
            this.form[key] = key === "type" ? "1" : "";
          });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    getDetail(row, index) {
      // this.srcList = []
      // const { assesseeDone, assessorDone, assessorContent, assesseeContent } = row
      // if (assessorDone || assesseeDone) {
      //   this.contentDetailVisible = true
      //   this.contentDetail = row
      //   console.log(this.contentDetail)
      //   if (assessorContent) {
      //     assessorContent.forEach(item => {
      //       item.urls.forEach(i => {
      //         this.srcList.push(i)
      //       })
      //     })
      //   }
      //   if (assesseeContent) {
      //     assesseeContent.forEach(item => {
      //       item.urls.forEach(i => {
      //         this.srcList.push(i)
      //       })
      //     })
      //   }
      // } else {
      //   return false
      // }
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.params.offset = val;
      this.fetchData();
    },
    fetchData() {
      if (this.params.organizationId) {
        this.params.offset = 1;
      }
      this.listLoading = false;
      getTaskList(this.params).then(response => {
        this.list = response.data.list;
        this.total = response.data.count;
        this.listLoading = false;
      });
    }
  }
};
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
  color: #409eff;
  cursor: pointer;
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
<style>
.el-table .row-a {
  background: oldlace;
}

.el-table .row-b {
  background: #f0f9eb;
}

.el-table .row-c {
  background: oldlace;
}

.el-table .row-d {
  background: #f0f9eb;
}

.el-table .row-e {
  background: oldlace;
}

.el-table .row-f {
  background: #f0f9eb;
}

.el-table .row-g {
  background: oldlace;
}

.el-table .row-h {
  background: #f0f9eb;
}
</style>
