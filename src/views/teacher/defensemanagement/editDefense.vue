<template>
  <el-button type="primary" plain @click="handleCommand">详情</el-button>

  <el-dialog v-model="dialogVisible" title="答辩详情" width="60%" :before-close="handleClose" center :append-to-body="true"
             align-center>
<!--    <el-descriptions class="margin-top" :column="2" :size="size" border>-->
      <el-form
          ref="ruleFormRef"
          style="max-width: 800px"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >

      <el-form-item label="答辩ID" prop="defenseId">
        <el-input v-model="ruleForm.defenseId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="答辩结果" prop="state">
        <el-radio-group v-model="ruleForm.state" >
          <el-radio-button label="通过" value="pass" />
          <el-radio-button label="暂缓通过" value="delay" />
          <el-radio-button label="不通过" value="fail" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="答辩附言" prop="defenseRemarks">
        <el-input v-model="ruleForm.defenseRemarks" rows="8" type="textarea" />
      </el-form-item>
      <el-form-item label="答辩附件" prop="defenseId">
          <Upload :id="defenseId" type="defense" />
      </el-form-item>
      <el-form-item label="三个一评价" prop="review">
        <el-input v-model="ruleForm.review" rows="5" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提 交</el-button>
        <el-button @click="resetForm(ruleFormRef)">重 写</el-button>
      </el-form-item>
    </el-form>
<!--      </el-form>-->
<!--    </el-descriptions>-->
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { saveThesisDefense } from '@/services/teacher'
import Upload from '@/components/public/upload.vue'

const props = defineProps({
  defenseId: String,
});

// const ruleForm.state = ref('通过')
const dialogVisible = ref(false)
const handleCommand = (command: string | number | object) => {
  dialogVisible.value = true
}

const handleClose = (done: () => void) => {
  resetForm(ruleFormRef.value);
  // fetchData();
  done()
}

interface RuleForm {
  // defenseId: string
  defenseId: string
  state: string
  defenseRemarks: string
  defenseUrl: string
  review: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  // defenseId: props.defenseId,
  defenseId: props.defenseId || "",
  state: "pass",
  defenseRemarks: '',
  defenseUrl: '',
  review: '',
})

const rules = reactive<FormRules<RuleForm>>({
  // thesisId: [
  //   { required: true, message: '请输入论文名称', trigger: 'blur' },
  // ],
  defenseRemarks: [
    { required: true, message: '请输入答辩附言', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  try {
    console.log(ruleForm.defenseId, ruleForm.state, ruleForm.defenseRemarks, ruleForm.defenseUrl,ruleForm.review)
    await saveThesisDefense(ruleForm.defenseId, ruleForm.state, ruleForm.defenseRemarks, ruleForm.defenseUrl,ruleForm.review);
  } catch (error) {
    console.log(error);
  }
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))

</script>


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
