import { createRouter, createWebHistory} from "vue-router";

import login from "@/views/public/login.vue";
import adminDashboard from "@/views/admin/adminDashboard.vue";

 const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path: '/login',
            component: login
        },
        {
            path: '/adminDashboard',
            component: adminDashboard
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
 })

 export default router