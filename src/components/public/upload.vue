<template>
  <el-upload v-model:file-list="fileList" :headers="Headers" ref="upload" class="upload-demo"
    action="http://localhost:8080/filetransfer/upload" :limit="5" accept=".doc, .docx, .txt" :on-exceed="handleExceed"
    :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :auto-upload="false" drag :data="uploadForm">
    <template #trigger>
      <div class="el-upload__text">
        拖拽文件到此或<em>点击选择文件</em>
      </div>
    </template>
    <el-button class="ml-3" type="success" :icon="Upload" @click="submitUpload">
      确认上传
    </el-button>
    <template #tip>
      仅限 doc/docx 文件，确认上传之后不可删除，多次上传会覆盖先前文件
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps({
  id: String,
  type: String
});

const Headers = {
  token: sessionStorage.getItem('token')
}

const uploadForm = reactive({
    id: props.id,
    type: props.type
})

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

const handleSuccess = (response: any) => {
  // fileList.value.push({
  //   name:'temp',
  //   url: response.result,
  // })
  ElMessage.success('上传成功') // 显示上传成功提示
}

const handleRemove = () => {
  // ElMessage.success('移除成功') // 显示上传成功提示
}

const handleError = () => {
  ElMessage.error('上传失败') // 显示上传失败提示
}
</script>
