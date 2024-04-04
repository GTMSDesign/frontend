<template>
  <el-header class="header">
    <!-- Logo -->
    <div class="logo">
      <img src="https://authserver.nju.edu.cn/authserver/custom/images/login-logo.png" alt="Logo">
      <span class="title">论文评审管理系统</span>
    </div>
    <!-- Header content -->
    <el-dropdown @command="handleCommand" size="large">
      <div class="avatar-container">
        <el-icon color="#ffffff" size="20px"> <!-- 增大图标的大小 -->
          <User />
        </el-icon>
        <span class="username" style="font-size: 16px;">姓名</span> <!-- 增大姓名的字体大小 -->
        <el-icon color="#ffffff" size="16px"> <!-- 增大箭头的大小 -->
          <ArrowDownBold />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const handleCommand = () => {
  router.push("/")
}
</script>

<style scoped>
.header {
  background-color: #73116f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: auto;
}

.title {
  color: #fff;
  font-size: 20px;
  margin-left: 30px;
}

.avatar-container {
  display: flex;
  align-items: center;
}

.username {
  color: #fff;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
