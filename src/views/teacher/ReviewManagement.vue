<template>
  <div class="body">
    <div class="card">
      <div class="searchForm">
        <div class="form">
          <el-form
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
            id="input"
          >
            <el-form-item label="标题">
              <el-input
                v-model="formInline.title"
                placeholder="待输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="指导老师">
              <el-input
                v-model="formInline.teacher"
                placeholder="待输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="学生">
              <el-input
                v-model="formInline.student"
                placeholder="待输入"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="updateFilterTableData"
                >查询</el-button
              >
              <el-button type="default" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="table">
        <el-table
          :data="filterTableData"
          style="width: 100%"
          height="400"
          :header-cell-style="{ backgroundColor: '#E9D0F3' }"
        >
          <el-table-column
            fixed
            label="论文标题"
            prop="title"
            align="center"
          ></el-table-column>
          <el-table-column
            label="论文ID"
            prop="thesisId"
            align="center"
          ></el-table-column>

          <el-table-column
            label="学生姓名"
            prop="studentName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="导师姓名"
            prop="teacherName"
            align="center"
          ></el-table-column>
          <el-table-column label="论文状态" prop="status" align="center">
            <template #default="scope">
              <el-tag type="primary" disable-transitions>{{
                scope.row.status
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-button link type="primary" size="small" @click="download"
                >下载</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="openDialog(scope.row)"
                >提交评审</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      v-model="dialogFormVisible"
      title="提交评审"
      width="70%"
      center
      align-center
    >
      <el-scrollbar height="500px">
        <el-table
          :data="rules"
          style="width: 100%"
          :header-cell-style="{ backgroundColor: '#E9D0F3' }"
        >
          <el-table-column
            fixed
            label="评价项目"
            prop="reviewItem"
            width="200px"
          ></el-table-column>
          <el-table-column
            label="评价要素"
            prop="reviewElement"
          ></el-table-column>

          <el-table-column
            label="单项满分"
            prop="maxScore"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="最终评分"
            align="center"
            width="165px"
          >
            <template #default="scope">
              <el-input-number
                v-model="scope.row.actualScore"
                :min="0"
                :max="scope.row.maxScore"
                size="small"
              />
            </template>
          </el-table-column>
        </el-table>
        <br />
        <el-form :model="form" :label-position="labelPosition">
          <el-form-item label="对论文的学术评语" :label-width="formLabelWidth">
            <el-input
              v-model="form.comment"
              style="width: 90%"
              :rows="6"
              type="textarea"
              placeholder="待评审老师填写，不少于两百字"
            />
          </el-form-item>
          <el-form-item
            label="论文的不足之处和建议"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.advice"
              style="width: 90%"
              :rows="6"
              type="textarea"
              placeholder="待评审老师填写，不少于一百字"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <P>总评分：{{ totalScore }}</P>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from "vue";
import type { FormProps } from "element-plus";
import { genFileId } from "element-plus";
import {
  allReviewThesis,
  getReviewRules,
  submitReview,
} from "@/services/teacher";
const num = ref(1);
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const labelPosition = ref<FormProps["labelPosition"]>("top");
const form = reactive({
  comment: "",
  advice: "",
  thesisId: "",
});
interface Thesis {
  title: string;
  thesisId: string;
  studentName: string;
  teacherName: string;
  status: string;
}

interface rule {
  reviewItem: string;
  reviewElement: string;
  maxScore: number;
  actualScore: number;
}

const rules = ref<rule[]>([]);
const tableData = ref<Thesis[]>([]);
const filterTableData = ref<Thesis[]>([]);
const formInline = reactive({
  title: "",
  teacher: "",
  student: "",
});
onMounted(() => {
  fetchData();
});

const openDialog = async (row: Thesis) => {
  dialogFormVisible.value = true;
  rules.value = await getReviewRules();
  form.thesisId = row.thesisId;
};
const cancel = () => {
  form.comment = "";
  form.advice = "";
  form.thesisId = "";
  dialogFormVisible.value = false;
};
const submit = async () => {
  await submitReview(
    form.thesisId,
    totalScore.value,
    sessionStorage.getItem("account")!,
    form.comment,
    form.advice
  );
  await fetchData();
  cancel();
};

const resetSearch = () => {
  formInline.title = "";
  formInline.teacher = "";
  formInline.student = "";
  updateFilterTableData(); // 再次调用更新函数以应用重置
};
const totalScore = computed(() => {
  return rules.value.reduce((sum, rule) => sum + (rule.actualScore || 0), 0);
});
const fetchData = async () => {
  try {
    const account = sessionStorage.getItem("account") || ""; // 获取 sessionStorage 中的 account
    const data = await allReviewThesis(account); // 调用获取教师相关论文的方法，并传入参数
    tableData.value = data; // 更新 tableData
    updateFilterTableData();
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};
function updateFilterTableData() {
  filterTableData.value = tableData.value.filter((item) => {
    return (
      (formInline.title === "" ||
        item.title.toLowerCase().includes(formInline.title.toLowerCase())) &&
      (formInline.teacher === "" ||
        item.teacherName
          .toLowerCase()
          .includes(formInline.teacher.toLowerCase())) &&
      (formInline.student === "" ||
        item.studentName
          .toLowerCase()
          .includes(formInline.student.toLowerCase()))
    );
  });
  console.log(filterTableData);
}

const download = () => {
  console.log("click");
};
</script>

<style>
.main-content {
  background-color: #faf8f8;
}
.body {
  background-color: #fff;

  width: 100%;
  height: 90%;
}
.card {
  background-color: white;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.searchForm {
  /* height: 60%; */

  padding: 2%;
}

.table {
  padding-left: 30px;
  padding-right: 30px;
  height: auto;
}
</style>
