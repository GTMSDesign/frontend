<template>
  <div>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="账户">
        <el-input
          v-model="search.account"
          placeholder="输入账户搜索"
          clearable
          :prefix-icon="Search"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          v-model="search.name"
          placeholder="输入姓名搜索"
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
      border
      height="550"
      :header-cell-style="{ backgroundColor: '#E9D0F3' }"
      :default-sort="{ prop: 'student_id', order: 'increncing' }"
    >
      <el-table-column
        label="序号"
        sortable
        align="center"
        type="index"
        width="100px"
      ></el-table-column>
      <el-table-column
        label="账户"
        prop="account"
        sortable
        align="center"
      ></el-table-column>
      <el-table-column
        label="姓名"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column label="权限" prop="status" align="center">
        <template #default="scope">
          <el-tag type="primary" disable-transitions>{{
            scope.row.power
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" #default="scope">
        <el-button type="primary" plain @click="openDialog(scope.row)"
          >录入信息</el-button
        >
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="信息录入"
    width="60%"
    :before-close="handleClose"
    center
    :append-to-body="true"
    align-center
  >
    <el-descriptions class="margin-top" :column="2" :size="size" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            学生姓名
          </div>
        </template>
        <el-input
          v-model="dialogTableData.studentName"
          placeholder="请输入"
          disabled
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Location />
            </el-icon>
            学生学号
          </div>
        </template>
        <el-input
          v-model="dialogTableData.studentId"
          placeholder="请输入"
          disabled
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            班级
          </div>
        </template>
        <el-input
          v-model="dialogTableData.grade"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Iphone />
            </el-icon>
            电话
          </div>
        </template>
        <el-input
          v-model="dialogTableData.phone"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Iphone />
            </el-icon>
            办公电话
          </div>
        </template>
        <el-input
          v-model="dialogTableData.officePhone"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Iphone />
            </el-icon>
            家庭电话
          </div>
        </template>
        <el-input
          v-model="dialogTableData.homePhone"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <WarningFilled />
            </el-icon>
            紧急联系人
          </div>
        </template>
        <el-input
          v-model="dialogTableData.emergencyContactName"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <WarningFilled />
            </el-icon>
            紧急联系电话
          </div>
        </template>
        <el-input
          v-model="dialogTableData.emergencyContactPhone"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Message />
            </el-icon>
            电子邮箱1
          </div>
        </template>
        <el-input
          v-model="dialogTableData.email1"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Message />
            </el-icon>
            电子邮箱2
          </div>
        </template>
        <el-input
          v-model="dialogTableData.email2"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <OfficeBuilding />
            </el-icon>
            实习/工作单位
          </div>
        </template>
        <el-input
          v-model="dialogTableData.company"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <OfficeBuilding />
            </el-icon>
            职务
          </div>
        </template>
        <el-input
          v-model="dialogTableData.position"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Tickets />
            </el-icon>
            优秀课程数
          </div>
        </template>
        <el-input-number
          v-model="dialogTableData.excellentCourses"
          placeholder="请输入"
          :min="0"
        ></el-input-number>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Tickets />
            </el-icon>
            良好课程数
          </div>
        </template>
        <el-input-number
          v-model="dialogTableData.goodCourses"
          placeholder="请输入"
          :min="0"
        ></el-input-number>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Tickets />
            </el-icon>
            中等课程数
          </div>
        </template>
        <el-input-number
          :min="0"
          v-model="dialogTableData.fairCourses"
          placeholder="请输入"
        ></el-input-number>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Tickets />
            </el-icon>
            通过课程数
          </div>
        </template>
        <el-input-number
          v-model="dialogTableData.passCourses"
          placeholder="请输入"
          :min="0"
        ></el-input-number>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Tickets />
            </el-icon>
            是否分配
          </div>
        </template>
        <el-input
          v-model="dialogTableData.distribute"
          placeholder="请输入"
          disabled
        ></el-input>
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
import { ref, computed, onMounted } from "vue";
import { getUnenteredStudents, submitStudentPO } from "@/services/registrar"; // 导入获取学生的方法
import { Search } from "@element-plus/icons-vue";
import StudentInfo from "@/views/public/studentInfo.vue";

interface Student {
  account: string;
  name: string;
  power: string;
}
interface dialogDate {
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
const dialogVisible = ref(false);
const dialogTableData = ref<dialogDate>({
  studentId: "",
  studentName: "",
  grade: "",
  phone: "",
  officePhone: "",
  homePhone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  email1: "",
  email2: "",
  company: "",
  position: "",
  distribute: "否",
  excellentCourses: 0,
  goodCourses: 0,
  fairCourses: 0,
  passCourses: 0,
});

const handleClose = (done: () => void) => {
  done();
};
const size = ref("default");
const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px",
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  };
});
// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  account: "",
  name: "",
});

const fetchData = async () => {
  try {
    tableData.value = await getUnenteredStudents(); // 更新 tableData
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
    // 处理错误
  }
};

// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});
const openDialog = (row: Student) => {
  dialogTableData.value.studentName = row.name;
  dialogTableData.value.studentId = row.account;
  dialogVisible.value = true;
};

// 使用ref创建响应式变量
const tableData = ref<Student[]>([]);

const cancel = () => {
  dialogTableData.value = {
    studentId: "",
    studentName: "",
    grade: "",
    phone: "",
    officePhone: "",
    homePhone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    email1: "",
    email2: "",
    company: "",
    position: "",
    distribute: "否",
    excellentCourses: 0,
    goodCourses: 0,
    fairCourses: 0,
    passCourses: 0,
  };

  dialogVisible.value = false;
};

const submit = async () => {
  await submitStudentPO(dialogTableData.value);
  await fetchData();
  cancel();
};
// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      (!search.value.account ||
        data.account
          .toLowerCase()
          .includes(search.value.account.toLowerCase())) &&
      (!search.value.name ||
        data.name.toLowerCase().includes(search.value.name.toLowerCase()))
  )
);
</script>

<style scoped></style>
