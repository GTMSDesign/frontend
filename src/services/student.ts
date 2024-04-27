import axios from 'axios';
import { errorMessages } from 'vue/compiler-sfc';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});

interface Thesis {
  title: string;
  thesis_id: string;
  student_name: string;
  student_id: string;
  teacher_name: string;
  teacher_id: string;
  status: string;
  defense_times: string;
}

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


export const getStudentNameById = async (studentId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/student/getStudentNameById", {
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

export const allThesisStudent = async (account: string): Promise<Thesis[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/thesis/getThesisByStudentId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { account }, // 传递参数到后端
    });
    const data = response.data.result; // 获取 result 字段
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch student theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const finishDraft = async (thesisId: string): Promise<void> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/student/finishDraft", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { thesisId }, // 传递参数到后端
    });
    const data = response.data.result; // 获取 result 字段
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to set finish draft"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const addNewThesis = async (studentId: string, title: string): Promise<void> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/student/addNewThesis", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { title, studentId }, // 传递参数到后端
    });
  } catch (error) {
    errorMessage = "添加论文失败"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export default instance;
