<template>
  <div class="loader-container">
    <!-- 加载动画，仅在loading为true时显示 -->
    <div v-if="props.loading" class="loader-overlay">
      <slot name="loader">
        <div class="default-loader">
          <div class="spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>
      </slot>
    </div>
    
    <!-- 内容，始终渲染但通过CSS控制可见性 -->
    <div class="content" :class="{ 'content-hidden': props.loading }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.loader-container {
  position: relative;
  width: 100%;
  min-height: 100px;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: var(--background, #ffffff);
}

.content {
  transition: opacity 0.3s ease;
  opacity: 1;
}

.content-hidden {
  opacity: 0;
  pointer-events: none;
}

/* 默认加载器样式 */
.default-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--background, rgba(0, 0, 0, 0.7));
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

.loading-text {
  color: white;
  font-size: 18px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
