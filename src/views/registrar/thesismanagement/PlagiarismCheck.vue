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
    <el-table-column label="论文状态" prop="status" align="center">
      <template #default="scope">
        <el-tag type="primary" disable-transitions>{{
          scope.row.status
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="答辩次数" prop="defense_times" width="110" sortable align="center"></el-table-column>
    <el-table-column label="操作" align="center" #default="scope" fixed="right" width="200px">
      <el-button type="primary" plain @click="download(scope.row)">下载</el-button>
      <el-button type="primary" plain @click="handleReviewButtonClick(scope.row)">提交结果</el-button>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="提交审批" width="40%" center>
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
      <el-form-item label="重复率%" :label-width="formLabelWidth">
        <el-input-number v-model="currentrow.repetitionRate" :precision="2" :step="0.1" :min="0" :max="100" />
      </el-form-item>
      <el-form-item label="评审结论" :label-width="formLabelWidth">
        <el-select v-model="currentrow.conclusion" style="width: 100px" placeholder="请选择">
          <el-option label="通过" value="通过" />
          <el-option label="不通过" value="不通过" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { downloadFile } from "@/services/teacher"; // 导入获取教师相关论文的方法

import { getThesisByStatus, submitPlagiarismCheck } from "@/services/registrar";
import { Search } from "@element-plus/icons-vue";
import type { FormProps } from "element-plus";
import { ElMessage } from "element-plus";
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
  repetitionRate: number;
  conclusion: string;
}
interface UploadFile {
  name: string; // 文件名
  size: number; // 文件大小
  uid: number; // 唯一标识
  status: string; // 上传状态，如 'ready', 'uploading', 'done', 'error'
  raw: File; // 原始文件对象
  percentage?: number; // 上传进度百分比
}
const formLabelWidth = "100px";

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
  repetitionRate: 0,
  conclusion: "",
});

const labelPosition = ref<FormProps["labelPosition"]>("left");

const cancel = () => {
  dialogFormVisible.value = false;
  currentrow.value.thesisId = "";
  currentrow.value.thesisName = "";
  currentrow.value.studentId = "";
  currentrow.value.studentName = "";
  currentrow.value.repetitionRate = 0;
  currentrow.value.conclusion = "";
};

const handleReviewButtonClick = (row: Thesis) => {
  currentrow.value.thesisId = row.thesis_id;
  currentrow.value.thesisName = row.title;
  currentrow.value.studentId = row.student_id;
  currentrow.value.studentName = row.student_name;
  dialogFormVisible.value = true;
};
const fetchData = async () => {
  try {
    const data = await getThesisByStatus("初步定稿"); // 调用获取教师相关论文的方法，并传入参数
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
  if (currentrow.value.conclusion === "") {
    ElMessage.error("请选择一种结论");
    return;
  }
  //提交结论
  try {
    await submitPlagiarismCheck(
      currentrow.value.studentId,
      currentrow.value.thesisId,
      currentrow.value.repetitionRate,
      currentrow.value.conclusion
    );
    ElMessage.success("提交成功！")
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

.hr-dashed {
  border: 0;
  border-top: 1px dashed #a2a9b6;
}
</style>
