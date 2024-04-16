<template>
    <el-button type="primary" :icon="Download" @click="downloadFile">下载文件</el-button>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'


// 定义 Download 组件
const props = defineProps({
    id: String,
    type: String
});

const downloadFile = async () => {
    try {
        const response = await axios.get('http://localhost:8080/filetransfer/download', {
            headers: {
                token: sessionStorage.getItem("token"),
            },
            params: {
                id: props.id,
                type: props.type
            },
        });
        console.log(response.data.result);
        if (response.data.result === "Error") {
            ElMessage.error('该文件还未被上传');
        } else {
            window.open(response.data.result);
        }

        // // 解码 base64 字符串为字节数组
        // const byteArray = atob(response.data.result.body);
        // const byteNumbers = new Array(byteArray.length);
        // for (let i = 0; i < byteArray.length; i++) {
        //     byteNumbers[i] = byteArray.charCodeAt(i);
        // }
        // const uint8Array = new Uint8Array(byteNumbers);

        // // 创建一个Blob对象，表示服务器返回的文件数据
        // const blob = new Blob([uint8Array], { type: response.data.result.headers['Content-Type'] });

        // // 创建一个链接对象，指向Blob数据
        // const url = window.URL.createObjectURL(blob);

        // // 创建一个<a>元素，用于下载文件
        // const link = document.createElement('a');
        // link.href = url;
        // // 获取 Content-Disposition 字段的值
        // const contentDisposition = response.data.result.headers['Content-Disposition'];

        // // 通过正则表达式来提取 filename
        // const matches = /filename\s*=\s*["']?([^"';]+)/.exec(contentDisposition);
        // const filename = matches ? matches[1].trim() : '';

        // // 设置下载文件的文件名
        // link.setAttribute('download', filename);

        // document.body.appendChild(link);

        // // 模拟用户点击下载链接
        // link.click();

        // // 下载完成后，释放资源
        // window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('下载文件失败', error);
    }
};

</script>