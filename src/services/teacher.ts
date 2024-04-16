// teacherService.ts

import axios from "axios";
import { ca } from "element-plus/es/locales.mjs";

const instance = axios.create({
  baseURL: "http://localhost:8080", // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});
interface Paper {
  title: string;
  thesis_id: string;
  student_name: string;
  student_id: string;
  teacher_name: string;
  teacher_id: string;
  status: string;
  defense_times: string;
  proposal_url: string;
  thesis_url: string;
}

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

interface ThesisDetail {
  title: string;
  thesisId: string;
  studentName: string;
  studentId: string;
  teacherName: string;
  teacherId: string;
  status: string;
  defenseTimes: string;
  comment: string;
  opinion: string;
}

interface ReviewVO {
  title: string;
  thesisId: string;
  studentName: string;
  teacherName: string;
  status: string;
}

interface TeacherInf {
  teacherId: string;
  teacherName: string;
  phone: string;
  officePhone: string;
  email: string;
  title: string;
  education: string;
  category: string;
}
interface reviewMessage {
  externalToStudent: string;
  internalToStudent: string;
  externalToTeacher: string;
  internalToTeacher: string;
}
export const getReviewByThesisId = async (
  thesisId: string,
  role: string
): Promise<reviewMessage> => {
  try {
    const response = await instance.get("/review/getReviewByThesisId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        thesisId,
        role,
      },
    });
    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to fetch Review by thesisId"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
export const allThesisTeacher = async (account: string): Promise<Thesis[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/thesis/getThesisByTeacherId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { account }, // 传递参数到后端
    });
    const data = response.data.result; // 获取 result 字段
    console.log(data)
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getThesisDetail = async (thesis_id: string): Promise<ThesisDetail> => {
  try {
    // 发起 GET 请求
    const response = await instance.get("/thesis/getThesisByThesisId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { thesis_id },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    throw new Error("Failed to fetch detailed thesis data");
  }
};

export const teacherInformation = async (
  teacherId: string
): Promise<TeacherInf> => {
  let errorMessage = ""; // 存储错误消息
  try {
    const response = await instance.get("/teacher/getTeacherById", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { teacherId },
    });
    sessionStorage.setItem("name", response.data.result.teacherName);
    return response.data.result;
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const updatePhone = async (
  phone: string,
  account: string
): Promise<void> => {
  console.log(phone);
  try {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("account", account);

    const response = await instance.post("/teacher/updatePhone", formData, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch review thesis data");
  }
};

export const updateEmail = async (
  email: string,
  account: string
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("account", account);
    const response = await instance.post("/teacher/updateEmail", formData, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch review thesis data");
  }
};

export const sendAttachmentMail = async (
  userId: string,
  subject: string,
  body: string,
  attach: File
): Promise<void> => {
  try {
    const data = new FormData();
    data.append("userId", userId);
    data.append("subject", subject);
    data.append("body", body);
    data.append("attach", attach);
    console.log(attach);
    console.log(data.get("attach"));
    const response = await instance.post("/email/sendAttachmentMail", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    console.log(response);
  } catch (error) {
    throw new Error("Faild to send email");
  }
};
export const approveDefence = async (thesisId: string): Promise<void> => {
  try {
    const response = await instance.post("/teacher/approveDefence", null, {
      params: {
        thesisId,
      },
      headers: {
        token: sessionStorage.getItem("token"), // 确保发送 token
      },
    });
    console.log(response);
  } catch (error) {
    throw new Error("Faild to approve Defence");
  }
};
export const allReviewThesis = async (account: string): Promise<ReviewVO[]> => {
  try {
    // 发起 GET 请求
    const response = await instance.get("/review/getThesisByReviewerId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { account },
    });
    return response.data.result; // 直接返回结果中的 result 数组
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    throw new Error("Failed to fetch review thesis data");
  }
};

export const reviewProposal = async (
  thesisId: string,
  result: string
): Promise<void> => {
  try {
    // 发起 POST 请求
    await instance.post("/teacher/reviewProposal", null, {
      params: {
        thesisId,
        result,
      },
      headers: {
        token: sessionStorage.getItem("token"), // 确保发送 token
      },
    });
  } catch (error) {
    // 处理错误，这里可以根据需要细化错误处理逻辑
    throw new Error("Failed to review proposal");
  }
};

export const getThesisByStatus = async (
  account: string,
  status: string
): Promise<Paper[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get(
      "/thesis/getThesisByTeacherIdAndStatus",
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
        params: { account, status }, // 传递参数到后端
      }
    );
    const data = response.data.result; // 获取 result 字段
    const theses: Paper[] = data.map((item: any) => ({
      title: item.title,
      thesis_id: item.thesisId,
      student_name: item.studentName,
      student_id: item.studentId,
      teacher_name: item.teacherName,
      teacher_id: item.teacherId,
      status: item.status,
      defense_times: item.defenseTimes,
      proposal_url: item.proposalUrl,
      thesis_url: item.thesisUrl,
    }));
    return theses; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch theis"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const saveThesisDefense = async (
  thesisId: string,
  state: string,
  defenseRemarks: string,
  defenseUrl: string,
  review: string): Promise<void> =>  {
  let errorMessage = ''; // 存储错误消息
  try {
    const formData = new FormData();
    formData.append("thesisId", thesisId);
    formData.append("state", state);
    formData.append("defenseRemarks", defenseRemarks);
    formData.append("defenseUrl", defenseUrl);
    formData.append("review", review);
    const respond = await instance.post("/thesisDefense/preliminaryResolution", formData, {
      // params: {
      //   thesisId, result, desc, descUrl, evaluation
      // },
      headers: {
        token: sessionStorage.getItem("token"), // 确保发送 token
      },
    });
    console.log(respond)
  } catch (error) {
    // 处理错误，这里可以根据需要细化错误处理逻辑
    throw new Error("Failed to review proposal");
  }
};
export default instance;
