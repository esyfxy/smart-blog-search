<template>
  <div class="admin-entry">
    <!-- 这是一个空组件，实际内容将由qiankun加载的微应用提供 -->
    <div id="subapp-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {
  // 这里可以添加微应用加载前的准备工作
  console.log('Admin entry mounted, qiankun will load the micro app');
});

onUnmounted(() => {
  // 这里可以添加微应用卸载后的清理工作
  console.log('Admin entry unmounted');
});
</script>

<style scoped>
.admin-entry {
  height: 100%;
  width: 100%;
}

#subapp-container {
  height: 100%;
  width: 100%;
}
</style> 