<template>
  <el-button type="primary" plain @click="handleCommand">详情</el-button>
  <el-dialog v-model="dialogVisible" title="答辩详情" width="60%" :before-close="handleClose" center :append-to-body="true"
             align-center>
    <el-descriptions class="margin-top" :column="2" :size="size" border>
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
            答辩结果
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
            学生ID
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
            答辩附言
          </div>
        </template>
        {{ tableData?.defenseRemarks }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <ChatLineRound />
            </el-icon>
            三个一评价
          </div>
        </template>
        {{ tableData?.review }}
      </el-descriptions-item>

    </el-descriptions>
    <el-descriptions class="margin-top" :column="3" :size="size" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Link />
            </el-icon>
            论文附件
          </div>
        </template>
        <Download :id="defenseId" type="thesis" />
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Link />
            </el-icon>
            答辩附件
          </div>
        </template>
        <Download :id="defenseId" type="opinion" />
      </el-descriptions-item>

      <el-descriptions-item>
        <el-button type="primary" @click="submit">提交</el-button>
<!--        <el-button @click="rejectForm()">不通过</el-button>-->
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import Download from '@/components/public/download.vue'
import { Link, Tickets, User, Comment, ChatLineRound, View } from '@element-plus/icons-vue'
import {getDefenseThesisDetail, defenseSubmission} from '@/services/teacher';
import {deleteByAccount} from "@/services/admin";
// import type {FormInstance} from "element-plus"; // 导入获取教师相关论文的方法

const props = defineProps({
  defenseId: String,
});

const loading = ref(true)
const dialogVisible = ref(false)
const handleCommand = (command: string | number | object) => {
  dialogVisible.value = true
}

const handleClose = (done: () => void) => {
  done()
}

interface DefensedThesis {
  defenseId: number
  thesisId: number
  conclusion: string
  studentName: string
  studentId: number
  teacherName: string
  teacherId: string
  title: string
  defenseRemarks: string
  review: string
  thesisUrl: string
  defenseUrl: string
  status: string
}

const fetchData = async () => {
  try {
    const defenseId = props.defenseId || ''; // 获取 props 中的 defenseId
    const data = await getDefenseThesisDetail(defenseId) // 调用获取论文答辩详细信息的方法，并传入参数
    tableData.value = data;
    loading.value = false; // 数据加载完成，loading 状态设为 false
  } catch (error) {
    console.error(error);
    // 处理错误
  }
}

const submit = async () => {
  try {
    const defenseId = props.defenseId || '';
    await defenseSubmission(defenseId)
    console.log('submit!')
  } catch (error) {
    console.error(error);
  }

}


// 在组件挂载后加载数据
onMounted(() => {
  fetchData();
});

// 使用ref创建响应式变量
const tableData = ref<DefensedThesis>();

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