<template>
    <div class="bottom-block">
        南京大学
    </div>
</template>

<script setup>
import { ref } from 'vue';

</script>


<style>
.bottom-block {
    position: fixed;
    /* 固定定位 */
    bottom: 0;
    /* 距离底部距离为0 */
    left: 0;
    /* 距离左侧距离为0 */
    width: 100%;
    /* 宽度占满整个页面 */
    background-color: #73116f;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
}
</style>