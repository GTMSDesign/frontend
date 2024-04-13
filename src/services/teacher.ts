// teacherService.ts

import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080', // 替换成您的后端 API 地址
    timeout: 5000, // 设置超时时间
});

interface Thesis {
    title: string
    thesis_id: string
    student_name: string
    student_id: string
    teacher_name: string
    teacher_id: string
    status: string
    defense_times: string
}

export const allThesisTeacher = async (account: string): Promise<Thesis[]> => {
    let errorMessage = ''; // 存储错误消息

    try {
        const response = await instance.get('/thesis/getThesisByTeacherId', {
            headers: {
                'token': sessionStorage.getItem('token')
            },
            params: { account } // 传递参数到后端
        });
        const data = response.data.result; // 获取 result 字段
        const theses: Thesis[] = data.map((item: any) => ({
            title: item.title,
            thesis_id: item.thesisId,
            student_name: item.studentName,
            student_id: item.studentId,
            teacher_name: item.teacherName,
            teacher_id: item.teacherId,
            status: item.status,
            defense_times: item.defenseTimes,
        }));
        return theses; // 返回处理后的数据
    } catch (error) {
        errorMessage = 'Failed to fetch teacher theses data'; // 设置错误消息
        throw new Error(errorMessage); // 抛出错误
    }
};

export default instance;
