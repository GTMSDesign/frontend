import axios from 'axios';
import { errorMessages } from 'vue/compiler-sfc';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});

export const getStudentById = async (studentId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/student/getStudentById", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { studentId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch student data"
    throw new Error("Failed to fetch student data");
  }
};

export default instance;
