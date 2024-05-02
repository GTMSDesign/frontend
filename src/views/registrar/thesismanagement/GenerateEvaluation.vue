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
    <el-table-column label="操作" align="center" width="210px" fixed="right">
      <template #default="scope">
        <el-button link type="primary" @click="handleReview(scope.row.thesis_id, scope.row.student_id)">
          生成三个一评价
        </el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import {
  getThesisByStatus, generateEvaluation
} from "@/services/registrar"; // 导入获取教师相关论文的方法
import { Search } from "@element-plus/icons-vue";
import type { FormProps } from "element-plus";
import { ElMessage } from 'element-plus'

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
// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  title: "",
  student_name: "",
});
const dialogFormVisible = ref(false);

const labelPosition = ref<FormProps["labelPosition"]>("left");

const handleReview = async (thesis_id: string, student_id: string) => {
  try {
    const data = await generateEvaluation(thesis_id, student_id); // 调用获取教师相关论文的方法，并传入参数
    if (data === "Error") {
      ElMessage.error('该文件还未被上传');
    } else {
      window.open(data);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchData = async () => {
  try {
    const data = await getThesisByStatus("答辩后定稿"); // 调用获取教师相关论文的方法，并传入参数
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
