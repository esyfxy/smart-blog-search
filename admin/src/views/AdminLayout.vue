<template>
  <div class="admin-layout">
    <admin-header></admin-header>
    <sidebar></sidebar>
    <div class="content-box" :class="{
      'content-box-collapsed': sidebarState.collapsed,
      'content-box-hidden': sidebarState.hidden
    }">
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMainStore } from '../store';
import AdminHeader from '../components/admin/common/myHeader.vue';
import Sidebar from '../components/admin/common/sidebar.vue';

// 侧边栏状态
const sidebarState = reactive({
  collapsed: false,
  hidden: false
});

// 路由实例
const router = useRouter();
const route = useRoute();

// store实例
const store = useMainStore();

// 监听侧边栏状态变化
const handleSidebarChange = (event) => {
  sidebarState.collapsed = event.detail.collapsed;
  sidebarState.hidden = event.detail.hidden;
  
  // 保存状态到localStorage，以便在页面刷新后恢复
  localStorage.setItem('sidebarState', JSON.stringify({
    collapsed: sidebarState.collapsed,
    hidden: sidebarState.hidden
  }));
};

// 检查认证状态
const checkAuth = () => {
  const token = localStorage.getItem('userToken');
  const adminInfo = store.currentAdmin;
  
  if (!token || !adminInfo || !adminInfo.id) {
    console.log('未登录，重定向到登录页');
    router.push('/admin/login');
  }
};

// 恢复侧边栏状态
const restoreSidebarState = () => {
  const savedState = localStorage.getItem('sidebarState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      sidebarState.collapsed = state.collapsed;
      sidebarState.hidden = state.hidden;
    } catch (e) {
      console.error('恢复侧边栏状态失败:', e);
    }
  }
};

onMounted(() => {
  // 检查认证状态
  checkAuth();
  
  // 检查当前路由路径
  console.log('当前路由路径:', route.path);
  
  // 恢复侧边栏状态
  restoreSidebarState();
  
  // 添加侧边栏状态变化监听
  window.addEventListener('sidebar-change', handleSidebarChange);
});

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('sidebar-change', handleSidebarChange);
});
</script>

<style scoped>
.admin-layout {
  @apply w-full h-screen relative;
}

.content-box {
  @apply right-0 top-70px bottom-0 transition-all duration-300 ease-in-out;
}

.content-box-collapsed {
  left: 64px;
}

.content-box-hidden {
  left: 0;
}

.content {
  @apply w-auto h-full p-30px overflow-y-auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style> 