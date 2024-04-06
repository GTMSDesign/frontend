import { createRouter, createWebHistory } from "vue-router";

import login from "@/views/public/login.vue";
import dashboard from "@/views/public/dashboard.vue";
import adminDashboard from "../views/admin/adminDashboard.vue";
import thesisStatus from "@/views/student/thesisStatus.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: login
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/dashboard',
            component: dashboard
        },
        {
            path: '/adminDashboard',
            component: adminDashboard
        },
        {
            path: '/thesisStatus',
            component: thesisStatus
        },
    ]
})
export default router