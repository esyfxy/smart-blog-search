<template>
  <div class="myButton" @click="$emit('click')">
    <div :style="beforeStyle">{{ info }}</div>
    <div :style="afterStyle">{{ info }}</div>
    <div :style="afterStyle">{{ info }}</div>
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  info: {
    type: String,
    default: "确定"
  },
  before: {
    type: String,
    default: "black"
  },
  after: {
    type: String,
    default: "linear-gradient(45deg, #f43f3b, #ec008c)"
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// 使用toRefs解构props，保持响应性
const { before, after } = toRefs(props);

// 计算样式，使用computed保持响应性
const beforeStyle = computed(() => ({ background: before.value }));
const afterStyle = computed(() => ({ background: after.value }));

// 定义事件
defineEmits(['click']);
</script>

<style scoped>
.myButton {
  cursor: pointer;
  user-select: none;
  position: relative;
  width: 66px;
  height: 33px;
  border-radius: 4px;
  color: var(--white, #ffffff);
  font-size: 14px;
  overflow: hidden;
}

.myButton div {
  width: 66px;
  height: 33px;
  line-height: 33px;
  border-radius: 4px;
  text-align: center;
  position: absolute;
}

.myButton div:nth-child(2) {
  width: 100px;
  transition: all 0.3s ease;
  transform: translateX(-120px) skewX(-30deg);
}

.myButton div:nth-child(3) {
  transition: all 0.3s ease;
  transform: translateX(-120px);
}

.myButton:hover div:nth-child(2) {
  transform: translateX(20px) skewX(-30deg);
}

.myButton:hover div:nth-child(3) {
  transform: translateX(0px);
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 