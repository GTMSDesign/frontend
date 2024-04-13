<template>

  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="标题">
      <el-input v-model="search.title" placeholder="Type to search" clearable />
    </el-form-item>
    <el-form-item label="指导老师">
      <el-input v-model="search.teacher_name" placeholder="Type to search" clearable />
    </el-form-item>
    <el-form-item label="学生">
      <el-input v-model="search.student_name" placeholder="Type to search" clearable />
    </el-form-item>
  </el-form>


  <el-table :data="filterTableData" style="width: 100%" stripe height="550"
    :header-cell-style="{ backgroundColor: '#E9D0F3' }">
    <el-table-column label="论文标题" prop="title"></el-table-column>
    <el-table-column label="论文ID" prop="thesis_id"></el-table-column>
    <el-table-column label="学生姓名" prop="student_name"></el-table-column>
    <el-table-column label="学生学号" prop="student_id"></el-table-column>
    <el-table-column label="导师姓名" prop="teacher_name"></el-table-column>
    <el-table-column label="导师ID" prop="teacher_id"></el-table-column>
    <el-table-column label="论文状态" prop="status">
      <template #default="scope">
        <el-tag type="primary" disable-transitions>{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="答辩次数" prop="defense_times"></el-table-column>
    <el-table-column align="center">
      <template #default="scope">
        <el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
        <el-button size="small" @click="handleDelete(scope.$index, scope.row)">下载</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { computed, ref, reactive} from 'vue'
import { allThesisTeacher } from '@/services/teacher';

const loading = ref(true)

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

const search = ref({
  title: '',
  teacher_name: '',
  student_name: '',
});
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.title.toLowerCase().includes(search.value.title.toLowerCase()) &&
      data.teacher_name.toLowerCase().includes(search.value.teacher_name.toLowerCase()) &&
      data.student_name.toLowerCase().includes(search.value.student_name.toLowerCase())
  )
)
const handleEdit = (index: number, row: Thesis) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: Thesis) => {
  console.log(index, row)
}

const tableData: Thesis[] = [
  {
    title: '原神高等元素论研究1',
    thesis_id: '1141',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游1',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  },
  {
    title: '原神高等元素论研究2',
    thesis_id: '1142',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游2',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, 
  {
    title: '原神高等元素论研究1',
    thesis_id: '114',
    student_name: '原神高手3',
    student_id: '260398640',
    teacher_name: '米哈游3',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, 
  {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游1',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }
]
</script>
<style scoped></style>