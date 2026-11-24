<template>
  <div class="header-container w-full h-70px bg-#ebf1f6 shadow-sm">
    <div class="w-full h-full flex items-center justify-between px-6">
      <div class="sidebar-logo">
        <div v-if="!isCollapsed" class="logo-text">
          <span class="logo-text-blue">Ablaze</span>
          <span class="logo-text-orange">Admin</span>
        </div>
        <el-icon v-else :size="24" class="logo-icon">
          <component :is="'Monitor'" />
        </el-icon>
      </div>
      <div class="flex items-center">
        <div 
          class="admin-index mr-5 cursor-pointer hover:text-blue-500 transition-colors" 
          @click="goToMainApp">
          <span>网站首页</span>
        </div>
        
        <!-- 登录按钮，当未登录时显示 -->
        <div v-if="!isLoggedIn" class="login-btn mr-5">
          <el-button 
            type="primary" 
            size="small" 
            @click="router.push('/login')"
            class="flex items-center">
            <el-icon class="mr-1"><Key /></el-icon>
            登录
          </el-button>
        </div>
        
        <!-- 用户头像下拉菜单，当已登录时显示 -->
        <div v-if="isLoggedIn" class="user-dropdown">
          <el-dropdown placement="bottom">
            <el-avatar 
              class="user-avatar cursor-pointer" 
              :size="40"
              :src="store.currentAdmin.avatar || store.authCenterAdmin.avatar">
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="isAuthCenterAdmin" disabled>
                  <span class="text-blue-500">云存储管理员</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="isNormalAdmin" disabled>
                  <span class="text-green-500">系统管理员</span>
                </el-dropdown-item>
                <el-dropdown-item @click="logout()">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useMainStore } from '../../../store';
import { useAuthStore } from '../../../store';
import { inject, computed, ref, onMounted } from 'vue';
import { Key } from '@element-plus/icons-vue';

const router = useRouter();
const store = useMainStore();
const authStore = useAuthStore();
const http = inject('$http');
const constant = inject('$constant');

// 计算是否已登录 - 任一登录方式
const isLoggedIn = computed(() => {
  return (store.currentAdmin && store.currentAdmin.id) || 
         (store.authCenterAdmin && store.authCenterAdmin.id);
});

// 计算是否为普通管理员
const isNormalAdmin = computed(() => {
  return store.currentAdmin && store.currentAdmin.id;
});

// 计算是否为authCenter管理员
const isAuthCenterAdmin = computed(() => {
  return store.authCenterAdmin && store.authCenterAdmin.id;
});

// 用户信息
const userInfo = computed(() => store.userInfo);
const authUserInfo = computed(() => authStore.userInfo);

const logout = () => {
  // 优先使用Auth Center登出
  if (authStore.isAuthenticated) {
    authStore.logout();
  } else {
    // 兼容旧版登出
    store.handleLogout();
  }
  
  // 跳转到登录页
  router.push('/login');
};

const goToMainApp = () => {
  // 检查是否在qiankun环境中运行
  if (window.__POWERED_BY_QIANKUN__) {
    // 在qiankun环境中，通过window.history直接导航到主应用根路径
    window.history.pushState({}, '', '/');
    // 触发popstate事件，让主应用的路由系统感知到变化
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  } else {
    // 在独立运行环境中，使用绝对URL导航到主站
    window.location.href = '/';
  }
};
</script>

<style scoped>
.header-container {
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.logo {
  font-weight: 500;
}

.admin-index {
  font-size: 15px;
}

.user-avatar {
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.login-btn button {
  transition: all 0.3s;
}
/* Logo区域 */
.sidebar-logo {
  @apply flex items-center justify-center h-60px border-b border-gray-100;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%);
}

.logo-text {
  @apply text-xl font-bold;
}

.logo-text-blue {
  color: var(--ins-blue);
}

.logo-text-orange {
  color: var(--ins-orange);
}

.logo-icon {
  @apply text-blue-500;
}
.login-btn button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
