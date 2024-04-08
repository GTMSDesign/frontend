<template>
  <div class="login-container">
    <div class="background-image"></div>
    <div class="login-wrapper">
      <el-card class="login-box" shadow="hover">
        <h2 style="text-align: center;">用户登录</h2>
        <div class="split"></div>
        <el-form :model="formData" :rules="rules" ref="formRef" label-position="top"
          @submit.native.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" class="input-field" maxlength="20"
              @blur="clearErrorMessage"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formData.password" placeholder="请输入密码" class="input-field" maxlength="20"
              @blur="clearErrorMessage"></el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input v-model="formData.captcha" placeholder="请输入验证码" class="input-field" maxlength="6"
              @blur="clearErrorMessage"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" class="login-button">登录</el-button>
          </el-form-item>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElCard } from 'element-plus';
import router from '@/router';
import { login } from '@/services/login.ts';

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  try {
    errorMessage.value = ''; // 清空错误消息
    await login(formData.value.username, formData.value.password, formData.value.captcha);
    // 登录成功
    // 处理其他逻辑，例如跳转页面
  } catch (error) {
    errorMessage.value = error.message; // 显示错误消息
  }
};

const formData = ref({
  username: '',
  password: '',
  captcha: ''
});
const errorMessage = ref('');

const clearErrorMessage = () => {
  if (Object.values(formData.value).every(value => value !== '')) {
    errorMessage.value = ''; // 清除错误消息
  }
};
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('src/assets/images/back1.jpg');
  background-size: cover;
  background-position: center;
  /*filter: blur(5px);*/
}

.login-wrapper {
  position: relative;
  z-index: 1;
}

.login-box {
  width: 300px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
}

.split {
  height: 3px;
  background-color: #980099;
  margin: 20px 0;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.input-field {
  width: 100%;
  margin: 0 auto;
  font-weight: bold;
  border-width: 2px;
  /* Add this line to increase border thickness */
}

.login-button {
  width: 70%;
  margin: 0 auto;
  font-weight: bold;
  background-color: #409EFF;
  /* 默认背景色 */
  color: #FFFFFF;
  /* 默认文本颜色 */
  border-color: #409EFF;
  /* 默认边框颜色 */
}

.login-button:hover {
  background-color: #980099;
  /* 鼠标悬停时的背景色 */
  border-color: #980099;
  /* 鼠标悬停时的边框颜色 */
}
</style>
