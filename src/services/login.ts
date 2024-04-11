import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});

export const login = async (username:string, password:string, captcha:string) => {
  let errorMessage = ''; // 存储错误消息


  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await instance.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // console.log(response.data.result);
    sessionStorage.setItem("token",response.data.result.token);
    sessionStorage.setItem("role",response.data.result.role.toString());
    return response.data;
  } catch (error:any) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = '用户名或密码错误，请重试';
    }
    throw new Error(errorMessage);
  }
};

export default instance;
