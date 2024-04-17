<template>
  <div>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="学生学号">
      <el-input v-model="search.student_id" placeholder="输入学号搜索" clearable :prefix-icon="Search" />
    </el-form-item>
    <el-form-item label="学生姓名">
      <el-input v-model="search.student_name" placeholder="输入姓名搜索" clearable :prefix-icon="Search" />
    </el-form-item>
  </el-form>

  <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
    :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'student_id', order: 'increncing' }">
    <el-table-column label="学生姓名" prop="student_name" align="center"></el-table-column>
    <el-table-column label="学生学号" prop="student_id" sortable align="center"></el-table-column>
    <el-table-column label="班级" prop="class" align="center"></el-table-column>
    <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <StudentInfo :student_id="row.student_id" />
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getStudentByTeacherId } from '@/services/session'; // 导入获取学生的方法
import { Search } from '@element-plus/icons-vue'
import StudentInfo from '@/views/public/studentInfo.vue'

interface Student {
  student_id: string
  student_name: string
  class: string
  phone: string
}

// 使用ref创建响应式变量
const loading = ref(true)
const search = ref({
  student_id: '',
  student_name: '',
});

const fetchData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    const data = await getStudentByTeacherId(account); // 调用获取教师学生的方法，并传入参数
    const student: Student[] = data.map((item: any) => ({
      student_name: item.studentName,
      student_id: item.studentId,
      class: item.grade,
      phone: item.phone,
    }));
    tableData.value = student; // 更新 tableData
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
const tableData = ref<Student[]>([]);

// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(data =>
    (!search.value.student_id || data.student_id.toLowerCase().includes(search.value.student_id.toLowerCase())) &&
    (!search.value.student_name || data.student_name.toLowerCase().includes(search.value.student_name.toLowerCase()))
  )
)

</script>

<style scoped></style>
