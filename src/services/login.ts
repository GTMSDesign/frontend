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

    //console.log(response.data.result);
    sessionStorage.setItem("token",response.data.result.token);
    sessionStorage.setItem("role",response.data.result.role.toString());
    sessionStorage.setItem("name",response.data.result.name)
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

export const insertLoginLogs = async (userAccount:string) : Promise<void> =>{
  let errorMessage = '保存登录日志失败'; // 存储错误消息
  try {
    const formData = new FormData();
    formData.append('userAccount', userAccount);
    const response = await instance.post('/admin/insertLoginLogs', formData, {
      headers: {
        token: sessionStorage.getItem("token"),
      }
    });
  } catch (error:any) {
    throw new Error(errorMessage);
  }
};

export default instance;
