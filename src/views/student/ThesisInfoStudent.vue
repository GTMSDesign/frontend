<template>
    <!-- <el-button plain @click="dialogVisible = true">
        Click to open the Dialog
      </el-button> -->
    <!-- <el-dropdown @command="handleCommand" size="large">
        <el-dropdown-item command="editProfile">个人中心</el-dropdown-item>
      </el-dropdown> -->
    <el-button type="primary" plain @click="handleCommand">详情</el-button>

    <el-dialog v-model="dialogVisible" title="论文详情" width="60%" :before-close="handleClose" center
        :append-to-body="true" align-center>
        <el-descriptions class="margin-top" :column="2" :size="size" border>
            <!-- <template #extra>
          <el-button type="primary">Operation</el-button>
        </template> -->
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <user />
                        </el-icon>
                        学生姓名
                    </div>
                </template>
                {{ tableData?.studentName }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Location />
                        </el-icon>
                        学生学号
                    </div>
                </template>
                {{ tableData?.studentId }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <user />
                        </el-icon>
                        导师姓名
                    </div>
                </template>
                {{ tableData?.teacherName }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Location />
                        </el-icon>
                        导师ID
                    </div>
                </template>
                {{ tableData?.teacherId }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <tickets />
                        </el-icon>
                        论文ID
                    </div>
                </template>
                {{ tableData?.thesisId }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <tickets />
                        </el-icon>
                        论文状态
                    </div>
                </template>
                <el-tag size="big">
                    {{ tableData?.status }}
                </el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <View />
                        </el-icon>
                        答辩次数
                    </div>
                </template>
                {{ tableData?.defenseTimes }}
            </el-descriptions-item>

            <el-descriptions-item v-if="tableData && tableData.status === '已开题'">
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <View />
                        </el-icon>
                        设置完成初稿
                    </div>
                </template>
                <el-button type="primary" @click="handleFinishDraft">确认完成初稿</el-button>
            </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="margin-top" :column="1" :size="size" border>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <office-building />
                        </el-icon>
                        论文标题
                    </div>
                </template>
                {{ tableData?.title }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Comment />
                        </el-icon>
                        论文简评
                    </div>
                </template>
                {{ tableData?.comment }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <ChatLineRound />
                        </el-icon>
                        导师意见
                    </div>
                </template>
                {{ tableData?.opinion }}
            </el-descriptions-item>

        </el-descriptions>
        <el-descriptions class="margin-top" :column="1" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Link />
                        </el-icon>
                        论文附件
                    </div>
                </template>
                <Upload :id="thesis_id" type="thesis" v-if="tableData && (tableData.status === '已开题'
                    || tableData.status === '完成初稿'
                    || tableData.status === '待答辩'
                    || tableData.status === '通过答辩'
                    || tableData.status === '暂缓通过')" />
                <Download :id="thesis_id" type="thesis" />
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Link />
                        </el-icon>
                        导师意见附件
                    </div>
                </template>
                <Download :id="thesis_id" type="opinion" />
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Link />
                        </el-icon>
                        开题报告附件
                    </div>
                </template>
                <Upload :id="thesis_id" type="proposal" v-if="tableData && tableData.status === '未开题'" />
                <Download :id="thesis_id" type="proposal" />
            </el-descriptions-item>
        </el-descriptions>

        <!-- <Upload id="20240001" type="opinion" />
      <Download id="20240001" type="opinion" /> -->
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import Upload from '@/components/public/upload.vue'
import Download from '@/components/public/download.vue'
import { Link, Tickets, User, Comment, ChatLineRound, View } from '@element-plus/icons-vue'
import { getThesisDetail, downloadFile } from '@/services/teacher'; // 导入获取教师相关论文的方法
import { finishDraft } from "@/services/student";
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
    thesis_id: String,
});

const loading = ref(true)
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

const handleFinishDraft = async () => {
    const url = await downloadFile(props.thesis_id || '', "thesis");
    ElMessageBox.confirm(
        '您确认要设置完成初稿?请确保已经提交合适的论文初稿',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            if (url === "Error") {
                ElMessage.error("你还未上传任何论文附件，无法设置完成初稿")
                return;
            } else {
                console.log(url);
                ElMessage({
                    type: 'success',
                    message: '成功设置完成初稿！',
                })
                FinishDraft();
            }

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消设置完成初稿',
            })
        })
}

const FinishDraft = async () => {
    try {
        const thesis_id = props.thesis_id || ''; // 获取 props 中的 thesis_id
        await finishDraft(thesis_id);
        dialogVisible.value = false;
        fetchData();
        location.reload();
    } catch (error) {
        ElMessage.error("设置状态错误")
    }
}

interface Thesis {
    title: string
    thesisId: string
    studentName: string
    studentId: string
    teacherName: string
    teacherId: string
    status: string
    defenseTimes: string
    comment: string
    opinion: string
}

const fetchData = async () => {
    try {
        const thesis_id = props.thesis_id || ''; // 获取 props 中的 thesis_id
        const data = await getThesisDetail(thesis_id); // 调用获取论文详情的方法，并传入参数
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
const tableData = ref<Thesis>();

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