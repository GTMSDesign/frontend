// teacherService.ts

import axios from "axios";
import { ca } from "element-plus/es/locales.mjs";

const instance = axios.create({
  baseURL: "http://localhost:8080", // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});
interface rule {
  reviewItem: string;
  reviewElement: string;
  maxScore: number;
  actualScore: number;
}
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

interface DefenseDetail {
  thesisId: string;
  state: string;
  defenseRemarks: string;
  defenseUrl: string;
  review: string;

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
  externalComment: string;
  internalComment: string;
  externalAdvice: string;
  internalAdvice: string;
}
interface DefensedThesis {
  defenseId: number;
  thesisId: number;
  conclusion: string;
  studentName: string;
  studentId: number;
  teacherName: string;
  teacherId: string;
  title: string;
  defenseRemarks: string;
  review: string;
  thesisUrl: string;
  defenseUrl: string;
  status: string;
}
interface ThesisDefense {
  defenseId: number;
  thesisId: number;
  secretary: string;
  teacher1: string;
  teacher2: string;
  teacher3: string;
  conclusion: string;
  resolution: string;
  defenseRemarks: string;
  defenseUrl: string;
  resolutionUrl: string;
  place: string;
  date: Date;
  review: string;
}
interface ReviewConclusion {
  title: string;
  thesisId: string;
  studentName: string;
  studentId: string;
  status: string;
  internalScore: string;
  externalScore: string;
  date: string;
}

export const getReviewConclusionByTeacherId = async (
  teacherId: string
): Promise<ReviewConclusion[]> => {
  try {
    const response = await instance.get(
      "/review/getReviewConclusionByTeacherId",
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
        params: {
          teacherId,
        },
      }
    );
    console.log(response);
    const formattedResults = response.data.result.map((item: any) => ({
      ...item,
      date: formatDate(item.date), // 格式化日期
    }));
    console.log(formattedResults);
    return formattedResults;
  } catch (error) {
    let errorMessage = "Failed to fetch review conclusion"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
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

export const submitReview = async (
  thesisId: string,
  score: number,
  teacherId: string,
  comment: string,
  advice: string
): Promise<void> => {
  try {
    const reviewData = {
      thesisId: thesisId,
      score: score,
      teacherId: teacherId,
      comment: comment,
      advice: advice,
    };
    await instance.post("/review/submitReview", reviewData, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to submit review"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const downloadFile = async (
  id: string,
  type: string
): Promise<string> => {
  try {
    const response = await instance.get("/filetransfer/download", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        id,
        type,
      },
    });
    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to download file"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getReviewRules = async (): Promise<rule[]> => {
  try {
    const response = await instance.get("/review/getReviewRules", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    const rulesWithDefaults = response.data.result.map((rule: any) => ({
      reviewItem: rule.reviewItem,
      reviewElement: rule.reviewElement,
      maxScore: rule.maxScore,
      actualScore: rule.actualScore ?? 0, // 使用 nullish coalescing 操作符设置默认值
    }));
    return rulesWithDefaults;
  } catch (error) {
    let errorMessage = "Failed to fetch rules"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getReviewByThesisId = async (
  thesisId: string
): Promise<reviewMessage> => {
  try {
    const response = await instance.get("/review/getReviewByThesisId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        thesisId,
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
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getThesisDetail = async (
  thesis_id: string
): Promise<ThesisDetail> => {
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

export const getDefenseThesisDetail = async (
  defenseId: string
): Promise<DefensedThesis> => {
  try {
    // 发起 GET 请求
    const response = await instance.get("/thesisDefense/getDefensedThesis", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { defenseId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    throw new Error("Failed to fetch detailed thesis data");
  }
};

export const getDefenseDetail = async (
  defenseId: string
): Promise<DefenseDetail> => {
  try {
    // 发起 GET 请求
    const response = await instance.get("/thesisDefense/getDefenseByDefenseId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { defenseId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    throw new Error("Failed to fetch detailed defense data");
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

export const thesisDefenseInf = async (
  thesisId: string
): Promise<ThesisDefense> => {
  let errorMessage = ""; // 存储错误消息
  try {
    const response = await instance.get(
      "/thesisDefense/findDefenseByThesisId",
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
        params: { thesisId },
      }
    );
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

export const sendEmail = async (
  userId: string,
  subject: string,
  body: string
): Promise<void> => {
  try {
    const data = new FormData();
    data.append("userId", userId);
    data.append("subject", subject);
    data.append("body", body);

    const response = await instance.post("/email/send", data, {
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

export const approveDeffer = async (thesisId: string): Promise<void> => {
  try {
    const response = await instance.post("/teacher/approveDeffer", null, {
      params: {
        thesisId,
      },
      headers: {
        token: sessionStorage.getItem("token"), // 确保发送 token
      },
    });
    console.log(response);
  } catch (error) {
    throw new Error("Faild to approve Deffer");
  }
};

export const defenseResolution = async (thesisId: string): Promise<void> => {
  try {
    const response = await instance.post("/teacher/defenseResolution", null, {
      params: {
        thesisId,
      },
      headers: {
        token: sessionStorage.getItem("token"), // 确保发送 token
      },
    });
    console.log(response);
  } catch (error) {
    throw new Error("Faild to DefenseResolution");
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
export const approveDraft = async (thesisId: string): Promise<void> => {
  try {
    // 发起 POST 请求
    await instance.post("/teacher/approveDraft", null, {
      params: {
        thesisId,
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
  defenseId: string,
  state: string,
  defenseRemarks: string,
  defenseUrl: string,
  review: string
): Promise<void> => {
  let errorMessage = ""; // 存储错误消息
  try {
    const formData = new FormData();
    formData.append("defenseId", defenseId);
    formData.append("state", state);
    formData.append("defenseRemarks", defenseRemarks);
    formData.append("defenseUrl", defenseUrl);
    formData.append("review", review);
    const respond = await instance.post(
      "/thesisDefense/preliminaryResolution",
      formData,
      {
        headers: {
          token: sessionStorage.getItem("token"), // 确保发送 token
        },
      }
    );
    console.log(respond);
  } catch (error) {
    // 处理错误，这里可以根据需要细化错误处理逻辑
    throw new Error("Failed to review proposal");
  }
};


export const saveDeferredDefense = async (
  defenseId: string,
  state: string,
  defenseRemarks: string,
  defenseUrl: string,
  review: string
): Promise<void> => {
  let errorMessage = ""; // 存储错误消息
  try {
    const formData = new FormData();
    formData.append("defenseId", defenseId);
    formData.append("state", state);
    formData.append("defenseRemarks", defenseRemarks);
    formData.append("defenseUrl", defenseUrl);
    formData.append("review", review);
    const respond = await instance.post(
      "/thesisDefense/deferredDefense",
      formData,
      {
        headers: {
          token: sessionStorage.getItem("token"), // 确保发送 token
        },
      }
    );
    console.log(respond);
  } catch (error) {
    // 处理错误，这里可以根据需要细化错误处理逻辑
    throw new Error("Failed to review proposal");
  }
};

export const allDefenseThesisTeacher = async (account: string): Promise<Thesis[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/thesisDefense/getThesisByTeacherId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { account }, // 传递参数到后端
    });
    const data = response.data.result; // 获取 result 字段
    console.log(data);
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const allDefenseThesisAllTeachers = async (account: string): Promise<Thesis[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/thesisDefense/getAllThesisByTeachersId", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { account }, // 传递参数到后端
    });
    const data = response.data.result; // 获取 result 字段
    console.log(data);
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const allDefenseThesisTeacher1 = async (account: string): Promise<Thesis[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/thesisDefense/getThesisByTeacher1Id", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { account }, // 传递参数到后端
    });
    const data = response.data.result; // 获取 result 字段
    console.log(data);
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getTeacherNameById = async (teacherId: string) => {
  let errorMessage = ''; // 存储错误消息

  try {
    // 发起 GET 请求
    const response = await instance.get("/teacher/getTeacherNameById", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { teacherId },
    });
    return response.data.result; // 直接返回结果中的 result
  } catch (error) {
    // 如果发生错误，将错误消息抛出
    errorMessage = "Failed to fetch teacher data"
    throw new Error("Failed to fetch teacher data");
  }
};

export const defenseSubmission = async (defenseId: string): Promise<void> => {
  try {
    const response = await instance.post("/thesisDefense/submission", null, {
      params: {
        defenseId,
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

export const finishDelete = async (thesisId: string): Promise<void> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/teacher/finishDelete", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { thesisId }, // 传递参数到后端
    });
  } catch (error) {
    errorMessage = "Failed to set finish delete"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const finishBeforeDefense = async (thesisId: string): Promise<void> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/teacher/finishBeforeDefense", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { thesisId }, // 传递参数到后端
    });
  } catch (error) {
    errorMessage = "Failed to set finish before defense"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const finishAfterDefense = async (thesisId: string): Promise<void> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/teacher/finishAfterDefense", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { thesisId }, // 传递参数到后端
    });
  } catch (error) {
    errorMessage = "Failed to set finish after defense"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export default instance;
