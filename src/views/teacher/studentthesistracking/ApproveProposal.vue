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
    <el-table-column label="操作" align="center" #default="scope" fixed="right" width="150px">
      <el-button link type="primary" size="small" @click="download(scope.row)">下载</el-button>
      <el-button link type="primary" size="small" @click="handleReviewButtonClick(scope.row)">提交审批</el-button>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="提交审批" width="40%" center>
    <hr size="4" color="#faf8f8" />
    <el-form :model="form" :label-position="labelPosition">
      <el-form-item label="论文ID" :label-width="formLabelWidth">
        <el-input v-model="currentrow.thesisId" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="论文标题" :label-width="formLabelWidth">
        <el-input v-model="currentrow.thesisName" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="学生姓名" :label-width="formLabelWidth">
        <el-input v-model="currentrow.studentName" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="评审结论" :label-width="formLabelWidth">
        <el-select v-model="form.conclusion" style="width: 100px" placeholder="请选择">
          <el-option label="通过" value="通过" />
          <el-option label="不通过" value="不通过" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传附表" :label-width="formLabelWidth">
        <el-upload ref="upload" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1"
          :on-exceed="handleExceed" :auto-upload="false" :on-change="change">
          <template #trigger>
            <el-button type="success">选择文件</el-button>
          </template>

          <template #tip>
            <div class="el-upload__tip text-red">
              仅限 doc/docx 文件，确认上传之后不可删除，多次上传会覆盖先前文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit" v-if="hasUrl"> 提交 </el-button>
        <el-text type="danger" tag="mark" v-if="!hasUrl"> 学生还未提交开题报告 </el-text>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import {
  sendAttachmentMail,
  reviewProposal,
  getThesisByStatus,
  downloadFile,
} from "@/services/teacher"; // 导入获取教师相关论文的方法
import { Search } from "@element-plus/icons-vue";
import type {
  FormProps,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { genFileId, ElMessage } from "element-plus";
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
  selectFile: File | null; // `selectFile` 可以是 File 类型或者 null
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
const form = reactive({
  conclusion: "",
});
// 使用ref创建响应式变量
const loading = ref(true);
const hasUrl = ref(false);
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
  selectFile: null, // 初始值为 null
});

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
  currentrow.value.thesisId = "";
  currentrow.value.thesisName = "";
  currentrow.value.studentId = "";
  currentrow.value.studentName = "";
  currentrow.value.selectFile = null;
  upload.value!.clearFiles();
  form.conclusion = "";
};

const change = (file: UploadFile) => {
  currentrow.value.selectFile = file.raw;
};
const handleReviewButtonClick = (row: Thesis) => {
  currentrow.value.thesisId = row.thesis_id;
  currentrow.value.thesisName = row.title;
  currentrow.value.studentId = row.student_id;
  currentrow.value.studentName = row.student_name;
  hasUrl.value = row.proposal_url !== null; // 更新 hasUrl
  dialogFormVisible.value = true;
};
const fetchData = async () => {
  try {
    const account = sessionStorage.getItem("account") || ""; // 获取 sessionStorage 中的 account
    const data = await getThesisByStatus(account, "未开题"); // 调用获取教师相关论文的方法，并传入参数
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
  const url = await downloadFile(row.thesis_id, "proposal");
  if (url === "Error") {
    ElMessage.error('该文件还未被上传');
    return;
  } else {
    const link = document.createElement("a");
    link.href = url; // 设置下载链接
    document.body.appendChild(link); // 将元素添加到文档中
    link.click(); // 触发下载
    document.body.removeChild(link); // 下载后移除元素
  }
};

const submit = async () => {
  if (currentrow.value.selectFile === null) {
    ElMessage.error("请提交文件");
    return;
  } else if (form.conclusion === "") {
    ElMessage.error("请选择一种评审结论");
    return;
  }
  //提交结论
  try {
    await reviewProposal(currentrow.value.thesisId, form.conclusion);
    ElMessage.success("提交成功")
    await fetchData();
  } catch (error) {
    console.log(error);
  }
  //发送邮件
  if (form.conclusion === "不通过") {
    await sendAttachmentMail(
      currentrow.value.studentId,
      "关于开题报告审批结果",
      " 同学您的开题审批结果为不通过，详细信息请查看附件",
      currentrow.value.selectFile
    );
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
