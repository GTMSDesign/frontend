import { createRouter, createWebHistory} from "vue-router";

import login from "@/views/public/login.vue";
import dashboard from "@/views/public/dashboard.vue";
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
            path: '/dashboard',
            component: dashboard
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