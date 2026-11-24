<template>
  <div class="home-container">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 首页组件加载完成后的逻辑
  console.log('Home view mounted');
});
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
}
</style> 