<template>
    <div id="app">
        <el-container class="app-container">
            <!-- Header -->
            <Header />
            <el-container class="main-container">
                <!-- Sidebar -->
                <el-menu :router="false" :default-active="defaultActive" @select="handleMenuSelect"
                    background-color="#73116f" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
                    <!-- Iterate over menuItems array -->
                    <template v-for="(menuItem, index) in menuItems" :key="index">
                        <el-tooltip :content="menuItem.tooltip" effect="dark" placement="right">
                            <el-menu-item :index="menuItem.index" class="menu-item">
                                <el-icon>
                                    <Setting />
                                </el-icon>
                                {{ menuItem.text }}
                            </el-menu-item>
                        </el-tooltip>
                    </template>
                </el-menu>
                <!-- Main content -->
                <el-main class="main-content">
                    <!-- Router view -->
                    <router-view></router-view>
                </el-main>
                <!-- Footer -->
                <Footer />
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/public/header.vue'
import Footer from '@/components/public/footer.vue'
import { RouterView, useRouter } from 'vue-router';
import { ref } from 'vue';
import { onMounted } from 'vue';

// Declare array to store menu items
const menuItems = ref([
    { index: '/accountManagement', tooltip: '管理账号', text: '管理账号' },
    { index: '/loginLogs', tooltip: '登录日志', text: '登录日志' },
]);

// Default active menu item
const defaultActive = ref('/accountManagement');

// Handle menu selection
const handleMenuSelect = (index: string) => {
    router.push(index);
};

const isCollapse = ref(false);

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
};

const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
};

const router = useRouter();

onMounted(() => {
    // Update defaultActive when the page component is mounted
    router.push(defaultActive.value);
});

</script>

<style scoped>
/* Styles remain the same */
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
