<template>
    <el-button type="primary" plain @click="handleCommand">发起会话</el-button>

    <el-dialog v-model="dialogVisible" title="会话" width="65%" :before-close="handleClose" center :append-to-body="true"
        align-center>
        <el-descriptions class="margin-top" :column="1" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <user />
                        </el-icon>
                        目标姓名
                    </div>
                </template>
                {{ $props.targetName }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Location />
                        </el-icon>
                        目标id
                    </div>
                </template>
                {{ $props.targetId }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Tickets />
                        </el-icon>
                        会话标题
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
                        会话附言
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
                        会话附件
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
import { Link, Tickets, User, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { submitSessionVO, submitSessionMessageVO } from '@/services/session';
import { getSessionMessage, uploadFile } from '@/services/session';
import type { FormProps, UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { genFileId } from "element-plus";

const props = defineProps({
    targetId: String,
    targetName: String,
    sessionId: {
        type: String,
        default: "000"
    }
});
const formLabelWidth = "100px";
const loading = ref(false)
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

interface sessionData {
    teacherId: string,
    studentId: string,
}

interface sessionMessageData {
    sessionId: string,
    title: string,
    remarks: string,
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

const sessionTableData = ref<sessionData>({
    teacherId: "",
    studentId: "",
});

const sessionMessageTableData = ref<sessionMessageData>({
    sessionId: "",
    title: "",
    remarks: "",
});

const setSessionTableData = (role: string | null) => {
    if (role === "ROLE_TEACHER") {
        sessionTableData.value.teacherId = sessionStorage.getItem("account") || "";
        sessionTableData.value.studentId = props.targetId || "";
    } else if (role === "ROLE_STUDENT") {
        sessionTableData.value.teacherId = props.targetId || "";
        sessionTableData.value.studentId = sessionStorage.getItem("account") || "";
    }
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
    loading.value = true;
    let role = sessionStorage.getItem("role");
    setSessionTableData(role);
    const newSessionId = await submitSessionVO(sessionTableData.value);
    setSessionMessageTableData(newSessionId);
    const newSessionMessageId = await submitSessionMessageVO(sessionMessageTableData.value);
    await uploadFile(
      currentrow.value.selectFile,
      newSessionMessageId,
      "message"
    );
    loading.value = false
    ElMessage.success('提交成功')
    cancel();
};

const cancel = () => {
    sessionMessageTableData.value = {
        sessionId: "",
        title: "",
        remarks: "",
    };

    dialogVisible.value = false;
};



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