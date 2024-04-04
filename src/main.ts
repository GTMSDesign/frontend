import { createApp } from 'vue'
import App from './App.vue'

//路由
import router from './router'
//pinia
import { createPinia } from 'pinia'
//element plus
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
//使用路由器
app.use(router)
//使用pinia
const pinia = createPinia()
app.use(pinia)
//使用element plus
app.use(elementPlus)

app.mount('#app')
