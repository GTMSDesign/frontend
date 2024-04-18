import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});

interface LoginLogs {
    id: number
    userAccount: string
    loginTime: string
    ipAddress: string
  }

//返回所有loginLogs
export const allLoginLogs = async (): Promise<LoginLogs[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/admin/getAllLoginLogs", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    const data = response.data.result; // 获取 result 字段
    // console.log(data);
    const formattedResults = data.map((item:any) => ({
        ...item,
        loginTime: formatDate(item.loginTime),//格式化日期
    }))
    return formattedResults; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch loginLogs data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
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