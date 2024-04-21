<template>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="职工号">
      <el-input
        v-model="search.teacherId"
        placeholder="Type to search"
        clearable
        :prefix-icon="Search"
      />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input
        v-model="search.teacherName"
        placeholder="Type to search"
        clearable
        :prefix-icon="Search"
      />
    </el-form-item>
  </el-form>

  <el-table
    v-loading="loading"
    v-if="!loading"
    :data="filterTableData"
    style="width: 100%"
    stripe
    height="550"
    :header-cell-style="{ backgroundColor: '#E9D0F3' }"
    :default-sort="{ prop: 'thesis_id', order: 'increncing' }"
  >
    <el-table-column
      label="职工号"
      prop="teacherId"
      width="300"
      sortable
    ></el-table-column>
    <el-table-column
      label="姓名"
      prop="teacherName"
      align="center"
    ></el-table-column>
    <el-table-column
      label="学历"
      prop="education"
      align="center"
    ></el-table-column>
    <el-table-column
      label="类别"
      prop="category"
      align="center"
    ></el-table-column>
    <el-table-column label="职称" prop="title" align="center">
      <template #default="scope">
        <el-tag type="primary" disable-transitions>{{
          scope.row.title
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
      #default="scope"
      width="210px"
      fixed="right"
    >
      <el-button
        link
        type="primary"
        size="small"
        @click="handleReviewButtonClick(scope.row)"
        >分配学生</el-button
      >
      <el-button
        link
        type="primary"
        size="small"
        @click="handleButtonClick(scope.row)"
        >取消分配
    </el-button>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="分配学生" width="40%" center>
    <hr size="4" color="#faf8f8" />
    <el-transfer
    v-model="transferValue"
    :data="transferData"
    :titles="['待分配学生', '已分配学生']"
    >
  </el-transfer>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogStudentVisible" title="取消分配学生" width="40%" center>
    <hr size="4" color="#faf8f8" />
    <el-transfer
    v-model="assignmentValue"
    :data="assignmentData"
    :titles="['已分配学生', '待分配学生']"
    >
  </el-transfer>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelassign">取消</el-button>
        <el-button type="primary" @click="submitassign"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>



</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import {
  getAllTeacher,
  getAllStudent,
  submitAssignment,
  deleteAssignment,
} from "@/services/registrar"; 
import { getStudentByTeacherId } from '@/services/session';
import { Search } from "@element-plus/icons-vue";
import type { FormProps } from "element-plus";
import { ElMessage } from 'element-plus'
interface TeacherPO {
  teacherId: string;
  teacherName: string;
  phone: string;
  officePhone: string;
  email: string;
  title: string;
  education: string;
  category: string;
}
interface StudentPO {
  studentId: string;
  studentName: string;
  grade: string;
  phone: string;
  officePhone: string;
  homePhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  email1: string;
  email2: string;
  company: string;
  position: string;
  distribute: string;
  excellentCourses: number;
  goodCourses: number;
  fairCourses: number;
  passCourses: number;
}
interface Option {
  key: string
  label: string
}


const formLabelWidth = "100px";
// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  teacherId: "",
  teacherName: "",
});
const dialogFormVisible = ref(false);
const dialogStudentVisible = ref(false);
const labelPosition = ref<FormProps["labelPosition"]>("left");

const currentRowTeacherId = ref<string>("");

const cancel = () => {
  currentRowTeacherId.value = "";
  transferValue.value=[];
  fetchData();
  fetchAssignData();
  dialogFormVisible.value = false;
};
const cancelassign = () => {
  currentRowTeacherId.value = "";
  assignmentValue.value=[];
  fetchData();
  fetchAssignData();
  dialogStudentVisible.value = false;
};

const handleReviewButtonClick = (row: TeacherPO) => {
  currentRowTeacherId.value = row.teacherId
  dialogFormVisible.value = true;
};
const handleButtonClick = (row: TeacherPO) => {
  currentRowTeacherId.value = row.teacherId
  fetchAssignData();
  dialogStudentVisible.value = true;
};



const fetchData = async () => {
  try {
    const data = await getAllTeacher();
    const studentData = await getAllStudent();
    const teachers: TeacherPO[] = data.map((item: any) => ({
      teacherId: item.teacherId,
      teacherName: item.teacherName,
      phone: item.phone,
      officePhone: item.officePhone,
      email: item.email,
      title: item.title,
      education: item.education,
      category: item.category,
    }));
    const students: StudentPO[] = studentData.map((item: any) => ({
      studentId: item.studentId,
      studentName: item.studentName,
      grade: item.grade,
      phone: item.phone,
      officePhone: item.officePhone,
      homePhone: item.homePhone,
      emergencyContactName: item.emergencyContactName,
      emergencyContactPhone: item.emergencyContactPhone,
      email1: item.email1,
      email2: item.email2,
      company: item.company,
      position: item.position,
      distribute: item.distribute,
      excellentCourses: item.excellentCourses,
      goodCourses: item.goodCourses,
      fairCourses: item.fairCourses,
      passCourses: item.passCourses,
    }));
  
    allStudents.value = students;
    splitStudentsByDistribute(students);
    tableData.value = teachers; // 更新 tableData
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
const tableData = ref<TeacherPO[]>([]);
const allStudents = ref<StudentPO[]>([])
const distributeYesStudents = ref<StudentPO[]>([]);
const distributeNoStudents = ref<StudentPO[]>([]);
const transferData = ref<Option[]>([])
const transferValue = ref([])
const assignmentData = ref<Option[]>([])
const assignmentValue = ref([])


const fetchAssignData = async () => {
  try{
    const assignData = await getStudentByTeacherId(currentRowTeacherId.value);
    const assign_students: StudentPO[] = assignData.map((item: any) => ({
      studentId: item.studentId,
      studentName: item.studentName,
      grade: item.grade,
      phone: item.phone,
      officePhone: item.officePhone,
      homePhone: item.homePhone,
      emergencyContactName: item.emergencyContactName,
      emergencyContactPhone: item.emergencyContactPhone,
      email1: item.email1,
      email2: item.email2,
      company: item.company,
      position: item.position,
      distribute: item.distribute,
      excellentCourses: item.excellentCourses,
      goodCourses: item.goodCourses,
      fairCourses: item.fairCourses,
      passCourses: item.passCourses,
    }));
    
    const data0: Option[] =  assign_students.map((item: any) => ({
      key: item.studentId,
      label: item.studentId+" "+item.studentName
    }));
    
    // console.log(distributeNoStudents.value)
    assignmentData.value = data0
  }
  catch (error) {
    console.error(error);
  }
}




const submit = async () => {
  //提交结论
  try {
    transferValue.value.map(async (item:any) => {
      //console.log(item);
      await submitAssignment(item,currentRowTeacherId.value);
    });
    currentRowTeacherId.value = "";
    transferValue.value=[];
    fetchData();
    ElMessage.success("分配成功")
  } catch (error) {
    console.log(error);
  }
  cancel();
};
const submitassign = async () => {
  //提交结论
  try {
    assignmentValue.value.map(async (item:any) => {
      //console.log(item);
      await deleteAssignment(item,currentRowTeacherId.value);
    });
    ElMessage.success("删除分配成功")
  } catch (error) {
    console.log(error);
  }
  cancelassign();
};
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      (!search.value.teacherId ||
        data.teacherId.toLowerCase().includes(search.value.teacherId.toLowerCase())) &&
      (!search.value.teacherName ||
        data.teacherName
          .toLowerCase()
          .includes(search.value.teacherName.toLowerCase()))
  )
);

const splitStudentsByDistribute = (students: StudentPO[]) => {
  distributeYesStudents.value = students.filter(student => student.distribute === "是");
  distributeNoStudents.value = students.filter(student => student.distribute === "否");
  const data: Option[] =  distributeNoStudents.value.map((item: any) => ({
      key: item.studentId,
      label: item.studentId+" "+item.studentName
  }));
  transferData.value=data
};








</script>

<style scoped>
/* Add any necessary styles */
</style>
