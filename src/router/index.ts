import { createRouter, createWebHistory} from "vue-router";

import login from "@/views/public/login.vue";
import adminDashboard from "@/views/admin/adminDashboard.vue";
import registrarDashboard from "@/views/registrar/registrarDashboard.vue";
import studentDashboard from "@/views/student/studentDashboard.vue";
import teacherDashboard from "@/views/teacher/teacherDashboard.vue";
import thesisStatus from "@/views/student/thesisStatus.vue";
import editProfile from "@/views/student/editProfile.vue"

 const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path: '/login',
            component: login
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/adminDashboard',
            component: adminDashboard
        },
        {
            path: '/registrarDashboard',
            component: registrarDashboard
        },
        {
            path: '/studentDashboard',
            component: studentDashboard
        },
        {
            path: '/teacherDashboard',
            component: teacherDashboard
        },
        {
            path: '/thesisStatus',
            component: thesisStatus
        },
        {
            path: '/editProfile',
            component: editProfile
        },
    ]
 })

 export default router