<template>
  <el-dropdown @command="handleCommand" size="large" v-if="hasPermission()">
    <el-dropdown-item command="editProfile">个人中心</el-dropdown-item>
  </el-dropdown>

  <el-dialog v-model="dialogTeacherVisible" center title="个人信息" width="60%" :before-close="handleClose"
    :style="{ top: '0', left: '0' }" :append-to-body="true">
    <el-form ref="ruleFormRef" :model="data" :rules="rules" label-width="auto" class="demo-ruleForm" :size="formSize"
      status-icon>

      <!-- First row -->
      <el-row justify="center">
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="姓名">
            <el-input v-model="data.teacherName" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职工号">
            <el-input v-model="data.teacherId" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Second row -->
      <el-row justify="center">
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="电话" prop="phone">
            <el-input v-model.lazy="data.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="办公室电话">
            <el-input v-model="data.officePhone" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Third row -->
      <el-row justify="center">
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="data.email" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类别">
            <el-input v-model="data.category" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Fourth row -->
      <el-row justify="center">
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="学历">
            <el-input v-model="data.education" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职称">
            <el-input v-model="data.title" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- Button row -->
    <el-row justify="center">
      <el-button type="primary" @click="submitForm(ruleFormRef)" size="big">
        保存修改
      </el-button>
    </el-row>
  </el-dialog>



</template>


<style>
.button-container {
  text-align: center;
  margin-top: 20px;
}

.save-button {
  background-color: #8a2be2;
  /* Purple */
}
</style>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';
import { teacherInformation, updateEmail, updatePhone } from '@/services/teacher'


const hasPermission = () => {
  if(sessionStorage.getItem("role") == "ROLE_TEACHER"){
    return true
  }else {
    return false
  }
}











const dialogTeacherVisible = ref(false)
const handleCommand = (command: string | number | object) => {
  dialogTeacherVisible.value = true
}

const handleClose = (done: () => void) => {
  resetForm(ruleFormRef.value);
  fetchData();
  done()
}

interface RuleForm {
  teacherId: string
  teacherName: string
  phone: string//可编辑
  officePhone: string
  email: string//可编辑
  title: string
  education: string
  category: string
}

const data = ref<RuleForm>();
const fetchData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    const result = await teacherInformation(account);
    data.value = result; // 更新 tableData
  } catch (error) {
    console.error(error);
    // 处理错误
  }
}


// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});



const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  teacherId: '',
  teacherName: '',
  phone: '',
  officePhone: '',
  email: '',
  title: '',
  education: '',
  category: ''
})

const rules = reactive<FormRules<RuleForm>>({
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确电话号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮件地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确邮件地址', trigger: 'blur' }
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateData();
      dialogTeacherVisible.value = false;
    } else {
      ElMessage.error('提交失败!')
    }
  })
}

const updateData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    await updatePhone(data.value.phone, account);
    await updateEmail(data.value.email, account);
  } catch (error) {
    console.error(error);
    // 处理错误
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>

<style scoped>
</style>
