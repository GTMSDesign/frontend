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

export const getTeacherByStudentId = async (studentId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/distribution/getTeacherByStudentId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { studentId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch teacher data"
    throw new Error("Failed to fetch teacher data");
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

export const submitSessionMessageVO = async (data: sessionMessageVO): Promise<string> => {
  try {
    // 发起 post 请求
    const response = await instance.post("/session/submitSessionMessageVO", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    return response.data.result;
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
    // return response.data.result; // 直接返回结果中的 result
    const data = response.data.result; // 获取 result 字段
    const formattedResults = data.map((item:any) => ({
      ...item,
      sessionTime: formatDate(item.sessionTime),//格式化日期
  }))
  return formattedResults; // 返回处理后的数据
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch session data"
    throw new Error("Failed to fetch session data");
  }
};

export const getSessionByStudentId = async (studentId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/session/getSessionByStudentId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { studentId },
    });
    // return response.data.result; // 直接返回结果中的 result
    const data = response.data.result; // 获取 result 字段
    const formattedResults = data.map((item:any) => ({
      ...item,
      sessionTime: formatDate(item.sessionTime),//格式化日期
  }))
  return formattedResults; // 返回处理后的数据
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
    // return response.data.result; // 直接返回结果中的 result
    const data = response.data.result; // 获取 result 字段
    const formattedResults = data.map((item:any) => ({
      ...item,
      messageTime: formatDate(item.messageTime),//格式化日期
  }))
  return formattedResults; // 返回处理后的数据
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch session message data"
    throw new Error("Failed to fetch session message data");
  }
};

export const uploadFile = async (
  attach: File,
  id: string,
  type: string
): Promise<void> => {
  try {
    const data = new FormData();
    data.append("file", attach);
    data.append("id", id);
    data.append("type", type);

    console.log(attach);
    console.log(data.get("attach"));
    const response = await instance.post("/filetransfer/upload", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    console.log(response);
  } catch (error) {
    throw new Error("Faild to upload file");
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default instance;
