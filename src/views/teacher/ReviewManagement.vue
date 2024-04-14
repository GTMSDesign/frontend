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
                placeholder="Approved by"
                clearable
              />
            </el-form-item>
            <el-form-item label="指导老师">
              <el-input
                v-model="formInline.teacher"
                placeholder="Approved by"
                clearable
              />
            </el-form-item>
            <el-form-item label="学生">
              <el-input
                v-model="formInline.student"
                placeholder="Approved by"
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
            <template #default>
              <el-button link type="primary" size="small" @click="download"
                >下载</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="dialogFormVisible = true"
                >提交评审</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="提交评审" width="70%" center>
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="给学生的评审附言" :label-width="formLabelWidth">
          <el-input
            v-model="form.studentReview"
            style="width: 90%"
            :rows="6"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="给老师的评审附言" :label-width="formLabelWidth">
          <el-input
            v-model="form.teacherReview"
            style="width: 90%"
            :rows="6"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
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
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type {
  FormProps,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { genFileId } from "element-plus";
import { allReviewThesis } from "@/services/teacher";
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const labelPosition = ref<FormProps["labelPosition"]>("left");
const upload = ref<UploadInstance>();
const form = reactive({
  studentReview: "",
  teacherReview: "",
  conclusion: "",
});
interface Thesis {
  title: string;
  thesisId: string;
  studentName: string;
  teacherName: string;
  status: string;
}
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
const resetSearch = () => {
  formInline.title = "";
  formInline.teacher = "";
  formInline.student = "";
  updateFilterTableData(); // 再次调用更新函数以应用重置
};
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
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const submitUpload = () => {
  upload.value!.submit();
};

const download = () => {
  console.log("click");
};
const onSubmit = () => {
  console.log("submit!");
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
