<template>
  <div class="login-container">
    <div class="background-image"></div>
    <div class="login-wrapper">
      <el-card class="login-box" shadow="hover">
        <div class="title-logo-wrapper">
          <div class="logo-wrapper">
            <img src="https://authserver.nju.edu.cn/authserver/custom/images/login-logo.png" alt="登录Logo">
          </div>
          <div class="title-wrapper">
            <h2 class="login-title">用户登录</h2>
          </div>
        </div>
        <div class="split"></div>
        <el-form :model="formData" :rules="rules" ref="formRef" label-position="top"
          @submit.native.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" maxlength="20" @blur="clearErrorMessage"
              clearable size="large" :prefix-icon="User"> </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formData.password" placeholder="请输入密码" maxlength="20"
              @blur="clearErrorMessage" clearable show-password size="large" :prefix-icon="Key"></el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input v-model="formData.captcha" placeholder="请输入验证码" maxlength="6" @blur="clearErrorMessage" clearable
              size="large" :prefix-icon="Bell" class="captchaForm"></el-input>
            <Identify :identifyCode="identifyCode" @click="refreshCode" />
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
import { login, insertLoginLogs } from '@/services/login.ts';
import Identify from '@/components/public/Identify.vue'
import { onMounted } from 'vue';
import { User, Key, Bell } from '@element-plus/icons-vue'

const identifyCode = ref();
const identifyCodes = ref("1234567890abcdefghijklmnopqrstuvwxyz");

//重置验证码
const refreshCode = () => {
  identifyCode.value = "";
  makeCode(identifyCode, 4);
};

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += identifyCodes.value[randomNum(0, identifyCodes.value.length)];
  }
};

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

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
    // 检查表单字段是否为空
    if (!formData.value.username || !formData.value.password || !formData.value.captcha) {
      errorMessage.value = '请输入用户名、密码和验证码';
      refreshCode();
      return;
    }
    //检查验证码
    if (formData.value.captcha !== identifyCode.value) {
      errorMessage.value = '请正确输入验证码';
      refreshCode(); // 刷新验证码
      return;
    }
    errorMessage.value = ''; // 清空错误消息
    await login(formData.value.username, formData.value.password, formData.value.captcha);
    // 登录成功
    sessionStorage.setItem("account", formData.value.username); // 保存登录的id
    await insertLoginLogs(formData.value.username)
    router.replace('/dashboard')
  } catch (error) {
    refreshCode();
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

onMounted(() => {
  refreshCode();
})
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

.title-logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-wrapper {
  flex: 0 0 auto;
  /* 不要让logo动态伸缩 */
  margin-right: 20px;
  /* 调整图片与标题之间的间距 */
}

.login-title{
  color: #980099;
}

.title-wrapper {
  flex: 1;
  /* 让标题占据剩余空间 */
}

.logo-wrapper img {
  width: 150px;
  height: auto;
}

.login-box {
  width: 350px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 20px;
}

.captchaForm {
  width: 67%;
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

.login-button {
  width: 70%;
  height: 40px;
  margin: 0 auto;
  font-weight: bold;
  background-color: #980099;
  /* 默认背景色 */
  color: #FFFFFF;
  /* 默认文本颜色 */
  border-color: #980099;
  /* 默认边框颜色 */
}

.login-button:hover {
  background-color: #73116f;
  /* 鼠标悬停时的背景色 */
  border-color: #73116f;
  /* 鼠标悬停时的边框颜色 */
}
</style>
