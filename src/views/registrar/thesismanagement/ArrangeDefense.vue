<template>
  <div class="button-container">
    <div class="left-buttons">
      <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
        <el-form-item>
          <el-input v-model="search.title" placeholder="输入论文标题以搜索" clearable :prefix-icon="Search"
            style="width: 230px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="dynamicModel" placeholder="输入老师姓名以搜索" clearable :prefix-icon="Search" style="width: 260px"
            class="input-with-select">
            <template #prepend>
              <el-select v-model="selectedOption" placeholder="评委" style="width: 85px">
                <el-option label="秘书" value="secretary" />
                <el-option label="评委1" value="teacher1" />
                <el-option label="评委2" value="teacher2" />
                <el-option label="评委3" value="teacher3" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReset">重置搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="place" placeholder="输入答辩地点" clearable :prefix-icon="Location" style="width: 230px" />
        </el-form-item>
      </el-form>
    </div>
    <div class="right-buttons">
      <el-date-picker v-model="deadline" type="date" placeholder="选择答辩日期" :disabled-date="disabledDate"
        style="width: 130px" />
      <el-button type="success" @click="submit">提交</el-button>
    </div>
  </div>

  <div class="table-container">
    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterTableData" stripe height="500"
      :row-style="{ height: '50px' }" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'ascending' }" ref="thesisTableRef" @selection-change="selectThesis">
      <el-table-column type="selection" width="35" />
      <el-table-column label="论文标题" prop="title"></el-table-column>
      <el-table-column label="论文ID" prop="thesis_id" align="center" width="85"></el-table-column>
      <!-- <el-table-column label="学生姓名" prop="student_name" align="center"></el-table-column>
      <el-table-column label="学生学号" prop="student_id" align="center"></el-table-column> -->
    </el-table>

    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterSecretary"
      :row-style="{ height: '50px' }" stripe border height="500" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'ascending' }" ref="secretaryTableRef"
      @selection-change="selectSecretary">
      <el-table-column type="selection" width="35" />
      <el-table-column label="秘书ID" prop="teacherId" align="center"></el-table-column>
      <el-table-column label="秘书姓名" prop="teacherName" align="center"></el-table-column></el-table>

    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterTeacher1"
      :row-style="{ height: '50px' }" stripe border height="500" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'ascending' }" ref="teacher1TableRef"
      @selection-change="selectTeacher1">
      <el-table-column type="selection" width="35" />
      <el-table-column label="评委ID 1" prop="teacherId" align="center"></el-table-column>
      <el-table-column label="评委姓名 1" prop="teacherName" align="center"></el-table-column></el-table>

    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterTeacher2"
      :row-style="{ height: '50px' }" stripe border height="500" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'ascending' }" ref="teacher2TableRef"
      @selection-change="selectTeacher2">
      <el-table-column type="selection" width="35" />
      <el-table-column label="评委ID 2" prop="teacherId" align="center"></el-table-column>
      <el-table-column label="评委姓名 2" prop="teacherName" align="center"></el-table-column></el-table>

    <el-table class="table-item" v-loading="loading" v-if="!loading" :data="filterTeacher3"
      :row-style="{ height: '50px' }" stripe border height="500" :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'thesis_id', order: 'ascending' }" ref="teacher3TableRef"
      @selection-change="selectTeacher3">
      <el-table-column type="selection" width="35" />
      <el-table-column label="评委ID 3" prop="teacherId" align="center"></el-table-column>
      <el-table-column label="评委姓名 3" prop="teacherName" align="center"></el-table-column></el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Search, Location } from "@element-plus/icons-vue";
import {
  getThesisByStatus,
  getAllTeacher,
  assignDefense,
} from "@/services/registrar";
import { ElMessage, ElTable } from "element-plus";
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
const secretaryTableRef = ref<InstanceType<typeof ElTable>>();
const teacher1TableRef = ref<InstanceType<typeof ElTable>>();
const teacher2TableRef = ref<InstanceType<typeof ElTable>>();
const teacher3TableRef = ref<InstanceType<typeof ElTable>>();
const dialogFormVisible = ref(false);
const selectedSecretary = ref("");
const selectedTeacher1 = ref("");
const selectedTeacher2 = ref("");
const selectedTeacher3 = ref("");
const place = ref("");
let isSelecting = false;

type SelectedOption = 'secretary' | 'teacher1' | 'teacher2' | 'teacher3';
const selectedOption = ref<SelectedOption>('secretary')
const dynamicModel = computed({
  get: () => search.value[selectedOption.value],
  set: (value) => { search.value[selectedOption.value] = value }
})

const handleReset = () => {
  search.value.title = '';
  selectedOption.value = 'secretary';
  search.value.secretary = '';
  search.value.teacher1 = '';
  search.value.teacher2 = '';
  search.value.teacher3 = '';
  ElMessage.success("重置成功")
}

const selectSecretary = async (val: TeacherInf[]) => {
  if (isSelecting) return;
  isSelecting = true;
  if (val.length > 0) {
    const lastSelected = val[val.length - 1];
    if (lastSelected.teacherId == selectedTeacher1.value || lastSelected.teacherId == selectedTeacher2.value || lastSelected.teacherId == selectedTeacher3.value) {
      ElMessage.error("禁止选择重复的教师")
      secretaryTableRef.value!.toggleRowSelection(lastSelected, false);
      isSelecting = false;
      return;
    }
    secretaryTableRef.value!.clearSelection();
    if (selectedSecretary.value !== lastSelected.teacherId) {
      secretaryTableRef.value!.toggleRowSelection(lastSelected, true);
      selectedSecretary.value = lastSelected.teacherId;
    }
  } else {
    selectedSecretary.value = "";
  }
  isSelecting = false;
};

const selectTeacher1 = async (val: TeacherInf[]) => {
  if (isSelecting) return;
  isSelecting = true;
  if (val.length > 0) {
    const lastSelected = val[val.length - 1];
    if (lastSelected.teacherId == selectedSecretary.value || lastSelected.teacherId == selectedTeacher2.value || lastSelected.teacherId == selectedTeacher3.value) {
      ElMessage.error("禁止选择重复的教师")
      teacher1TableRef.value!.toggleRowSelection(lastSelected, false);
      isSelecting = false;
      return;
    }
    teacher1TableRef.value!.clearSelection();
    if (selectedTeacher1.value !== lastSelected.teacherId) {
      teacher1TableRef.value!.toggleRowSelection(lastSelected, true);
      selectedTeacher1.value = lastSelected.teacherId;
    }
  } else {
    selectedTeacher1.value = "";
  }
  isSelecting = false;
};

const selectTeacher2 = async (val: TeacherInf[]) => {
  if (isSelecting) return;
  isSelecting = true;
  if (val.length > 0) {
    const lastSelected = val[val.length - 1];
    if (lastSelected.teacherId == selectedSecretary.value || lastSelected.teacherId == selectedTeacher1.value || lastSelected.teacherId == selectedTeacher3.value) {
      ElMessage.error("禁止选择重复的教师")
      teacher2TableRef.value!.toggleRowSelection(lastSelected, false);
      isSelecting = false;
      return;
    }
    teacher2TableRef.value!.clearSelection();
    if (selectedTeacher2.value !== lastSelected.teacherId) {
      teacher2TableRef.value!.toggleRowSelection(lastSelected, true);
      selectedTeacher2.value = lastSelected.teacherId;
    }
  } else {
    selectedTeacher2.value = "";
  }
  isSelecting = false;
};

const selectTeacher3 = async (val: TeacherInf[]) => {
  if (isSelecting) return;
  isSelecting = true;
  if (val.length > 0) {
    const lastSelected = val[val.length - 1];
    if (lastSelected.teacherId == selectedSecretary.value || lastSelected.teacherId == selectedTeacher1.value || lastSelected.teacherId == selectedTeacher2.value) {
      ElMessage.error("禁止选择重复的教师")
      teacher3TableRef.value!.toggleRowSelection(lastSelected, false);
      isSelecting = false;
      return;
    }
    teacher3TableRef.value!.clearSelection();
    if (selectedTeacher3.value !== lastSelected.teacherId) {
      teacher3TableRef.value!.toggleRowSelection(lastSelected, true);
      selectedTeacher3.value = lastSelected.teacherId;
    }
  } else {
    selectedTeacher3.value = "";
  }
  isSelecting = false;
};


const fetchData = async () => {
  try {
    const data = await getThesisByStatus("答辩前定稿");
    const teacherInf = await getAllTeacher();
    teachers.value = teacherInf;
    secretary.value = teacherInf;
    teacher1.value = teacherInf;
    teacher2.value = teacherInf;
    teacher3.value = teacherInf;
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
const teachers = ref<TeacherInf[]>([]);
const secretary = ref<TeacherInf[]>([]);
const teacher1 = ref<TeacherInf[]>([]);
const teacher2 = ref<TeacherInf[]>([]);
const teacher3 = ref<TeacherInf[]>([]);
const selectedThesis = ref<string[]>([]);
const selectThesis = (val: Thesis[]) => {
  selectedThesis.value = [];
  val.forEach((thesis) => {
    selectedThesis.value.push(thesis.thesis_id);
  });
};
const search = ref({
  title: "",
  secretary: "",
  teacher1: "",
  teacher2: "",
  teacher3: "",
});

const submit = async () => {
  if (selectedSecretary.value === "" || selectedTeacher1.value === "" || selectedTeacher2.value === "" || selectedTeacher3.value === "") {
    ElMessage.error("请完整选择秘书及评委");
    return;
  } else if (selectedThesis.value.length == 0) {
    ElMessage.error("请选择要安排的论文");
    return;
  } else if (deadline.value === "") {
    ElMessage.error("请选择答辩日期");
    return;
  } else if (place.value === "") {
    ElMessage.error("请填写答辩地点")
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
    await assignDefense(
      selectedThesis.value,
      selectedSecretary.value,
      selectedTeacher1.value,
      selectedTeacher2.value,
      selectedTeacher3.value,
      place.value,
      dateString
    );

    await fetchData();
    ElMessage.success("提交成功")
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

// 定义四个独立的过滤结果变量
const filterSecretary = computed(() => {
  return secretary.value.filter(
    (data) =>
      !search.value.secretary ||
      data.teacherName.toLowerCase().includes(search.value.secretary.toLowerCase())
  );
});

const filterTeacher1 = computed(() => {
  return teacher1.value.filter(
    (data) =>
      !search.value.teacher1 ||
      data.teacherName.toLowerCase().includes(search.value.teacher1.toLowerCase())
  );
});

const filterTeacher2 = computed(() => {
  return teacher2.value.filter(
    (data) =>
      !search.value.teacher2 ||
      data.teacherName.toLowerCase().includes(search.value.teacher2.toLowerCase())
  );
});

const filterTeacher3 = computed(() => {
  return teacher3.value.filter(
    (data) =>
      !search.value.teacher3 ||
      data.teacherName.toLowerCase().includes(search.value.teacher3.toLowerCase())
  );
});



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

}

.table-item {
  margin: 1px;
  /* 为表格之间添加一些间隔 */
  flex-grow: 0;
  /* 防止表格拉伸超过指定宽度 */
  flex-shrink: 0;
  /* 防止表格缩小于指定宽度 */
}

.table-item:first-child {
  flex-basis: 26%;
  /* 左边的表格更宽 */
}

.table-item:nth-child(2) {
  flex-basis: 18.5%;
}

.table-item:nth-child(3) {
  flex-basis: 18.5%;
}

.table-item:nth-child(4) {
  flex-basis: 18.5%;
}

.table-item:nth-child(5) {
  flex-basis: 18.5%;
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
