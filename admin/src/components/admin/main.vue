<template>
  <div class="main-container p-6">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section mb-8">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col md:flex-row items-center">
          <div class="p-8 md:p-10 flex-1">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">欢迎回来，管理员</h1>
            <p class="text-blue-100 text-lg mb-6">今天是美好的一天，开始管理您的网站吧</p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/postEdit">
                <button class="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all shadow-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                  </svg>
                  写文章
                </button>
              </router-link>
              
              <router-link to="/adminInit">
                <button class="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all shadow-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  登录系统②
                </button>
              </router-link>
              
              <button class="bg-transparent border border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white/10 transition-all flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                系统设置
              </button>
            </div>
          </div>
          <div class="hidden md:block p-6">
            <div class="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <img src="https://cdn.pixabay.com/photo/2018/09/24/08/31/pixel-cells-3699334_1280.png" alt="Dashboard Illustration" class="w-64 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷功能区域 -->
    <div class="quick-actions-section mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <div class="w-1 h-6 bg-orange-500 rounded-full mr-2"></div>
        快捷功能
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <router-link to="/login" class="block">
          <div class="quick-action-card bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border-t-4 border-orange-500">
            <div class="bg-orange-100 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <span class="text-gray-700 font-medium">登录系统</span>
          </div>
        </router-link>
        
        <div class="quick-action-card bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border-t-4 border-blue-500">
          <div class="bg-blue-100 p-3 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium">新建文章</span>
        </div>
        
        <div class="quick-action-card bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border-t-4 border-orange-500">
          <div class="bg-orange-100 p-3 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium">分类管理</span>
        </div>
        
        <div class="quick-action-card bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border-t-4 border-purple-500">
          <div class="bg-purple-100 p-3 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium">用户管理</span>
        </div>
        
        <div class="quick-action-card bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border-t-4 border-pink-500">
          <div class="bg-pink-100 p-3 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium">内容日历</span>
        </div>
        
        <div class="quick-action-card bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border-t-4 border-green-500">
          <div class="bg-green-100 p-3 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium">数据分析</span>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-section mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <div class="w-1 h-6 bg-blue-500 rounded-full mr-2"></div>
        数据概览
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 文章统计卡片 -->
        <div class="stat-card bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-blue-100 mb-1">文章总数</p>
              <h3 class="text-3xl font-bold">128</h3>
              <p class="mt-2 text-blue-100 text-sm">较上月 <span class="font-medium text-white">+12%</span></p>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 用户统计卡片 -->
        <div class="stat-card bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-purple-100 mb-1">用户总数</p>
              <h3 class="text-3xl font-bold">2,584</h3>
              <p class="mt-2 text-purple-100 text-sm">较上月 <span class="font-medium text-white">+8%</span></p>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 评论统计卡片 -->
        <div class="stat-card bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-orange-100 mb-1">评论总数</p>
              <h3 class="text-3xl font-bold">3,721</h3>
              <p class="mt-2 text-orange-100 text-sm">较上月 <span class="font-medium text-white">+24%</span></p>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 资源统计卡片 -->
        <div class="stat-card bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-pink-100 mb-1">资源总数</p>
              <h3 class="text-3xl font-bold">642</h3>
              <p class="mt-2 text-pink-100 text-sm">较上月 <span class="font-medium text-white">+15%</span></p>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动区域 -->
    <div class="recent-activity-section">
      <h2 class="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <div class="w-1 h-6 bg-blue-500 rounded-full mr-2"></div>
        最近活动
      </h2>
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="activity-timeline">
          <div class="activity-item flex mb-6">
            <div class="activity-icon bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div class="activity-content">
              <div class="flex items-center">
                <h4 class="font-medium text-gray-800">发布了新文章</h4>
                <span class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">刚刚</span>
              </div>
              <p class="text-gray-600 mt-1">《Vue3 和 UnoCSS 实战：打造现代化管理后台》</p>
            </div>
          </div>
          
          <div class="activity-item flex mb-6">
            <div class="activity-icon bg-orange-100 text-orange-600 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div class="activity-content">
              <div class="flex items-center">
                <h4 class="font-medium text-gray-800">收到新评论</h4>
                <span class="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">30分钟前</span>
              </div>
              <p class="text-gray-600 mt-1">用户"前端小王"在文章《Vue3 最佳实践》中发表了评论</p>
            </div>
          </div>
          
          <div class="activity-item flex">
            <div class="activity-icon bg-purple-100 text-purple-600 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="activity-content">
              <div class="flex items-center">
                <h4 class="font-medium text-gray-800">新用户注册</h4>
                <span class="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">2小时前</span>
              </div>
              <p class="text-gray-600 mt-1">用户"代码爱好者"完成了注册并验证了邮箱</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

// 这里可以添加获取统计数据的逻辑
onMounted(() => {
  // 初始化数据
  fetchDashboardData();
});

// 获取仪表盘数据的方法
const fetchDashboardData = () => {
  // 这里可以添加获取统计数据的API调用
  // 例如获取文章数、用户数、评论数等
};
</script>

<style scoped>
/* 卡片悬停效果 */
.stat-card {
  transition: all 0.3s ease;
}

/* 活动时间线样式 */
.activity-timeline {
  position: relative;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 30px;
  height: calc(100% - 60px);
  width: 2px;
  background-color: #e5e7eb;
  z-index: 0;
}

.activity-icon {
  z-index: 1;
  position: relative;
}

/* 快捷功能卡片悬停效果 */
.quick-action-card:hover {
  transform: translateY(-5px);
}
</style>
