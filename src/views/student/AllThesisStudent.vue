<template>
  <div>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="论文标题">
        <el-input v-model="search.title" placeholder="输入论文标题以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
      <el-form-item label="导师姓名">
        <el-input v-model="search.teacher_name" placeholder="输入导师姓名以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleNewThesisButtonClick">新增论文</el-button>
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
      <el-table-column label="答辩次数" prop="defense_times" width="100" sortable align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <ThesisInfoStudent :thesis_id="row.thesis_id" />
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" title="新增论文" width="60%" center>
    <hr size="4" color="#faf8f8" />

    <el-descriptions class="margin-top" :column="1" :size="size" border>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Tickets />
            </el-icon>
            论文标题
          </div>
        </template>
        <el-input v-model="newThesisTitleData.title" placeholder="请输入" maxlength="100" show-word-limit type="textarea"
          :autosize="{ minRows: 1, maxRows: 3 }"></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            注意事项
          </div>
        </template>
        1、此处仅新增论文条目，开题报告等文件需另行提交 <br>
        2、不支持学生本人删除，如需删除请联系导师或教务员
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { allThesisStudent } from '@/services/student'; // 导入获取教师相关论文的方法
import { Search } from '@element-plus/icons-vue'
import ThesisInfoStudent from '@/views/student/ThesisInfoStudent.vue'
import { addNewThesis } from "@/services/student";
import { ElMessage } from 'element-plus';

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

interface newThesisTitle {
  title: string,
}
const newThesisTitleData = ref<newThesisTitle>({
  title: "",
});

const size = ref('default')
const dialogFormVisible = ref(false);

// 使用ref创建响应式变量
const loading = ref(true)
const search = ref({
  title: '',
  teacher_name: '',
});


const submit = async () => {
  //提交结论
  try {
    const studentId = sessionStorage.getItem("account");
    await addNewThesis(studentId || '', newThesisTitleData.value.title);
    await fetchData();
    ElMessage.success("成功新增论文")
  } catch (error) {
    console.log(error);
  }
  cancel();
};


const cancel = () => {
  newThesisTitleData.value.title = '';
  dialogFormVisible.value = false;
};

const handleNewThesisButtonClick = () => {
  dialogFormVisible.value = true;
};

const fetchData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    const data = await allThesisStudent(account); // 调用获取教师相关论文的方法，并传入参数
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
    (!search.value.teacher_name || data.teacher_name.toLowerCase().includes(search.value.teacher_name.toLowerCase()))
  )
)

const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})
</script>

<style scoped></style>
