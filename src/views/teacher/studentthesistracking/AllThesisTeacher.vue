<template>
  <h1>nihao</h1>
  <el-table :data="filterTableData" style="width: 100%" stripe height="70%">
    <el-table-column label="论文标题" prop="title"></el-table-column>
    <el-table-column label="论文ID" prop="thesis_id"></el-table-column>
    <el-table-column label="学生姓名" prop="student_name"></el-table-column>
    <el-table-column label="学生学号" prop="student_id"></el-table-column>
    <el-table-column label="导师姓名" prop="teacher_name"></el-table-column>
    <el-table-column label="导师ID" prop="teacher_id"></el-table-column>
    <el-table-column label="论文状态" prop="status">
      <template #default="scope">
        <el-tag
          type="primary"
          disable-transitions
          >{{ scope.row.status }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column label="答辩次数" prop="defense_times"></el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  <h1>nihao333</h1>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

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

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.title.toLowerCase().includes(search.value.toLowerCase())
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
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  },
  {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  }, {
    title: '原神高等元素论研究',
    thesis_id: '114',
    student_name: '原神高手',
    student_id: '260398640',
    teacher_name: '米哈游',
    teacher_id: '514',
    status: '初步定稿',
    defense_times: '0',
  },
]
</script>
<style scoped>
</style>