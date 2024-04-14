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
                v-model="formInline.user"
                placeholder="Approved by"
                clearable
              />
            </el-form-item>
            <el-form-item label="指导老师">
              <el-input
                v-model="formInline.user"
                placeholder="Approved by"
                clearable
              />
            </el-form-item>
            <el-form-item label="学生">
              <el-input
                v-model="formInline.user"
                placeholder="Approved by"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">Query</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="table">
        <el-table
          :data="tableData"
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
            prop="thesis_id"
            align="center"
          ></el-table-column>

          <el-table-column
            label="学生姓名"
            prop="student_name"
            align="center"
          ></el-table-column>
          <el-table-column
            label="导师姓名"
            prop="teacher_name"
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
import { reactive, ref } from "vue";
import type {
  FormProps,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { genFileId } from "element-plus";
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const labelPosition = ref<FormProps["labelPosition"]>("left");
const upload = ref<UploadInstance>();

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
const form = reactive({
  studentReview: "",
  teacherReview: "",
  conclusion: "",
});
const formInline = reactive({
  user: "",
  region: "",
  date: "",
});

const onSubmit = () => {
  console.log("submit!");
};
const tableData = [
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
  {
    title: "高等元素论",
    thesis_id: "11408",
    student_name: "牢大",
    teacher_name: "坤坤",
    status: "待评审",
  },
];
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
