<template>
  <!-- <el-button plain @click="dialogVisible = true">
      Click to open the Dialog
    </el-button> -->
  <!-- <el-dropdown @command="handleCommand" size="large">
      <el-dropdown-item command="editProfile">个人中心</el-dropdown-item>
    </el-dropdown> -->
  <el-button type="primary" plain @click="handleCommand">详情</el-button>

  <el-dialog v-model="dialogVisible" title="上传文件" width="60%" :before-close="handleClose" center :append-to-body="true">
    <Upload id="100001" type="resolution" />
    <Download id="20240001" type="opinion" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Upload from '@/components/public/upload.vue'
import Download from '@/components/public/download.vue'

const dialogVisible = ref(false)
const handleCommand = (command: string | number | object) => {
  dialogVisible.value = true
}

const handleClose = (done: () => void) => {
  // ElMessageBox.confirm('Are you sure to close this dialog?')
  //   .then(() => {
  //     done()
  //   })
  //   .catch(() => {
  //     // catch error
  //   })
  done()
}
</script>