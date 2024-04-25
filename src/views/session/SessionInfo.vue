<template>
  <el-button type="primary" plain @click="handleCommand">会话详情</el-button>

  <el-dialog v-model="dialogVisible" title="会话详情" width="80%" :before-close="handleClose" center :append-to-body="true"
    align-center>
    <el-form :inline="true" :model="search" class="demo-form-inline" id="input">
      <el-form-item label="标题">
        <el-input v-model="search.title" placeholder="输入标题以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
      <el-form-item label="附言">
        <el-input v-model="search.remarks" placeholder="输入附言以搜索" clearable :prefix-icon="Search" />
      </el-form-item>
    </el-form>

    <el-table :data="filterTableData" style="width: 100%" stripe height="350"
      :header-cell-style="{ backgroundColor: '#E9D0F3' }" :default-sort="{ prop: 'messageTime', order: 'increncing' }"
      border>
      <el-table-column label="标题" prop="title" align="center"></el-table-column>
      <!-- <el-table-column label="发起人" prop="student_id" sortable align="center"></el-table-column> -->
      <el-table-column label="消息时间" prop="messageTime" align="center" width="300"></el-table-column>
      <el-table-column label="附言" prop="remarks" align="center" type="expand" width="100">
        <template #default="props">
          <div class="card-container">
            <el-card style="width: 90%;">
              <p class="text item" style="font-size: 17px;">{{ props.row.remarks }}</p>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-button type="primary" @click="handleDownload(row.messageUrl)">下载附件</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-descriptions class="margin-top" :column="1" :size="size" border>
      <el-descriptions-item>
          <template #label>
              <div class="cell-item">
                  <el-icon :style="iconStyle">
                      <Tickets />
                  </el-icon>
                  回复标题
              </div>
          </template>
          <el-input v-model="sessionMessageTableData.title" placeholder="请输入" maxlength="100" show-word-limit
              type="textarea" :autosize="{ minRows: 1, maxRows: 3 }"></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
          <template #label>
              <div class="cell-item">
                  <el-icon :style="iconStyle">
                      <Message />
                  </el-icon>
                  回复附言
              </div>
          </template>
          <el-input v-model="sessionMessageTableData.remarks" maxlength="5000" placeholder="请输入" show-word-limit
              type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" />
      </el-descriptions-item>

      <el-descriptions-item>
          <template #label>
              <div class="cell-item">
                  <el-icon :style="iconStyle">
                      <Link />
                  </el-icon>
                  回复附件
              </div>
          </template>

          <el-form-item :label-width="formLabelWidth">
            <el-upload
              ref="upload"
              :limit="1"
              :on-exceed="handleExceed"
              :auto-upload="false"
              :on-change="change"
            >
              <template #trigger>
                <el-button type="success">选择文件</el-button>
              </template>
    
              <template #tip>
                确认上传之后不可删除，多次上传会覆盖先前文件
              </template>
            </el-upload>
          </el-form-item>
      </el-descriptions-item>
  </el-descriptions>
  <template #footer>
      <div class="dialog-footer">
          <el-button type="primary" @click="submit" :loading="loading"> 提交 </el-button>
          <el-button @click="cancel">取消</el-button>
      </div>
  </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getSessionMessage, uploadFile } from '@/services/session'; // 导入获取学生的方法
import { ElMessage } from 'element-plus';
import { submitSessionMessageVO } from '@/services/session';
import { sendEmail } from "@/services/teacher";
import type { FormProps, UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { genFileId } from "element-plus";

const props = defineProps({
  session_id: {
        type: String,
        default: "000"
    },
  target_id: {
        type: String,
        default: "000"
    },
});

interface sessionMessageData {
    sessionId: string,
    title: string,
    remarks: string,
}

const sessionMessageTableData = ref<sessionMessageData>({
    sessionId: "",
    title: "",
    remarks: "",
});
const formLabelWidth = "100px";
const dialogVisible = ref(false)
const handleCommand = (command: string | number | object) => {
  dialogVisible.value = true
}
const handleDownload = (url: string) => {
  if (url === null) {
    ElMessage.error('该消息未上传附件');
  } else {
    window.open(url);
  }
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

interface SessionMessage {
  messageId: string
  sessionId: string
  title: string
  remarks: string
  messageUrl: string
  messageTime: string
}
interface UploadFile {
  name: string; // 文件名
  size: number; // 文件大小
  uid: number; // 唯一标识
  status: string; // 上传状态，如 'ready', 'uploading', 'done', 'error'
  raw: File; // 原始文件对象
  percentage?: number; // 上传进度百分比
}

interface CurrentRow {
  selectFile: File | null; // `selectFile` 可以是 File 类型或者 null
}

const currentrow = ref<CurrentRow>({
  selectFile: null, // 初始值为 null
});

const upload = ref<UploadInstance>();
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const change = (file: UploadFile) => {
  currentrow.value.selectFile = file.raw;
};

const setSessionMessageTableData = (sessionId: string | null) => {
    sessionMessageTableData.value.sessionId = sessionId || "";
};

const submit = async () => {
    if (!sessionMessageTableData.value.title.trim() || !sessionMessageTableData.value.remarks.trim()) {
        ElMessage.error('会话标题和会话附言均不能为空!');
        return;
    }
    if (currentrow.value.selectFile === null) {
      ElMessage.error('请提交文件');
    return;
  }
  loading.value = true
    const newSessionId = props.session_id;
    setSessionMessageTableData(newSessionId);
    const newSessionMessageId = await submitSessionMessageVO(sessionMessageTableData.value);
    await uploadFile(
      currentrow.value.selectFile,
      newSessionMessageId,
      "message"
    );
    await sendEmail(
       props.target_id,
      "导师发送了新的会话信息：" + sessionMessageTableData.value.title,
      sessionMessageTableData.value.remarks,
    );
    ElMessage.success('提交成功')
    fetchData();
    clearForm();
    loading.value = false
};
const clearForm = () => {
    sessionMessageTableData.value = {
        sessionId: "",
        title: "",
        remarks: "",
    };
    currentrow.value.selectFile = null;
    upload.value!.clearFiles();
};

const cancel = () => {
    sessionMessageTableData.value = {
        sessionId: "",
        title: "",
        remarks: "",
    };

    dialogVisible.value = false;
};

const fetchData = async () => {
  try {
    const session_id = props.session_id || ''; // 获取 props 中的 student_id
    const data = await getSessionMessage(session_id); // 调用获取论文详情的方法，并传入参数
    tableData.value = data;
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
const loading = ref(false)
const search = ref({
  title: '',
  remarks: '',
});
// 计算属性，根据搜索条件过滤表格数据
const filterTableData = computed(() =>
  tableData.value.filter(data =>
    (!search.value.title || data.title.toLowerCase().includes(search.value.title.toLowerCase())) &&
    (!search.value.remarks || data.remarks.toLowerCase().includes(search.value.remarks.toLowerCase()))
  )
)
// 使用ref创建响应式变量
const tableData = ref<SessionMessage[]>([]);


const size = ref('default')
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})

</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  /* 水平居中对齐 */
  align-items: center;
  /* 垂直居中对齐 */
  min-height: 100px;
  /* 设置容器最小高度 */
}

.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}
</style>