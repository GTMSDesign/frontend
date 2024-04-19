<template>
  <div id="app">
    <el-container class="app-container">
      <!-- Header -->
      <Header />
      <el-container class="main-container">
        <!-- Sidebar -->
        <el-menu
          :router="false"
          :default-active="defaultActive"
          @select="handleMenuSelect"
          background-color="#73116f"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          :unique-opened="true"
        >
          <!-- Iterate over menuItems array -->
          <template v-for="(menuItem, index) in menuItems" :key="index">
            <!-- Check if menuItem is a submenu -->
            <el-sub-menu v-if="menuItem.submenu" :index="menuItem.index">
              <template #title>
                <span class="menu-item">
                  <el-icon class="menu-icon">
                    <ChatRound />
                  </el-icon>
                  {{ menuItem.text }}
                </span>
              </template>
              <!-- Iterate over submenu items -->
              <template
                v-for="(subItem, subIndex) in menuItem.items"
                :key="subIndex"
              >
                <el-tooltip
                  :content="subItem.tooltip"
                  effect="dark"
                  placement="right"
                >
                  <el-menu-item :index="subItem.index" class="menu-item">
                    <el-icon class="menu-icon">
                      <Position />
                    </el-icon>
                    {{ subItem.text }}
                  </el-menu-item>
                </el-tooltip>
              </template>
            </el-sub-menu>
            <!-- If menuItem is not a submenu -->
            <el-tooltip
              v-else
              :content="menuItem.tooltip"
              effect="dark"
              placement="right"
            >
              <el-menu-item :index="menuItem.index" class="menu-item">
                <el-icon class="menu-icon">
                  <Edit />
                </el-icon>
                {{ menuItem.text }}
              </el-menu-item>
            </el-tooltip>
          </template>
        </el-menu>
        <!-- Main content -->
        <el-main class="main-content">
          <!-- Router view -->
          <router-view></router-view>
        </el-main>
        <!-- Footer -->
        <Footer />
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/public/header.vue";
import Footer from "@/components/public/footer.vue";
import { RouterView, useRouter } from "vue-router";
import { ref } from "vue";
import { onMounted } from "vue";
import { ChatRound } from "@element-plus/icons-vue";

// Default active menu item
const defaultActive = ref("/enterStudentInfo");

// Menu items array
const menuItems = ref([
  {
    index: "1",
    text: "信息管理",
    submenu: true,
    items: [
      {
        index: "/enterStudentInfo",
        tooltip: "学生信息录入",
        text: "学生信息录入",
      },
      {
        index: "/enterTeacherInfo",
        tooltip: "教师信息录入",
        text: "教师信息录入",
      },
    ],
  },
  {
    index: "/advisorAssignment",
    text: "导师分配",
    icon: "el-icon-s-data",
    tooltip: "导师分配",
  },
  {
    index: "2",
    text: "论文管理",
    submenu: true,
    items: [
      {
        index: "/allThesisRegistrar",
        tooltip: "所有论文展示",
        text: "所有论文展示",
      },
      { index: "/plagiarismCheck", tooltip: "检测重复率", text: "检测重复率" },
      { index: "/arrangeReview", tooltip: "安排评审", text: "安排评审" },
      { index: "/arrangeDefense", tooltip: "安排答辩", text: "安排答辩" },
      { index: "/arrangePrinting", tooltip: "安排印刷", text: "安排印刷" },
      {
        index: "/generateEvaluation",
        tooltip: "三个一评价",
        text: "三个一评价",
      },
    ],
  },
  {
    index: "/ReviewRule",
    text: "制定评审规则",
    icon: "el-icon-s-data",
    tooltip: "制定评审规则",
  },
]);

// Handle menu selection
const handleMenuSelect = (index: string) => {
  router.push(index);
};

const isCollapse = ref(false);

const router = useRouter();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

onMounted(() => {
  // Update defaultActive when the page component is mounted
  router.push(defaultActive.value);
});
</script>

<style scoped>
/* Styles remain the same */
#app {
  height: 100vh;
  /* 使整个页面占满视口 */
  margin: 0;
  /* 去除默认的 margin */
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 使容器占满 #app 的高度 */
}

.main-container {
  position: relative;
  /* 设置主容器为相对定位 */
  flex: 1;
  /* 使 main-container 占据剩余空间 */
}

.sidebar:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  background-color: #73116f;
  height: 100%;
}

.menu-item {
  color: #ccc;
  /* 设置字体颜色为灰色 */
  display: flex;
  align-items: center;
  /* 将图标与文字垂直居中 */
}

.menu-item.is-active {
  background-color: #63065f;
  /* 设置被选中标签的背景颜色 */
  color: #fff;
  /* 设置字体颜色为白色 */
}

.menu-icon {
  margin-right: 10px;
  /* 图标与文字之间的间距 */
  font-size: 16px;
  /* 图标大小 */
}

.main-content {
  position: relative;
  /* 设置主内容为相对定位 */
  padding-bottom: 40px;
  /* 留出底部沉底块的空间 */
}
</style>

<style>
.el-sub-menu .el-sub-menu__icon-arrow {
  color: white;
}
</style>
