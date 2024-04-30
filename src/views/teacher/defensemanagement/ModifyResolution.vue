<template>
  <div>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="答辩编号">
        <el-input v-model="search.defenseId" placeholder="请输入答辩编号以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
      <el-form-item label="答辩秘书">
        <el-input v-model="search.secretary" placeholder="请输入答辩秘书以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" v-if="!loading" :data="filterTableData" style="width: 100%" stripe height="550"
              :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'defenseId', order: 'increncing' }">
      <el-table-column label="答辩ID" prop="defenseId" sortable align="center"></el-table-column>
      <el-table-column label="论文ID" prop="thesisId" sortable align="center"></el-table-column>
      <el-table-column label="秘书" prop="secretary" align="center"></el-table-column>
      <el-table-column label="答辩主席" prop="teacher1" align="center"></el-table-column>
      <el-table-column label="答辩教师2" prop="teacher2" align="center"></el-table-column>
      <el-table-column label="答辩教师3" prop="teacher3" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <modifyDefense :defenseId="row.defenseId" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { allDefenseThesisTeacher1 } from '@/services/teacher'; // 导入获取教师相关论文的方法
import { Search } from '@element-plus/icons-vue'
import modifyDefense from '@/views/teacher/defensemanagement/modifyDefense.vue'

interface Thesis {
  defenseId: number
  thesisId: number
  secretary: string
  teacher1: string
  teacher2: string
  teacher3: string
  // status: string
}

// 使用ref创建响应式变量
const loading = ref(true)
const search = ref({
  defenseId: '',
  secretary: '',
});

const fetchData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    const data = await allDefenseThesisTeacher1(account); // 调用获取教师相关论文的方法，并传入参数
    console.log(data)
    const theses: Thesis[] = data.map((item: any) => ({
      defenseId: item.defenseId,
      thesisId: item.thesisId,
      secretary: item.secretary,
      teacher1: item.teacher1,
      teacher2: item.teacher2,
      teacher3: item.teacher3,
      // status: item.status,
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
  // console.log(row.thesis_id)
});

// 使用ref创建响应式变量
const tableData = ref<Thesis[]>([]);

// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
    tableData.value.filter(data =>
        (!search.value.defenseId || data.defenseId === parseInt(search.value.defenseId)) &&
        (!search.value.secretary || data.secretary.toLowerCase().includes(search.value.secretary.toLowerCase()))
    )
)

</script>

<style scoped></style>
