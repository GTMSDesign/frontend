<template>

    <el-dropdown @command="handleCommand" size="large" v-if="hasPermission()">
        <el-dropdown-item command="editProfile">个人中心</el-dropdown-item>
    </el-dropdown>
  
    <el-dialog v-model="dialogVisible" title="学生详情" width="60%" :before-close="handleClose" center :append-to-body="true"
      align-center>
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
              班级
            </div>
          </template>
          {{ tableData?.grade }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Iphone />
              </el-icon>
              电话
            </div>
          </template>
          {{ tableData?.phone }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Iphone />
              </el-icon>
              办公电话
            </div>
          </template>
          {{ tableData?.officePhone }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Iphone />
              </el-icon>
              家庭电话
            </div>
          </template>
            {{ tableData?.homePhone }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <WarningFilled />
              </el-icon>
              紧急联系人
            </div>
          </template>
          {{ tableData?.emergencyContactName }}
        </el-descriptions-item>
  
        <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <WarningFilled />
                </el-icon>
                紧急联系电话
              </div>
            </template>
            {{ tableData?.emergencyContactPhone }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Message />
                </el-icon>
                电子邮箱1
              </div>
            </template>
            {{ tableData?.email1 }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Message />
                </el-icon>
                电子邮箱2
              </div>
            </template>
            {{ tableData?.email2 }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <OfficeBuilding />
                </el-icon>
                实习/工作单位
              </div>
            </template>
            {{ tableData?.company }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <OfficeBuilding />
                </el-icon>
                职务
              </div>
            </template>
            {{ tableData?.position }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Tickets/>
                </el-icon>
                优秀课程数
              </div>
            </template>
            {{ tableData?.excellentCourses }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Tickets />
                </el-icon>
                良好课程数
              </div>
            </template>
            {{ tableData?.goodCourses }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Tickets />
                </el-icon>
                中等课程数
              </div>
            </template>
            {{ tableData?.fairCourses }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Tickets />
                </el-icon>
                通过课程数
              </div>
            </template>
            {{ tableData?.passCourses }}
          </el-descriptions-item>

      </el-descriptions>

      <el-descriptions class="margin-top" :column="2" :size="size" border title="导师信息">
        <!-- <template #extra>
          <el-button type="primary">Operation</el-button>
        </template> -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              导师姓名
            </div>
          </template>
          {{ tableData2?.teacherName }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Location />
              </el-icon>
              导师id
            </div>
          </template>
          {{ tableData2?.teacherId }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Iphone />
              </el-icon>
              手机号
            </div>
          </template>
          {{ tableData2?.phone }}
        </el-descriptions-item>
  
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <Iphone />
              </el-icon>
              办公电话
            </div>
          </template>
          {{ tableData2?.officePhone }}
        </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Message />
                </el-icon>
                电子邮箱
              </div>
            </template>
            {{ tableData2?.email }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <OfficeBuilding />
                </el-icon>
                职称
              </div>
            </template>
            {{ tableData2?.title }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Tickets/>
                </el-icon>
                学历
              </div>
            </template>
            {{ tableData2?.education }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Tickets />
                </el-icon>
                类别
              </div>
            </template>
            {{ tableData2?.category }}
          </el-descriptions-item>

      </el-descriptions>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from 'vue'
  import { Link, Tickets, User, Iphone, WarningFilled, Message, OfficeBuilding } from '@element-plus/icons-vue'
  import { getStudentById } from '@/services/student'; // 导入获取学生的方法
  import { getTeacherByStudentId } from "@/services/session";
  
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

interface Teacher {
    teacherId: string
    teacherName: string
    phone: string
    officePhone: string
    email: string
    title: string
    education: string
    category: string
  }
  
  const fetchData = async () => {
    try {
      const student_id = props.student_id || ''; // 获取 props 中的 student_id
      const data = await getStudentById(student_id); // 调用获取论文详情的方法，并传入参数
      const data2 = await getTeacherByStudentId(student_id);
      tableData.value = data;
      tableData2.value = data2[0];
      console.log(tableData2.value);
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
  const tableData2 = ref<Teacher>();
  
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

  const hasPermission = () => {
  if(sessionStorage.getItem("role") == "ROLE_STUDENT"){
    return true
  }else {
    return false
  }
}

  
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