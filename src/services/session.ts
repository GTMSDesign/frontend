import axios from 'axios';
import { errorMessages } from 'vue/compiler-sfc';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});

interface sessionVO {
  teacherId: string;
  studentId: string;
}

interface sessionMessageVO {
  sessionId: string;
  title: string;
  remarks: string;
}

export const getStudentByTeacherId = async (teacherId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/distribution/getStudentByTeacherId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { teacherId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch student data"
    throw new Error("Failed to fetch student data");
  }
};

export const submitSessionVO = async (data: sessionVO): Promise<string> => {
  try {
    // 发起 post 请求 获得新建会话的sessionId
    const response = await instance.post("/session/submitSessionVO", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to submit sessionVO"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const submitSessionMessageVO = async (data: sessionMessageVO): Promise<void> => {
  try {
    // 发起 post 请求
    await instance.post("/session/submitSessionMessageVO", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to submit sessionMessageVO"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getSessionByTeacherId = async (teacherId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/session/getSessionByTeacherId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { teacherId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch session data"
    throw new Error("Failed to fetch session data");
  }
};

export const getSessionMessage = async (sessionId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/session/getSessionMessage", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { sessionId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch session message data"
    throw new Error("Failed to fetch session message data");
  }
};

export default instance;
