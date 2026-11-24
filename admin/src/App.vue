<template>
  <div class="admin-app-container">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// 在严格隔离模式下处理样式
const handleStyles = () => {
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // 获取shadow DOM根节点
    const shadowRoot = document.querySelector('#subapp-container').shadowRoot;
    if (!shadowRoot) return;
  }
};

onMounted(() => {
  console.log('子应用App组件已挂载');
  setTimeout(handleStyles, 100);
  const script = document.createElement('script');
  script.src = 'https://cdn.bootcdn.net/ajax/libs/qiniu-js/3.4.1/qiniu.min.js';
  document.head.appendChild(script);
});

onUnmounted(() => {
  console.log('子应用App组件已卸载');
});
</script>

<style>
:root {
  /* 基础颜色 */
  --orangeRed: #ff4500;
  --lightYellow: #ffefd5;
  --black: #333;
  --verifyImage: url(https://p2.music.126.net/hC0q2dGbOWHVfg4nkhIXPg==/109951165374881177.jpg?param=512y512);

  /* INS主题色 */
  --ins-blue: #3b82f6;
  --ins-blue-light: rgba(59, 130, 246, 0.1);
  --ins-orange: #f97316;
  --ins-orange-light: rgba(249, 115, 22, 0.1);
  
  /* 渐变色 */
  --gradient-blue-orange: linear-gradient(135deg, var(--ins-blue) 0%, var(--ins-orange) 100%);
  --gradient-blue-orange-light: linear-gradient(90deg, var(--ins-blue-light) 0%, var(--ins-orange-light) 100%);
  --gradient-blue-orange-bg: linear-gradient(180deg, rgba(59, 130, 246, 0.02) 0%, rgba(249, 115, 22, 0.02) 100%);
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.admin-app-container {
  @apply w-full h-full font-sans antialiased;
  color: var(--black);
}

/* 内容盒子样式 */
.content-box {
  @apply absolute left-200px right-0 top-70px bottom-0 transition-left duration-300 ease-in-out;
}

.content {
  @apply w-auto h-full p-30px overflow-y-auto;
}

/* Element Plus样式覆盖 */
:deep(.el-form-item__content) {
  @apply block !important;
}

/* 标签样式 */
.my-tag {
  @apply mb-20px w-full text-left border-none h-40px leading-40px text-16px;
  background: var(--lightYellow);
  color: var(--black);
}

/* 表格缩略图样式 */
.table-td-thumb {
  @apply rounded-2px w-40px h-40px;
}

/* 开关样式 */
.el-switch {
  @apply ml-10px;
}

/* 表单项样式 */
.el-form-item {
  @apply mb-40px;
}

/* 分页器样式 */
.pagination {
  @apply mt-5 mb-10 flex justify-center;
}

/* 表格样式 */
.el-table {
  @apply mb-5 w-full;
}

/* 表格底部留出足够空间 */
.el-table__body-wrapper {
  @apply overflow-y-auto;
}

/* 删除按钮样式 */
.el-button--text[style*="color: var(--orangeRed)"] {
  color: var(--orangeRed) !important;
}

/* 表格操作区按钮 */
.el-button--text {
  @apply mx-1 py-0.5;
}

/* 搜索区域样式 */
.handle-box {
  @apply mb-5;
}

/* 按钮间距 */
.mrb10 {
  @apply mr-2.5 mb-2.5;
}

/* INS风格按钮 */
.btn-ins {
  @apply relative overflow-hidden transition-all duration-300 text-white border-0;
  background: var(--gradient-blue-orange);
}

.btn-ins:hover {
  @apply shadow-md transform scale-105;
}

/* INS风格卡片 */
.card-ins {
  @apply rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100;
}

.card-ins-header {
  @apply p-4 border-b border-gray-100;
  background: var(--gradient-blue-orange-bg);
}

.card-ins-body {
  @apply p-6;
}

/* INS风格表单 */
.form-ins .el-input__inner:focus {
  border-color: var(--ins-blue);
}

.form-ins .el-input__inner:hover {
  border-color: var(--ins-orange);
}
</style> 