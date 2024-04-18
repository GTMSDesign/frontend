<template>
  <el-button type="primary" plain @click="handleCommand">详情</el-button>

  <el-dialog v-model="dialogVisible" title="答辩详情" width="60%" :before-close="handleClose" center :append-to-body="true"
             align-center>
    <el-descriptions class="margin-top" :column="2" :size="size" border>
<!--  <el-form-->
<!--      ref="ruleFormRef"-->
<!--      style="max-width: 800px"-->
<!--      :model="ruleForm"-->
<!--      :rules="rules"-->
<!--      label-width="auto"-->
<!--      class="demo-ruleForm"-->
<!--      :size="formSize"-->
<!--      status-icon-->
<!--  >-->
    <el-form-item label="论文题目" prop="thesisId">
      <el-input v-model="ruleForm.thesisId" />
    </el-form-item>
    <el-form-item label="答辩结果" prop="state">
      <el-segmented v-model="ruleForm.state"  />
      <el-radio-group v-model="radio2">
        <el-radio-button label="通过" value="pass" />
        <el-radio-button label="暂缓通过" value="delay" />
        <el-radio-button label="不通过" value="fail" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="答辩附言" prop="defenseRemarks">
      <el-input v-model="ruleForm.defenseRemarks" rows="8" type="textarea" />
    </el-form-item>
    <el-form-item label="答辩附件" prop="csv">
      <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="3"
          :on-exceed="handleExceed"
      >
        <el-button type="primary">Click to upload</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="三个一评价" prop="review">
      <el-input v-model="ruleForm.review" rows="5" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">提 交</el-button>
      <el-button @click="resetForm(ruleFormRef)">重 写</el-button>
    </el-form-item>
<!--  </el-form>-->
    </el-descriptions>
  </el-dialog>
</template>


<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadProps, UploadUserFile} from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { saveThesisDefense } from '@/services/teacher'
const radio2 = ref('通过')

interface RuleForm {
  thesisId: string
  state: string
  defenseRemarks: string
  defenseUrl: string
  review: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  thesisId: '555',
  state: '',
  defenseRemarks: '',
  defenseUrl: '',
  review: '',
})

const rules = reactive<FormRules<RuleForm>>({
  thesisId: [
    { required: true, message: '请输入论文名称', trigger: 'blur' },
  ],
  defenseRemarks: [
    { required: true, message: '请输入答辩附言', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  try {
    console.log(ruleForm.thesisId, ruleForm.state, ruleForm.defenseRemarks, ruleForm.defenseUrl,ruleForm.review)
    await saveThesisDefense(ruleForm.thesisId, ruleForm.state, ruleForm.defenseRemarks, ruleForm.defenseUrl,ruleForm.review);
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


const fileList = ref<UploadUserFile[]>([
]) // 上传文件列表

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
      `The limit is 3, you selected ${files.length} files this time, add up to ${
          files.length + uploadFiles.length
      } totally`
  )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
      `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
      () => true,
      () => false
  )
}
</script>

