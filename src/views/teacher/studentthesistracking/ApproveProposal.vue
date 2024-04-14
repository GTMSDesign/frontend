<template>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="标题">
      <el-input
        v-model="search.title"
        placeholder="Type to search"
        clearable
        :prefix-icon="Search"
      />
    </el-form-item>
    <el-form-item label="学生">
      <el-input
        v-model="search.student_name"
        placeholder="Type to search"
        clearable
        :prefix-icon="Search"
      />
    </el-form-item>
  </el-form>

  <el-table
    v-loading="loading"
    v-if="!loading"
    :data="filterTableData"
    style="width: 100%"
    stripe
    height="550"
    :header-cell-style="{ backgroundColor: '#E9D0F3' }"
    :default-sort="{ prop: 'thesis_id', order: 'increncing' }"
  >
    <el-table-column
      label="论文标题"
      prop="title"
      width="300"
    ></el-table-column>
    <el-table-column
      label="论文ID"
      prop="thesis_id"
      sortable
      align="center"
    ></el-table-column>
    <el-table-column
      label="学生姓名"
      prop="student_name"
      align="center"
    ></el-table-column>
    <el-table-column
      label="学生学号"
      prop="student_id"
      sortable
      align="center"
    ></el-table-column>
    <el-table-column
      label="导师姓名"
      prop="teacher_name"
      align="center"
    ></el-table-column>
    <el-table-column
      label="导师ID"
      prop="teacher_id"
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
      label="答辩次数"
      prop="defense_times"
      width="110"
      sortable
      align="center"
    ></el-table-column>
    <el-table-column label="操作" align="center" #default="scope">
      <el-button link type="primary" size="small" @click="download"
        >下载</el-button
      >
      <el-button
        link
        type="primary"
        size="small"
        @click="handleReviewButtonClick(scope.row.thesis_id)"
        >提交审批</el-button
      >
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="提交审批" width="40%" center>
    <el-form :model="form" :label-position="labelPosition">
      <el-form-item label="评审结论" :label-width="formLabelWidth">
        <el-select
          v-model="form.conclusion"
          style="width: 100px"
          placeholder="请选择"
        >
          <el-option label="通过" value="通过" />
          <el-option label="不通过" value="不通过" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传附表" :label-width="formLabelWidth">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="success">select file</el-button>
          </template>

          <template #tip>
            <div class="el-upload__tip text-red">
              limit 1 file, new file will cover the old file
            </div>
          </template>
        </el-upload>
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
import { reviewProposal, getThesisByStatus } from "@/services/teacher"; // 导入获取教师相关论文的方法
import { Search } from "@element-plus/icons-vue";
import type {
  FormProps,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { genFileId } from "element-plus";
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
const formLabelWidth = "100px";
const form = reactive({
  conclusion: "",
});
// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  title: "",
  student_name: "",
});
const dialogFormVisible = ref(false);
const currentThesisId = ref("");
const labelPosition = ref<FormProps["labelPosition"]>("left");
const upload = ref<UploadInstance>();
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const cancel = () => {
  dialogFormVisible.value = false;
  currentThesisId.value = "";
  form.conclusion = "";
};
const handleReviewButtonClick = (thesisId: string) => {
  currentThesisId.value = thesisId;
  dialogFormVisible.value = true;
};
const fetchData = async () => {
  try {
    const account = sessionStorage.getItem("account") || ""; // 获取 sessionStorage 中的 account
    const data = await getThesisByStatus(account, "待开题"); // 调用获取教师相关论文的方法，并传入参数
    tableData.value = data; // 更新 tableData
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};

// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});

// 使用ref创建响应式变量
const tableData = ref<Thesis[]>([]);
const download = () => {
  console.log("click");
};
const submit = async () => {
  //提交结论
  try {
    await reviewProposal(currentThesisId.value, form.conclusion);
    await fetchData();
  } catch (error) {
    console.log(error);
  }
  //发送邮件

  //关闭对话框
  dialogFormVisible.value = false;
  currentThesisId.value = "";
  form.conclusion = "";
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
</style>
