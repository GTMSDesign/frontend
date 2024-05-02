<template>
    <div>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="导师ID">
        <el-input v-model="search.teacher_id" placeholder="输入导师ID以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
      <el-form-item label="导师姓名">
        <el-input v-model="search.teacher_name" placeholder="输入导师姓名以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
    </el-form>
  
    <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
      :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'session_id', order: 'descending' }">
      <el-table-column label="会话ID" prop="session_id" align="center" sortable></el-table-column>
      <el-table-column label="导师姓名" prop="teacher_name" align="center"></el-table-column>
      <el-table-column label="导师ID" prop="teacher_id" align="center"></el-table-column>
      <el-table-column label="会话时间" prop="session_time" align="center" sortable></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <SessionInfo :session_id="row.session_id" :target_id="row.teacher_id" />
        </template>
      </el-table-column>
    </el-table>
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { getSessionByStudentId } from '@/services/session'; // 导入获取会话的方法
  import { getTeacherNameById } from '@/services/teacher';
  import { Search } from '@element-plus/icons-vue'
  import SessionInfo from '@/views/session/SessionInfo.vue'
  
  // 使用ref创建响应式变量
  const loading = ref(true)
  const search = ref({
    teacher_id: '',
    teacher_name: '',
  });
  
  interface Session {
    session_id: string
    teacher_id: string
    teacher_name: string
    session_time: string
  }
  
  const fetchData = async () => {
    try {
      const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
      const data = await getSessionByStudentId(account); // 调用获取教师相关会话的方法，并传入参数
  
      // 循环遍历会话数据，获取每个会话的教师姓名
      const sessionsWithNames = await Promise.all(data.map(async (item: any) => {
        const teacherName = await getTeacherNameById(item.teacherId);
        return {
          session_id: item.sessionId,
          teacher_id: item.teacherId,
          teacher_name: teacherName, // 添加教师姓名到会话数据中
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
      (!search.value.teacher_id || data.teacher_id.toLowerCase().includes(search.value.teacher_id.toLowerCase())) &&
      (!search.value.teacher_name || data.teacher_name.toLowerCase().includes(search.value.teacher_name.toLowerCase()))
    )
  )
  
  </script>
  
  <style scoped></style>
  