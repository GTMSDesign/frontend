<template>
    <div class="login-container" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="login-box">
            <h2 style="text-align: center;">用户登录</h2>
            <form @submit.prevent="login">
                <div class="form-group" style="position: relative;">
                    <div class="split"></div>
                </div>
                <div class="form-group" style="text-align:center">
                    <input type="text" id="username" v-model="username" required placeholder="请输入用户名" style="width: 60%;">
                </div>
                <div class="form-group" style="text-align:center">
                    <input type="password" id="password" v-model="password" required placeholder="请输入密码" style="width: 60%;">
                </div>
                <div class="form-group" style="text-align:center">
                    <input type="text" id="captcha" v-model="captcha" required placeholder="请输入验证码" style="width: 60%;">
                </div>
                <div class="form-group" style="text-align:center">
                    <button type="submit">登录</button>
                </div>
                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            </form>
        </div>
    </div>         
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const captcha = ref('');
const errorMessage = ref('');
const backgroundImage = 'src/assets/images/back1.jpg';

const login = () => {
    if (username.value === 'admin' && password.value === 'password') {
        console.log('登录成功');
    } else {
        errorMessage.value = '用户名或密码错误';
    }
};
</script>

<style scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-position: center;
}

.login-box {
    width: 500px;
    max-width: 100%;
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.8);
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
}

input[type="text"],
input[type="password"],
input[type="text"]::placeholder,
input[type="password"]::placeholder {
    width: 100%;
    height: 30px;
    padding: 8px;
    font-size: 16px;
    border: none; /* 移除默认边框 */
    border-radius: 5px; /* 设置圆角 */
    background-color: rgba(255, 255, 255, 0.8); /* 添加背景色 */
}


button {
    padding: 10px 20px;
    width: 50%;
    font-size: 16px;
    background-color: #980099;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.error-message {
    color: red;
    margin-top: 10px;
}

.split {
    position: relative; 
    top: 50%; 
    left: 50%; /* 设置为50% */
    transform: translate(-50%, -50%); /* 居中 */
    width: 60%; /* 设置宽度为固定值 */
    height: 3px; 
    background-color: #980099; 
    margin-bottom: 20px;
}

</style>
