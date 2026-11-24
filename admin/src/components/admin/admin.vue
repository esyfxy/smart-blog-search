<template>
  <div class="admin-layout w-full h-screen flex flex-col overflow-hidden">
    <myHeader class="w-full flex-none" />
    <div class="flex-1 flex overflow-hidden">
      <sidebar class="flex-none" />
      <div class="content-box flex-1 overflow-hidden">
        <div class="content h-full overflow-auto p-8">
          <!-- 添加系统初始化入口按钮，只有在未登录authCenter时显示 -->
          <div v-if="!isAuthCenterAdmin" class="admin-init-button fixed bottom-6 right-6 z-50">
            <el-tooltip content="登录系统②" placement="left">
              <el-button 
                type="primary" 
                circle 
                size="large" 
                @click="router.push('/adminInit')"
                class="shadow-lg"
              >
                <el-icon><Key /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import myHeader from "./common/myHeader.vue";
import sidebar from "./common/sidebar.vue";
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Key } from '@element-plus/icons-vue';
import { useMainStore } from '../../store';

// 获取路由实例
const router = useRouter();
const store = useMainStore();

// 判断是否为authCenter管理员
const isAuthCenterAdmin = computed(() => {
  return store.authCenterAdmin && store.authCenterAdmin.id;
});

// 生命周期钩子
onMounted(() => {
  // 加载七牛云脚本
  const script = document.createElement('script');
  script.src = 'https://cdn.bootcdn.net/ajax/libs/qiniu-js/3.4.1/qiniu.min.js';
  document.head.appendChild(script);
  
  // 防止body出现滚动条
  document.body.style.overflow = 'hidden';
});
</script>

<style>
/* 全局样式修复 */
* {
  box-sizing: border-box;
}

/* 确保内容区域正确显示 */
.content {
  padding: 20px !important;
}

/* 表格样式优化 */
:deep(.el-table) {
  width: 100% !important;
  margin-bottom: 50px !important;
}

/* 分页器样式 */
:deep(.pagination) {
  margin: 20px 0 50px 0 !important;
  display: flex;
  justify-content: center;
}

/* 删除按钮颜色 */
:deep(.el-button--text[style*="color: var(--orangeRed)"]) {
  color: #ff4500 !important;
}

/* 初始化按钮样式 */
.admin-init-button .el-button {
  background: linear-gradient(135deg, #3b82f6, #f97316);
  border: none;
  transition: all 0.3s;
}

.admin-init-button .el-button:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
</style>
