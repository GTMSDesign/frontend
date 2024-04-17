<template>
  <el-dropdown @command="handleCommand" size="large">
    <el-dropdown-item command="editProfile">个人中心</el-dropdown-item>
  </el-dropdown>

  <el-dialog v-model="dialogVisible" title="个人信息" width="60%" :before-close="handleClose" :style="{ top: '0', left: '0' }" :append-to-body="true">
  <el-form ref="ruleFormRef" :model="data" :rules="rules" label-width="auto" class="demo-ruleForm" :size="formSize" status-icon>

      <!-- First row -->
      <el-row>
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="姓名" >
            <el-input v-model="data.teacherName" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职工号" >
            <el-input v-model="data.teacherId" disabled="true"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Second row -->
      <el-row>
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="电话" prop="phone">
            <el-input v-model.lazy="data.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="办公室电话" >
            <el-input v-model="data.officePhone" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Third row -->
      <el-row>
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
      <el-row>
        <el-col :span="8" style="margin-right: 20px;">
          <el-form-item label="学历">
            <el-input v-model="data.education" disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职称">
            <el-input v-model="data.title" disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Button row -->
      <el-form-item class="button-container">
        <el-button type="primary" class="save-button" @click="submitForm(ruleFormRef)">
          保存修改
        </el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>


<style>
  .button-container {
    text-align: center;
    margin-top: 20px;
  }

  .save-button {
    background-color: #8a2be2; /* Purple */
  }
</style>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { teacherInformation, updateEmail, updatePhone } from '@/services/teacher'

const dialogVisible = ref(false)
const handleCommand = (command: string | number | object) => {
  dialogVisible.value = true
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
  teacherId: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  teacherName: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: 'Please input Phone', trigger: 'blur' },
  ],
  officePhone: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please input Email', trigger: 'blur' },
  ],
  title: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  education: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  category: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],

  /** teacher_name: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  phone: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],**/
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateData();
      console.log(data.value.phone)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const updateData = async () => {
  try {
    const account = sessionStorage.getItem('account') || ''; // 获取 sessionStorage 中的 account
    await updatePhone(data.value.phone,account); 
    await updateEmail(data.value.email,account);
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
