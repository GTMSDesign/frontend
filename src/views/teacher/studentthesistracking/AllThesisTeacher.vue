<template>
  <div>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="标题">
      <el-input v-model="search.title" placeholder="Type to search" clearable :prefix-icon="Search" />
    </el-form-item>
    <el-form-item label="学生">
      <el-input v-model="search.student_name" placeholder="Type to search" clearable :prefix-icon="Search" />
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
        <el-tag type="primary" disable-transitions>{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="答辩次数" prop="defense_times" width="110" sortable align="center"></el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <ThesisInfo :thesis_id="row.thesis_id" />
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { allThesisTeacher } from '@/services/teacher'; // 导入获取教师相关论文的方法
import { Search } from '@element-plus/icons-vue'
import ThesisInfo from '@/views/public/thesisInfo.vue'

interface Thesis {
  title: string
  thesis_id: string
  student_name: string
  student_id: string
  teacher_name: string
  teacher_id: string
  status: string
  defense_times: string
}

// 使用ref创建响应式变量
const loading = ref(true)
const search = ref({
  title: '',
  student_name: '',
});

const fetchData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    const data = await allThesisTeacher(account); // 调用获取教师相关论文的方法，并传入参数
    const theses: Thesis[] = data.map((item: any) => ({
      title: item.title,
      thesis_id: item.thesisId,
      student_name: item.studentName,
      student_id: item.studentId,
      teacher_name: item.teacherName,
      teacher_id: item.teacherId,
      status: item.status,
      defense_times: item.defenseTimes,
    }));
    tableData.value = theses; // 更新 tableData
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
    // 处理错误
  }
}

// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});

// 使用ref创建响应式变量
const tableData = ref<Thesis[]>([]);

// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(data =>
    (!search.value.title || data.title.toLowerCase().includes(search.value.title.toLowerCase())) &&
    (!search.value.student_name || data.student_name.toLowerCase().includes(search.value.student_name.toLowerCase()))
  )
)

</script>

<style scoped></style>
