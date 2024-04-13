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
        <el-table :data="tableData" style="width: 100%" height="400">
          <el-table-column
            fixed
            label="论文标题"
            prop="title"
          ></el-table-column>
          <el-table-column label="论文ID" prop="thesis_id"></el-table-column>

          <el-table-column
            label="学生姓名"
            prop="student_name"
          ></el-table-column>
          <el-table-column
            label="导师姓名"
            prop="teacher_name"
          ></el-table-column>
          <el-table-column label="论文状态" prop="status">
            <template #default="scope">
              <el-tag type="primary" disable-transitions>{{
                scope.row.status
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default>
              <el-button link type="primary" size="small" @click="download"
                >下载</el-button
              >
              <el-button link type="primary" size="small">提交评审</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const download = () => {
  console.log("click");
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
import { reactive } from "vue";

const formInline = reactive({
  user: "",
  region: "",
  date: "",
});

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
  height: 85%;
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
