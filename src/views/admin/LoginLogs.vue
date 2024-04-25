<template>
  <div>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="登录账号">
        <el-input v-model="search.userAccount" placeholder="输入账号以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
      :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'id', order: 'increncing' }">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="登录账号" prop="userAccount" align="center"></el-table-column>
      <el-table-column label="登录IP" prop="ipAddress" align="center"></el-table-column>
      <el-table-column label="登录时间" prop="loginTime" sortable align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { allLoginLogs } from '@/services/admin'
import { Search } from '@element-plus/icons-vue'

interface LoginLogs {
  id: number
  userAccount: string
  loginTime: Date
  ipAddress: string
}

// 使用ref创建响应式变量
const loading = ref(true)
const search = ref({
  userAccount: '',
});

const fetchData = async () => {
  try {
    const data = await allLoginLogs();
    const logs: LoginLogs[] = data.map((item: any) => ({
      id: item.id,
      userAccount: item.userAccount,
      loginTime: item.loginTime,
      ipAddress: item.ipAddress,
    }));
    tableData.value = logs; // 更新 tableData
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
const tableData = ref<LoginLogs[]>([]);

// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(data =>
    (!search.value.userAccount || data.userAccount.toLowerCase().includes(search.value.userAccount.toLowerCase()))
  )
)

</script>

<style scoped></style>
