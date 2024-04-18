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
