<template>
  <div class="button-container">
    <div class="left-buttons">
      <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
        <el-form-item label="论文">
          <el-input v-model="search.title" placeholder="输入论文标题以搜索" clearable :prefix-icon="Search" style="width: 230px" />
        </el-form-item>
        <el-form-item label="内审老师">
          <el-input v-model="search.internalTeacher" placeholder="输入内审老师姓名以搜索" clearable :prefix-icon="Search"
            style="width: 230px" />
        </el-form-item>
        <el-form-item label="外审老师">
          <el-input v-model="search.externalTeacher" placeholder="输入外审老师姓名以搜索" clearable :prefix-icon="Search"
            style="width: 230px" />
        </el-form-item>
      </el-form>
    </div>
    <div class="right-buttons">
      <el-date-picker v-model="deadline" type="date" placeholder="选择截止日期" :disabled-date="disabledDate"
        style="width: 130px" />
      <el-button type="success" class="submitButton" @click="submit">提交</el-button>
    </div>
  </div>
  <div class="table-container">
    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterTableData" stripe height="500"
      :row-style="{ height: '50px' }" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'increncing' }" ref="thesisTableRef" @selection-change="selectThesis">
      <el-table-column type="selection" width="55" />
      <el-table-column label="论文标题" prop="title"></el-table-column>
      <el-table-column label="论文ID" prop="thesis_id" align="center"></el-table-column>
      <el-table-column label="学生姓名" prop="student_name" align="center"></el-table-column>
      <el-table-column label="学生学号" prop="student_id" align="center"></el-table-column>
    </el-table>
    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterInternalTeachers"
      :row-style="{ height: '50px' }" stripe border height="500" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'increncing' }" ref="internalTableRef"
      @selection-change="selectInternal">
      <el-table-column type="selection" width="55" />
      <el-table-column label="内审老师ID" prop="teacherId" align="center"></el-table-column>
      <el-table-column label="内审老师姓名" prop="teacherName" align="center"></el-table-column></el-table>
    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterExternalTeachers"
      :row-style="{ height: '50px' }" stripe border height="500" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'increncing' }" ref="externalTableRef"
      @selection-change="selectExternal">
      <el-table-column type="selection" width="55" />
      <el-table-column label="外审老师ID" prop="teacherId" align="center"></el-table-column>
      <el-table-column label="外审老师姓名" prop="teacherName" align="center"></el-table-column></el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import {
  getThesisByStatus,
  submitPlagiarismCheck,
  getInternalTeachers,
  getExternalTeachers,
  assignReview,
} from "@/services/registrar";
import { ElTable } from "element-plus";
interface Thesis {
  title: string;
  thesis_id: string;
  student_name: string;
  student_id: string;
  teacher_name: string;
  teacher_id: string;
  status: string;
  defense_times: string;
  proposal_url: string;
  thesis_url: string;
}

interface TeacherInf {
  teacherId: string;
  teacherName: string;
  phone: string;
  officePhone: string;
  email: string;
  title: string;
  education: string;
  category: string;
}
// 使用ref创建响应式变量
const loading = ref(true);
const thesisTableRef = ref<InstanceType<typeof ElTable>>();
const internalTableRef = ref<InstanceType<typeof ElTable>>();
const externalTableRef = ref<InstanceType<typeof ElTable>>();
const dialogFormVisible = ref(false);
const selectedInternal = ref("");
const selectedExternal = ref("");
let isSelecting = false;

const selectInternal = async (val: TeacherInf[]) => {
  if (isSelecting) return;
  isSelecting = true;
  if (val.length > 0) {
    const lastSelected = val[val.length - 1];
    internalTableRef.value!.clearSelection();
    if (selectedInternal.value !== lastSelected.teacherId) {
      internalTableRef.value!.toggleRowSelection(lastSelected, true);
      selectedInternal.value = lastSelected.teacherId;
    }
  } else {
    selectedInternal.value = "";
  }
  isSelecting = false;
  console.log(selectedInternal.value);
};

const selectExternal = async (val: TeacherInf[]) => {
  if (isSelecting) return;
  isSelecting = true;
  if (val.length > 0) {
    const lastSelected = val[val.length - 1];
    externalTableRef.value!.clearSelection();
    if (selectedExternal.value !== lastSelected.teacherId) {
      externalTableRef.value!.toggleRowSelection(lastSelected, true);
      selectedExternal.value = lastSelected.teacherId;
    }
  } else {
    selectedExternal.value = "";
  }
  isSelecting = false;
  console.log(selectedExternal.value);
  console.log(deadline.value);
};

const fetchData = async () => {
  try {
    const data = await getThesisByStatus("初步定稿");
    internalTeachers.value = await getInternalTeachers();
    externalTeachers.value = await getExternalTeachers();
    tableData.value = data; // 更新 tableData
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
  }
};

// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});

// 使用ref创建响应式变量
const deadline = ref("");
const tableData = ref<Thesis[]>([]);
const internalTeachers = ref<TeacherInf[]>([]);
const externalTeachers = ref<TeacherInf[]>([]);
const selectedThesis = ref<string[]>([]);
const selectThesis = (val: Thesis[]) => {
  selectedThesis.value = [];
  val.forEach((thesis) => {
    selectedThesis.value.push(thesis.thesis_id);
  });
  console.log(selectedThesis);
};
const search = ref({
  title: "",
  internalTeacher: "",
  externalTeacher: "",
});
const submit = async () => {
  if (selectedInternal.value === "" || selectedExternal.value === "") {
    alert("请选择老师");
    return;
  } else if (selectedThesis.value.length == 0) {
    alert("请选择要分配的论文！");
    return;
  } else if (deadline.value === "") {
    alert("请选择截止日期");
    return;
  }
  try {
    const date = new Date(deadline.value);
    const dateString = date
      .toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    await assignReview(
      selectedThesis.value,
      selectedInternal.value,
      selectedExternal.value,
      dateString
    );

    await fetchData();
  } catch (error) {
    console.log(error);
  }
};
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value.title ||
      data.title.toLowerCase().includes(search.value.title.toLowerCase())
  )
);

const filterExternalTeachers = computed(() =>
  externalTeachers.value.filter(
    (data) =>
      !search.value.externalTeacher ||
      data.teacherName
        .toLowerCase()
        .includes(search.value.externalTeacher.toLowerCase())
  )
);
const filterInternalTeachers = computed(() =>
  internalTeachers.value.filter(
    (data) =>
      !search.value.internalTeacher ||
      data.teacherName
        .toLowerCase()
        .includes(search.value.internalTeacher.toLowerCase())
  )
);
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now();
};
</script>

<style scoped>
/* Add any necessary styles */

.hr-dashed {
  border: 0;
  border-top: 1px dashed #a2a9b6;
}

.table-container {
  display: flex;
  justify-content: space-between;
}

.table-item {
  margin: 2px;
  /* 为表格之间添加一些间隔 */
  flex-grow: 0;
  /* 防止表格拉伸超过指定宽度 */
  flex-shrink: 0;
  /* 防止表格缩小于指定宽度 */
}

.table-item:first-child {
  flex-basis: 50%;
  /* 左边的表格更宽 */
}

.table-item:nth-child(2) {
  flex-basis: 25%;
}

.table-item:nth-child(3) {
  flex-basis: 25%;
}

.addButton {
  height: 35px;
  width: 75px;
  border: 2px solid #24b4fb;
  background-color: #24b4fb;
  border-radius: 0.7em;
  padding: 0.3em 0.4em 0.5em 0.2em;
  transition: all ease-in-out 0.2s;
  font-size: 15px;
}

.addButton span {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 450;
}

.addButton:hover {
  background-color: #0071e2;
}

.refreshButton {
  position: relative;
  width: 75px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 2px solid #24b4fb;
  border-radius: 0.7em;
  background-color: #24b4fb;
  overflow: hidden;
}

.refreshButton,
.button__icon,
.button__text {
  transition: all 0.3s;
}

.refreshButton .button__text {
  transform: translateX(16px);
  color: #fff;
  font-weight: 450;
  font-size: 15px;
}

.refreshButton .button__icon {
  position: absolute;
  transform: translateX(100px);
  height: 100%;
  width: 39px;
  background-color: #0078e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refreshButton .svg {
  width: 20px;
  fill: #fff;
}

.refreshButton:hover {
  background: #0078e8;
}

.refreshButton:hover .button__text {
  color: transparent;
}

.refreshButton:hover .button__icon {
  width: 30px;
  transform: translateX(15px);
}

.refreshButton:active .button__icon {
  background-color: #006cd0;
}

.refreshButton:active {
  border: 1px solid #006cd0;
}

.button-container {
  display: flex;
  height: 50px;
  justify-content: space-between;
}

/* .button-container .addButton,
.button-container .refreshButton,
.submitButton {
  margin: 5px;
} */
.submitButton {
  height: 35px;
  width: 75px;
  font-size: 15px;
  border-radius: 0.7em;
  padding: 0.8em 0.4em 0.5em 0.4em;
}

.left-buttons {
  display: flex;
  /* 确保左侧按钮紧挨在一起 */
}

.right-buttons {
  display: flex;
}

.right-buttons>* {
  margin-left: 15px;
  /* 为每个子元素左侧添加10px的外边距 */
}
</style>
