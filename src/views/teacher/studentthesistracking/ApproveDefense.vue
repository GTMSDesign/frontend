<template>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="论文标题">
      <el-input v-model="search.title" placeholder="输入论文标题以搜索" clearable :prefix-icon="Search" />
    </el-form-item>
    <el-form-item label="学生姓名">
      <el-input v-model="search.student_name" placeholder="输入学生姓名以搜索" clearable :prefix-icon="Search" />
    </el-form-item>
  </el-form>

  <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
    :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'thesis_id', order: 'increncing' }">
    <el-table-column label="论文标题" prop="title" width="300"></el-table-column>
    <el-table-column label="论文ID" prop="thesis_id" sortable align="center"></el-table-column>
    <el-table-column label="学生姓名" prop="student_name" align="center"></el-table-column>
    <el-table-column label="学生学号" prop="student_id" sortable align="center"></el-table-column>
    <el-table-column label="导师姓名" prop="teacher_name" align="center"></el-table-column>
    <el-table-column label="导师ID" prop="teacher_id" align="center"></el-table-column>
    <el-table-column label="论文状态" prop="status" align="center" width="110">
      <template #default="scope">
        <el-tag type="primary" disable-transitions>{{
          scope.row.status
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="答辩次数" prop="defense_times" width="110" sortable align="center"></el-table-column>
    <el-table-column label="操作" align="center" #default="scope" width="210px" fixed="right">
      <el-button link type="primary" size="small" @click="download(scope.row)">下载论文</el-button>
      <el-button link type="primary" size="small" @click="reviewOpinion(scope.row)">评审意见</el-button>
      <el-button link type="primary" size="small" @click="handleReviewButtonClick(scope.row)">修改状态</el-button>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="修改状态" width="40%" center>
    <hr size="4" color="#faf8f8" />
    <el-form :label-position="labelPosition">
      <el-form-item label="论文ID" :label-width="formLabelWidth">
        <el-input v-model="currentrow.thesisId" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="论文标题" :label-width="formLabelWidth">
        <el-input v-model="currentrow.thesisName" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="学生姓名" :label-width="formLabelWidth">
        <el-input v-model="currentrow.studentName" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="修改状态为" :label-width="formLabelWidth">
        <el-input v-model="conclusion" style="width: auto" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogVisible" title="评审意见" width="50%" center>
    <hr size="4" color="#faf8f8" />
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="内审老师的评价" name="first">
        <div class="text-container">
          <p>{{ form.internalComment }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="内审老师的建议" name="second">
        <div class="text-container">
          <p>{{ form.internalAdvice }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="外审老师的评价" name="third">
        <div class="text-container">
          <p>{{ form.externalComment }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="外审老师的建议" name="fourth">
        <div class="text-container">
          <p>{{ form.externalAdvice }}</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
//import reviewOpinion from "@/views/public/reviewOpinion.vue";
import { reactive, ref, computed, onMounted } from "vue";
import {
  approveDefence,
  getThesisByStatus,
  downloadFile,
  getReviewByThesisId,
} from "@/services/teacher"; // 导入获取教师相关论文的方法
import { Search } from "@element-plus/icons-vue";
import type { FormProps } from "element-plus";
interface Thesis {
  title: string;
  thesis_id: string;
  student_name: string;
  student_id: string;
  teacher_name: string;
  teacher_id: string;
  status: string;
  defense_times: string;
  proposal_url: string;
  thesis_url: string;
}
interface CurrentRow {
  thesisId: string;
  thesisName: String;
  studentName: String;
  studentId: string;
}
const activeName = ref("first");
const dialogVisible = ref(false);
const formLabelWidth = "100px";
const conclusion = "答辩前定稿";
// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  title: "",
  student_name: "",
});
const dialogFormVisible = ref(false);
const currentrow = ref<CurrentRow>({
  thesisId: "",
  thesisName: "",
  studentId: "",
  studentName: "",
});

const labelPosition = ref<FormProps["labelPosition"]>("left");

const cancel = () => {
  dialogFormVisible.value = false;
  currentrow.value.thesisId = "";
  currentrow.value.thesisName = "";
  currentrow.value.studentId = "";
  currentrow.value.studentName = "";
};
interface reviewMessage {
  externalComment: string;
  internalComment: string;
  externalAdvice: string;
  internalAdvice: string;
}
const form = ref<reviewMessage>({
  externalComment: "",
  internalComment: "",
  externalAdvice: "",
  internalAdvice: "",
});
const handleReviewButtonClick = (row: Thesis) => {
  currentrow.value.thesisId = row.thesis_id;
  currentrow.value.thesisName = row.title;
  currentrow.value.studentId = row.student_id;
  currentrow.value.studentName = row.student_name;
  dialogFormVisible.value = true;
};
const reviewOpinion = async (row: Thesis) => {
  dialogVisible.value = true;
  try {
    const data = await getReviewByThesisId(row.thesis_id); // 调用获取教师相关论文的方法，并传入参数
    form.value = data;
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};
const fetchData = async () => {
  try {
    const account = sessionStorage.getItem("account") || ""; // 获取 sessionStorage 中的 account
    const data = await getThesisByStatus(account, "待答辩"); // 调用获取教师相关论文的方法，并传入参数
    tableData.value = data; // 更新 tableData
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
  }
};

// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});

// 使用ref创建响应式变量
const tableData = ref<Thesis[]>([]);
const download = async (row: Thesis) => {
  console.log(row.thesis_id);
  const url = await downloadFile(row.thesis_id, "thesis");
  console.log(url);
  const link = document.createElement("a");
  link.href = url; // 设置下载链接
  document.body.appendChild(link); // 将元素添加到文档中
  link.click(); // 触发下载
  document.body.removeChild(link); // 下载后移除元素
};

const submit = async () => {
  //提交结论
  try {
    await approveDefence(currentrow.value.thesisId);
    await fetchData();
  } catch (error) {
    console.log(error);
  }

  cancel();
};
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      (!search.value.title ||
        data.title.toLowerCase().includes(search.value.title.toLowerCase())) &&
      (!search.value.student_name ||
        data.student_name
          .toLowerCase()
          .includes(search.value.student_name.toLowerCase()))
  )
);
</script>

<style scoped>
/* Add any necessary styles */
.text-container {
  background-color: #f4f4f9;
  /* 浅灰色背景 */
  border-left: 5px solid #5b9bd5;
  /* 左侧有一个蓝色边框 */
  padding: 20px;
  /* 内部填充 */
  margin: 20px;
  /* 外部边距 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* 轻微的阴影效果 */
}

.text-container p {
  color: #333;
  /* 深灰色文字 */
  font-family: "Arial", sans-serif;
  /* 使用Arial字体 */
  font-size: 16px;
  /* 字体大小 */
  line-height: 1.6;
  /* 行间距 */
  text-align: justify;
  /* 两端对齐文本 */
}
</style>
