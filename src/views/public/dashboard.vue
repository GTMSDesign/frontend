<template>
    <div id="app">
        <el-container class="app-container">
            <!-- Header -->
            <Header />
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                <el-radio-button :value="false">expand</el-radio-button>
                <el-radio-button :value="true">collapse</el-radio-button>
            </el-radio-group> -->
            <el-container class="main-container">
                <!-- Sidebar -->
                <!-- icon地址：https://element-plus.org/zh-CN/component/icon.html -->
                <el-menu :router="false" :default-active="defaultActive" @select="handleMenuSelect"
                    background-color="#73116f" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
                    <el-tooltip effect="dark" content="论文状态" placement="right">
                        <el-menu-item index="/thesisStatus" class="menu-item">
                            <el-icon name="el-icon-s-data" class="menu-icon">
                                <Edit />
                            </el-icon>
                            论文状态
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="修改基本信息" placement="right">
                        <el-menu-item index="/editProfile" class="menu-item">
                            <el-icon name="el-icon-s-operation" class="menu-icon">
                                <Edit />
                            </el-icon>
                            修改基本信息
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="指导老师信息" placement="right">
                        <el-menu-item index="/advisor-info" class="menu-item">
                            <el-icon name="el-icon-user" class="menu-icon">
                                <Edit />
                            </el-icon>
                            指导老师信息
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="指导老师会话" placement="right">
                        <el-menu-item index="/advisor-conversations" class="menu-item">
                            <el-icon name="el-icon-chat-dot-round" class="menu-icon">
                                <Edit />
                            </el-icon>
                            指导老师会话
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="提交文档" placement="right">
                        <el-menu-item index="/submit-documents" class="menu-item">
                            <el-icon name="el-icon-document-add" class="menu-icon">
                                <Edit />
                            </el-icon>
                            提交文档
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="响应导师要求" placement="right">
                        <el-menu-item index="/respond-requests" class="menu-item">
                            <el-icon name="el-icon-tickets" class="menu-icon">
                                <Edit />
                            </el-icon>
                            响应导师要求
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="提交开题报告" placement="right">
                        <el-menu-item index="/submit-proposal" class="menu-item">
                            <el-icon name="el-icon-s-check" class="menu-icon">
                                <Edit />
                            </el-icon>
                            提交开题报告
                        </el-menu-item></el-tooltip>
                    <el-tooltip effect="dark" content="修改论文" placement="right">
                        <el-menu-item index="/edit-paper" class="menu-item">
                            <el-icon name="el-icon-edit-outline" class="menu-icon">
                                <Edit />
                            </el-icon>
                            修改论文
                        </el-menu-item></el-tooltip>
                </el-menu>
                <!-- Main content -->
                <el-main class="main-content">
                    <!-- Router view -->
                    <router-view></router-view>
                </el-main>
                <!-- 沉底块 -->
                <Footer />
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/public/header.vue'
import Footer from '@/components/public/footer.vue'
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { onMounted } from 'vue';

// 默认活跃的菜单项
const defaultActive = ref('/thesisStatus');
// 处理菜单选择
const handleMenuSelect = (index: string) => {
    router.push(index);
};
const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
onMounted(() => {
  // 当页面组件挂载时，获取当前路由路径并更新defaultActive
  defaultActive.value = router.currentRoute.value.path;
});
const router = useRouter();
</script>

<style scoped>
#app {
    height: 100vh;
    /* 使整个页面占满视口 */
    margin: 0;
    /* 去除默认的 margin */
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* 使容器占满 #app 的高度 */
}

.main-container {
    position: relative;
    /* 设置主容器为相对定位 */
    flex: 1;
    /* 使 main-container 占据剩余空间 */
}

.sidebar:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    background-color: #73116f;
    height: 100%;
}

.menu-item {
    color: #ccc;
    /* 设置字体颜色为灰色 */
    display: flex;
    align-items: center;
    /* 将图标与文字垂直居中 */
}

.menu-item.is-active {
    background-color: #63065f;
    /* 设置被选中标签的背景颜色 */
    color: #fff;
    /* 设置字体颜色为白色 */
}

.menu-icon {
    margin-right: 10px;
    /* 图标与文字之间的间距 */
    font-size: 16px;
    /* 图标大小 */
}

.main-content {
    position: relative;
    /* 设置主内容为相对定位 */
    padding-bottom: 40px;
    /* 留出底部沉底块的空间 */
}
</style>