<template>
    <!-- <el-button plain @click="dialogVisible = true">
        Click to open the Dialog
      </el-button> -->
    <!-- <el-dropdown @command="handleCommand" size="large">
        <el-dropdown-item command="editProfile">个人中心</el-dropdown-item>
      </el-dropdown> -->
    <el-button type="primary" plain @click="handleCommand">会话</el-button>
  
    <el-dialog v-model="dialogVisible" title="学生详情" width="60%" :before-close="handleClose" center :append-to-body="true"
      align-center>
      这是会话的详情，还在想怎么设计，如果是回复要不要有历史记录
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from 'vue'
  import { Link, Tickets, User, Iphone, WarningFilled, Message, OfficeBuilding } from '@element-plus/icons-vue'
  import { getStudentById } from '@/services/student'; // 导入获取学生的方法
  
  const props = defineProps({
    student_id: String,
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
  
  interface Student {
  studentId: string
  studentName: string
  grade: string
  phone: string
  officePhone: string
  homePhone: string
  emergencyContactName: string
  emergencyContactPhone: string
  email1: string
  email2: string
  company: string
  position: string
  distribute: string
  excellentCourses: number
  goodCourses: number
  fairCourses: number
  passCourses: number
}
  
  const fetchData = async () => {
    try {
      const student_id = props.student_id || ''; // 获取 props 中的 student_id
      const data = await getStudentById(student_id); // 调用获取论文详情的方法，并传入参数
      tableData.value = data;
      console.log(data)
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
  const tableData = ref<Student>();
  
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