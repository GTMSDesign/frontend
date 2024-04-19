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

interface Accounts {
  account: string;
  password: string;
  name: string;
  power: string;
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


//返回所有账户
export const getAllAccount = async (): Promise<Accounts[]> => {
  let errorMessage = ""; // 存储错误消息
  try {
    const response = await instance.get("/account/getAllAccount", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    const data = response.data.result; // 获取 result 字段
    return data;
  } catch (error) {
    errorMessage = "Failed to fetch accounts data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};


//更新账号信息
export const updateAccount = async (
  account: string,
  password: string,
  name: string,
  power: string
): Promise<void> => {
  try {
    const accountData = {
      account: account,
      password: password,
      name: name,
      power: power,
    };
    await instance.post("/account/updateByAccount", accountData, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to submit review"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

//新建账号

export const createAccount = async (
  account: string,
  password: string,
  name: string,
  power: string
): Promise<string> => {
  try {
    const accountData = {
      account: account,
      password: password,
      name: name,
      power: power,
    };
    const response = await instance.post("/account/createAccount", accountData, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to submit review"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};



//删除账号
export const deleteByAccount = async (
  account: string,
): Promise<void> => {
  try {
    await instance.post("/account/deleteByAccount", null, {
      params: {
        account,
      },
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to submit review"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};


//处理时间
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