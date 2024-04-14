<template>
  <el-upload class="upload-demo" action="#" :http-request="uploadFile" :on-success="handleSuccess"
    :before-upload="beforeUpload">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ObsClient from 'esdk-obs-browserjs/src/obs'

const uploadObs = () => {
  // 创建ObsClient实例
  const obsClient = new ObsClient({
    access_key_id: 'LRJMKGBXMMTHZVAQHDZU', // 你的ak
    secret_access_key: 'JboaeRrJMOOF0Hf6bwxjLs2nke1obvZjZty04dUn', // 你的sk
    server: 'obs.cn-east-3.myhuaweicloud.com' // 你的endPoint
  });

  obsClient.putObject({
    Bucket: 'marweey', // 桶名
    Key: `${path.value}开题报告.doc`, // 路径 + 文件名
    SourceFile: (document.getElementById('input-file') as HTMLInputElement).files![0]
  }, (err: any, result: any) => {
    if (err) {
      console.error('Error-->' + err);
    } else {
      console.log('Status-->' + result.CommonMsg.Status);
    }
  });
};

const path = ref<string>('marweey/GTMSFile');
</script>
