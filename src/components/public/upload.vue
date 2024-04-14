<template>
  <el-upload
    v-model:file-list="fileList"
    :headers="Headers"
    ref="upload"
    class="upload-demo"
    action="http://localhost:8080/teacher/upload"
    :limit="5"
    accept=".doc, .docx"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-remove="handleRemove"
    :auto-upload="false"
    drag
  >
    <template #trigger>
      <div class="el-upload__text">
        Drop file here or <em>click to select file</em>
      </div>
    </template>
    <el-button class="ml-3" type="success" @click="submitUpload">
      upload to server
    </el-button>
    <template #tip>
        limit doc/docx file
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { RefSymbol } from '@vue/reactivity';

const Headers = {
        token: sessionStorage.getItem('token')
      }

const fileList = ref<UploadUserFile[]>([
  // {
  //   name: 'element-plus-logo.svg',
  //   url: 'https://element-plus.org/images/element-plus-logo.svg',
  // },
])

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  // upload.value!.clearFiles()
  // const file = files[0] as UploadRawFile
  // file.uid = genFileId()
  // upload.value!.handleStart(file)
}

const submitUpload = () => {
  upload.value!.submit()
}

const handleSuccess = (response:any) => {
  // fileList.value.push({
  //   name:'temp',
  //   url: response.result,
  // })
  ElMessage.success('Upload succeeded') // 显示上传成功提示
}

const handleRemove = () => {
  // fileList.value.push({
  //   name:'temp',
  //   url: response.result,
  // })
  ElMessage.success('succeeded') // 显示上传成功提示
}

const handleError = () => {
  ElMessage.error('Upload failed') // 显示上传失败提示
}
</script>
