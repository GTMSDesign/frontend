<template>
    <div>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="教师id">
        <el-input v-model="search.teacher_id" placeholder="输入教师id搜索" clearable :prefix-icon="Search" />
      </el-form-item>
      <el-form-item label="教师姓名">
        <el-input v-model="search.teacher_name" placeholder="输入姓名搜索" clearable :prefix-icon="Search" />
      </el-form-item>
    </el-form>
  
    <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
      :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'teacher_id', order: 'increncing' }">
      <el-table-column label="教师姓名" prop="teacher_name" align="center"></el-table-column>
      <el-table-column label="教师id" prop="teacher_id" sortable align="center"></el-table-column>
      <el-table-column label="办公电话" prop="office_phone" align="center"></el-table-column>
      <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <SessionForm :targetId="row.teacher_id" :targetName="row.teacher_name"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { getTeacherByStudentId } from '@/services/session'; // 导入获取学生的方法
  import { Search } from '@element-plus/icons-vue'
  import SessionForm from '@/views/session/SessionForm.vue'
  
  interface Teacher {
    teacher_id: string
    teacher_name: string
    office_phone: string
    phone: string
    email: string
  }
  
  // 使用ref创建响应式变量
  const loading = ref(true)
  const search = ref({
    teacher_id: '',
    teacher_name: '',
  });
  
  const fetchData = async () => {
    try {
      const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
      const data = await getTeacherByStudentId(account); // 调用获取教师的方法，并传入参数
      const teacher: Teacher[] = data.map((item: any) => ({
        teacher_name: item.teacherName,
        teacher_id: item.teacherId,
        office_phone: item.officePhone,
        phone: item.phone,
        email: item.email,
      }));
      tableData.value = teacher; // 更新 tableData
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
  const tableData = ref<Teacher[]>([]);
  
  // 计算属性，根据搜索条件过滤表格数据
  const filterTableData = computed(() =>
    tableData.value.filter(data =>
      (!search.value.teacher_id || data.teacher_id.toLowerCase().includes(search.value.teacher_id.toLowerCase())) &&
      (!search.value.teacher_name || data.teacher_name.toLowerCase().includes(search.value.teacher_name.toLowerCase()))
    )
  )
  
  </script>
  
  <style scoped></style>
  