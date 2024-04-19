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
            教师姓名
          </div>
        </template>
        <el-input
          v-model="dialogTableData.teacherName"
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
            教师ID
          </div>
        </template>
        <el-input
          v-model="dialogTableData.teacherId"
          placeholder="请输入"
          disabled
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
              <Message />
            </el-icon>
            电子邮箱
          </div>
        </template>
        <el-input
          v-model="dialogTableData.email"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <OfficeBuilding />
            </el-icon>
            职称
          </div>
        </template>
        <el-input
          v-model="dialogTableData.title"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <OfficeBuilding />
            </el-icon>
            学历
          </div>
        </template>
        <el-input
          v-model="dialogTableData.education"
          placeholder="请输入"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <OfficeBuilding />
            </el-icon>
            类别
          </div>
        </template>
        <el-select
          v-model="dialogTableData.category"
          style="width: 100px"
          placeholder="请选择"
        >
          <el-option label="校内" value="校内" />
          <el-option label="校外" value="校外" />
        </el-select>
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
import { getUnenteredTeachers, submitTeacherPO } from "@/services/registrar"; // 导入获取学生的方法
import { Search } from "@element-plus/icons-vue";

interface Student {
  account: string;
  name: string;
  power: string;
}
interface teacherInfo {
  teacherId: string;
  teacherName: string;
  phone: string;
  officePhone: string;
  email: string;
  title: string;
  education: string;
  category: string;
}
const dialogVisible = ref(false);
const dialogTableData = ref<teacherInfo>({
  teacherId: "",
  teacherName: "",
  phone: "",
  officePhone: "",
  email: "",
  title: "",
  education: "",
  category: "",
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
    tableData.value = await getUnenteredTeachers(); // 更新 tableData
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
  dialogTableData.value.teacherName = row.name;
  dialogTableData.value.teacherId = row.account;
  dialogVisible.value = true;
};

// 使用ref创建响应式变量
const tableData = ref<Student[]>([]);

const cancel = () => {
  dialogTableData.value = {
    teacherId: "",
    teacherName: "",
    phone: "",
    officePhone: "",
    email: "",
    title: "",
    education: "",
    category: "",
  };

  dialogVisible.value = false;
};

const submit = async () => {
  await submitTeacherPO(dialogTableData.value);
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
