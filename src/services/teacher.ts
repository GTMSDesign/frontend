import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});

export const allThesisTeacher = async () => {
  let errorMessage = ''; // 存储错误消息


  try {
    
  } catch (error:any) {
    throw new Error(errorMessage);
  }
};

export default instance;
