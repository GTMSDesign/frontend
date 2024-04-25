<template>
  <div>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="学生学号">
      <el-input v-model="search.student_id" placeholder="输入学生学号以搜索" clearable :prefix-icon="Search" />
    </el-form-item>
    <el-form-item label="学生姓名">
      <el-input v-model="search.student_name" placeholder="输入学生姓名以搜索" clearable :prefix-icon="Search" />
    </el-form-item>
  </el-form>

  <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
    :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'session_time', order: 'increncing' }">
    <el-table-column label="会话ID" prop="session_id" align="center" sortable></el-table-column>
    <el-table-column label="学生姓名" prop="student_name" align="center"></el-table-column>
    <el-table-column label="学生学号" prop="student_id" align="center"></el-table-column>
    <el-table-column label="会话时间" prop="session_time" align="center" sortable></el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <SessionInfo :session_id="row.session_id" :target_id="row.student_id" />
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSessionByTeacherId } from '@/services/session'; // 导入获取会话的方法
import { getStudentNameById } from '@/services/student';
import { Search } from '@element-plus/icons-vue'
import SessionInfo from '@/views/session/SessionInfo.vue'

// 使用ref创建响应式变量
const loading = ref(true)
const search = ref({
  student_id: '',
  student_name: '',
});

interface Session {
  session_id: string
  student_id: string
  student_name: string
  session_time: string
}

const fetchData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    const data = await getSessionByTeacherId(account); // 调用获取教师相关会话的方法，并传入参数

    // 循环遍历会话数据，获取每个会话的学生姓名
    const sessionsWithNames = await Promise.all(data.map(async (item: any) => {
      const studentName = await getStudentNameById(item.studentId);
      return {
        session_id: item.sessionId,
        student_id: item.studentId,
        student_name: studentName, // 添加学生姓名到会话数据中
        session_time: item.sessionTime,
      };
    }));
    tableData.value = sessionsWithNames; // 更新 tableData
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
const tableData = ref<Session[]>([]);

// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(data =>
    (!search.value.student_id || data.student_id.toLowerCase().includes(search.value.student_id.toLowerCase())) &&
    (!search.value.student_name || data.student_name.toLowerCase().includes(search.value.student_name.toLowerCase()))
  )
)

</script>

<style scoped></style>
