<template>
  <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
    <el-form-item label="账号">
      <el-input
        v-model="search.account"
        placeholder="Type to search"
        clearable
        :prefix-icon="Search"
      />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input
        v-model="search.name"
        placeholder="Type to search"
        clearable
        :prefix-icon="Search"
      />
    </el-form-item>
    <el-form-item>
     <el-button type="primary" @click="handleCreateButtonClick">新建账号</el-button>
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
    :default-sort="{ prop: 'account', order: 'increncing' }"
  >
    <el-table-column
      label="账号"
      prop="account"
      width="300"
    ></el-table-column>
    <el-table-column
      label="密码"
      prop="password"
      sortable
      align="center"
    ></el-table-column>
    <el-table-column
      label="姓名"
      prop="name"
      align="center"
    ></el-table-column>
    <el-table-column label="权限" prop="power" align="center">
      <template #default="scope">
        <el-tag type="primary" disable-transitions>{{
          getPowerLabel(scope.row.power)
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
      #default="scope"
      width="210px"
      fixed="right">
        <el-button
        link
        type="primary"
        size="small"
        @click="handleAccountButtonClick(scope.row)"
        >修改</el-button>
        <el-button
        link
        type="primary"
        size="small"
        @click="handleDeleteButtonClick(scope.row)"
        >删除</el-button>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="修改信息" width="40%" center>
    <hr size="4" color="#faf8f8" />
    <el-form :label-position="labelPosition">
      <el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="currentrow.account" style="width: auto" disabled="true"/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input
          v-model="currentrow.password"
          style="width: auto"
        />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input
          v-model="currentrow.name"
          style="width: auto"
        />
      </el-form-item>
      <el-form-item label="权限" :label-width="formLabelWidth">
    <el-select v-model="currentrow.power" placeholder="请选择权限" style="width: 100px;">
    <el-option
      v-for="(label, power) in powerLabels"
      :key="power"
      :label="label"
      :value="power"
    />
    </el-select>
    </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogCreateVisible" title="新建账号" width="40%" center>
    <hr size="4" color="#faf8f8" />
    <el-form :label-position="labelPosition">
      <el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="currentrow.account" style="width: auto"/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input
          v-model="currentrow.password"
          style="width: auto"
        />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input
          v-model="currentrow.name"
          style="width: auto"
        />
      </el-form-item>
      <el-form-item label="权限" :label-width="formLabelWidth">
    <el-select v-model="currentrow.power" placeholder="请选择权限" style="width: 100px;">
    <el-option
      v-for="(label, power) in powerLabels"
      :key="power"
      :label="label"
      :value="power"
    />
    </el-select>
    </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelCreate">取消</el-button>
        <el-button type="primary" @click="submitCreate"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="deleteDialogVisible"
    title="确认删除"
    width="40%"
    center
  >
    <span>确定要删除该条记录吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelDelete">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认删除 </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
//import reviewOpinion from "@/views/public/reviewOpinion.vue";
import { reactive, ref, computed, onMounted } from "vue";
import {
  getAllAccount,
  updateAccount,
  deleteByAccount,
  createAccount,
} from "@/services/admin"; // 导入获取教师相关论文的方法
import { Search } from "@element-plus/icons-vue";
import type { FormProps } from "element-plus";
import { ElMessage } from 'element-plus'

interface Accounts {
  account: string;
  password: string;
  name: string;
  power: string;
}
const deleteDialogVisible = ref(false);
const dialogVisible = ref(false);
const dialogCreateVisible = ref(false);
const formLabelWidth = "100px";
// 使用ref创建响应式变量
const loading = ref(true);
const search = ref({
  account: "",
  name: "",
});
const dialogFormVisible = ref(false);
const currentrow = ref<Accounts>({
  account: "",
  password: "",
  power: "",
  name: "",
});

const labelPosition = ref<FormProps["labelPosition"]>("left");


const handleCreateButtonClick = () => {
  currentrow.value.account = "";
  currentrow.value.password = "";
  currentrow.value.power = "";
  currentrow.value.name = "";
  dialogCreateVisible.value = true;
};

const cancelCreate = () => {
  currentrow.value.account = "";
  currentrow.value.password = "";
  currentrow.value.power = "";
  currentrow.value.name = "";
  dialogCreateVisible.value = false;
};

const submitCreate = async () => {
  try {
    const ifsuccess = await createAccount(currentrow.value.account,currentrow.value.password,currentrow.value.name,currentrow.value.power);
    if(ifsuccess == "创建失败！"){
      ElMessage.error('创建失败！')
    }else if(ifsuccess == "创建成功"){
      ElMessage.success({
            message: '创建成功',
            type: 'success',
          })
    }

    await fetchData();
  } catch (error) {
    console.log(error);
  }finally {
    cancelCreate();
  }
  cancel();
};


const delete_account = ref("");

const handleDeleteButtonClick = (row: Accounts) => {
  delete_account.value = row.account;
  deleteDialogVisible.value = true;
};

const cancelDelete = () => {
  delete_account.value = "";
  deleteDialogVisible.value = false;
};
const confirmDelete = async () => {
    try {
      await deleteByAccount(delete_account.value);
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      cancelDelete();
    }
  
};


const cancel = () => {
  dialogFormVisible.value = false;
  currentrow.value.account = "";
  currentrow.value.password = "";
  currentrow.value.power = "";
  currentrow.value.name = "";
};

const handleAccountButtonClick = (row: Accounts) => {
  currentrow.value.account = row.account;
  currentrow.value.password = row.password;
  currentrow.value.power = row.power;
  currentrow.value.name = row.name;
  dialogFormVisible.value = true;
};

const fetchData = async () => {
  try {
    const data = await getAllAccount(); 
    const logs: Accounts[] = data.map((item: any) => ({
      account: item.account,
      password: item.password,
      name: item.name,
      power: item.power,
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
const tableData = ref<Accounts[]>([]);


const submit = async () => {
  //提交结论
  try {
    await updateAccount(currentrow.value.account,currentrow.value.password,currentrow.value.name,currentrow.value.power);
    await fetchData();
  } catch (error) {
    console.log(error);
  }

  cancel();
};

const filterTableData = computed(() =>
  tableData.value.filter(data =>
    (!search.value.account || data.account.toLowerCase().includes(search.value.account.toLowerCase()))&&
    (!search.value.name || data.name.toLowerCase().includes(search.value.name.toLowerCase()))
  )
)

const powerLabels = {
  ADMIN: '管理员',
  TEACHER: '教师',
  STUDENT: '学生',
  REGISTRAR: '教务员'
};

// 计算属性，根据权限值返回对应的中文权限
const getPowerLabel = (power: string) => {
  return powerLabels[power] || '未知权限';
};

</script>

<style scoped>
/* Add any necessary styles */
.text-container {
  background-color: #f4f4f9; /* 浅灰色背景 */
  border-left: 5px solid #5b9bd5; /* 左侧有一个蓝色边框 */
  padding: 20px; /* 内部填充 */
  margin: 20px; /* 外部边距 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
}

.text-container p {
  color: #333; /* 深灰色文字 */
  font-family: "Arial", sans-serif; /* 使用Arial字体 */
  font-size: 16px; /* 字体大小 */
  line-height: 1.6; /* 行间距 */
  text-align: justify; /* 两端对齐文本 */
}
</style>
