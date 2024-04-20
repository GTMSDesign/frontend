import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8080", // 替换成您的后端 API 地址
  timeout: 5000, // 设置超时时间
});
interface accountPO {
  account: string;
  name: string;
  power: string;
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
interface rule {
  reviewItem: string;
  reviewElement: string;
  maxScore: number;
}
interface studentInfo {
  studentId: string;
  studentName: string;
  grade: string;
  phone: string;
  officePhone: string;
  homePhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  email1: string;
  email2: string;
  company: string;
  position: string;
  distribute: string;
  excellentCourses: number;
  goodCourses: number;
  fairCourses: number;
  passCourses: number;
}

interface teacherInfo {
  teacherId: string;
  teacherName: string;
  phone: string;
  officePhone: string;
  email: string;
  title: string;
  education: string;
  category: string;
}
export const getReviewRules = async (): Promise<rule[]> => {
  try {
    const response = await instance.get("/review/getReviewRules", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });

    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to fetch rules"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
export const getUnenteredStudents = async (): Promise<accountPO[]> => {
  try {
    const response = await instance.get("/registrar/getUnenteredStudents", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to fetch review unentered students"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
export const getUnenteredTeachers = async (): Promise<accountPO[]> => {
  try {
    const response = await instance.get("/registrar/getUnenteredTeachers", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    return response.data.result;
  } catch (error) {
    let errorMessage = "Failed to fetch review unentered teachers"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
export const allThesis = async (): Promise<Thesis[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/registrar/getAllThesis", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    const data = response.data.result; // 获取 result 字段
    console.log(data);
    return data; // 返回处理后的数据
  } catch (error) {
    errorMessage = "Failed to fetch teacher theses data"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const updateReviewRule = async (data: rule[]): Promise<void> => {
  try {
    await instance.post("/registrar/updateReviewRule", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to update review rules"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
export const submitStudentPO = async (data: studentInfo): Promise<void> => {
  try {
    await instance.post("/registrar/submitStudentPO", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to submit studentPO"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};
export const submitTeacherPO = async (data: teacherInfo): Promise<void> => {
  try {
    await instance.post("/registrar/submitTeacherPO", data, {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
  } catch (error) {
    let errorMessage = "Failed to submit teacherPO"; // 设置错误消息
    throw new Error(errorMessage); // 抛出错误
  }
};

export const getThesisByStatus = async (status: string): Promise<Paper[]> => {
  let errorMessage = ""; // 存储错误消息

  try {
    const response = await instance.get("/thesis/getThesisByStatus", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: { status }, // 传递参数到后端
    });
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
export const submitPlagiarismCheck = async (
  studentId: string,
  thesisId: string,
  repetition: number,
  conclusion: string
): Promise<void> => {
  try {
    // 发起 POST 请求
    await instance.post("/registrar/submitPlagiarismCheck", null, {
      params: {
        studentId,
        thesisId,
        repetition,
        conclusion,
      },
      headers: {
        token: sessionStorage.getItem("token"), // 确保发送 token
      },
    });
  } catch (error) {
    // 处理错误，这里可以根据需要细化错误处理逻辑
    throw new Error("Failed to submit plagiarism check");
  }
};
