<template>
  <div class="sidebar-container" :class="{ 'sidebar-hidden': isHidden }">
    <!-- 侧边栏主体 -->
    <div class="sidebar-wrapper" :class="{ 'sidebar-collapsed': isCollapsed }">      
      <el-menu 
        class="sidebar-menu"
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        unique-opened
        router>
        <template v-for="item in items" :key="item.index">
          <template v-if="item.subs">
            <el-sub-menu :index="item.index">
              <template #title>
                <el-icon><component :is="iconComponents[item.icon]" /></el-icon>
                <span>{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs" :key="subItem.index">
                <el-sub-menu v-if="subItem.subs" :index="subItem.index">
                  <template #title>{{ subItem.title }}</template>
                  <el-menu-item 
                    v-for="threeItem in subItem.subs" 
                    :key="threeItem.index" 
                    :index="threeItem.index">
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="subItem.index">
                  {{ subItem.title }}
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index">
              <el-icon><component :is="iconComponents[item.icon]" /></el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
    
    <!-- 折叠控制按钮 -->
    <div class="sidebar-controls">
      <div class="control-btn collapse-btn" @click="toggleCollapse" :title="isCollapsed ? '展开菜单' : '收起菜单'">
        <el-icon :size="16">
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </div>
      <div class="control-btn hide-btn" @click="toggleHidden" :title="isHidden ? '显示菜单' : '隐藏菜单'">
        <el-icon :size="16">
          <component :is="isHidden ? 'ArrowRight' : 'ArrowLeft'" />
        </el-icon>
      </div>
    </div>
    
    <!-- 隐藏状态下的触发区域 -->
    <div v-if="isHidden" class="sidebar-trigger" @click="toggleHidden" title="显示菜单">
      <el-icon :size="16"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../../../store';
import { 
  HomeFilled, 
  Setting, 
  User, 
  Document, 
  Notebook, 
  EditPen, 
  ChatDotRound, 
  Paperclip, 
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Fold,
  Expand,
  Monitor,
  Upload
} from '@element-plus/icons-vue';

// 获取store
const store = useMainStore();

// 判断是否为authCenter管理员
const isAuthCenterAdmin = computed(() => {
  return store.authCenterAdmin && store.authCenterAdmin.id;
});

// 侧边栏状态
const isCollapsed = ref(false);
const isHidden = ref(false);

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emitSidebarChange();
};

// 切换隐藏状态
const toggleHidden = () => {
  isHidden.value = !isHidden.value;
  emitSidebarChange();
};

// 发送侧边栏状态变更事件
const emitSidebarChange = () => {
  window.dispatchEvent(new CustomEvent('sidebar-change', { 
    detail: { 
      collapsed: isCollapsed.value,
      hidden: isHidden.value
    } 
  }));
};

// 获取当前路由
const route = useRoute();

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path;
});

// 图标组件映射
const iconComponents = reactive({
  HomeFilled,
  Setting,
  User,
  Document,
  Notebook,
  EditPen,
  ChatDotRound,
  Paperclip,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Fold,
  Expand,
  Monitor,
  Upload
});

// 菜单项
const items = computed(() => {
  // 基本菜单项
  const baseItems = [
  {
    icon: "HomeFilled",
    index: "/main",
    title: "系统首页",
    }
  ];
  
  // 普通管理员菜单项
  const normalAdminItems = [
    {
    icon: "Setting",
    index: "/FlexiSite",
    title: "全局控制",
  }, {
    icon: "Setting",
    index: "/webEdit",
    title: "网站设置",
  }, {
    icon: "User",
    index: "/userList",
    title: "用户管理"
  }, {
    icon: "Document",
    index: "/postList",
    title: "文章管理"
    }, {
    icon: "Document",
    index: "/postShuoshuo",
    title: "动态管理"
  }, {
    icon: "Notebook",
    index: "/sortList",
    title: "分类管理"
  }, {
    icon: "EditPen",
    index: "/commentList",
    title: "评论管理"
  }, {
    icon: "ChatDotRound",
    index: "/treeHoleList",
    title: "留言管理"
  }, {
    icon: "Paperclip",
    index: "/resourceList",
    title: "资源管理"
  }, {
    icon: "CreditCard",
    index: "/resourcePathList",
    title: "资源路径管理"
  }
  ];
  
  // 云存储管理员菜单项
  const cloudStorageItems = [
    {
      icon: "Upload",
      index: "/cosConfigList",
      title: "云存储配置"
    }
  ];
  
  // 根据登录状态返回不同的菜单项
  if (isAuthCenterAdmin.value) {
    // 如果是云存储管理员，只显示云存储相关菜单
    return [...baseItems, ...cloudStorageItems];
  } else {
    // 否则显示所有菜单
    return [...baseItems, ...normalAdminItems, ...cloudStorageItems];
  }
});
</script>

<style scoped>
/* 侧边栏容器 */
.sidebar-container {
  @apply fixed left-0 top-70px bottom-0 z-10 transition-all duration-300 ease-in-out bg-white;
  width: 220px;
}

/* 侧边栏隐藏状态 */
.sidebar-hidden {
  @apply transform -translate-x-full;
}

/* 侧边栏包装器 */
.sidebar-wrapper {
  @apply h-full flex flex-col bg-white shadow-sm transition-all duration-300 ease-in-out;
  width: 220px;
  border-right: 1px solid #f0f0f0;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.02) 0%, rgba(249, 115, 22, 0.02) 100%);
}

/* 侧边栏折叠状态 */
.sidebar-collapsed {
  width: 64px;
}
/* 菜单样式 */
.sidebar-menu {
  @apply flex-1 overflow-y-auto border-none;
  width: 100%;
}

.sidebar-menu::-webkit-scrollbar {
  @apply w-0;
}

/* 控制按钮区域 */
.sidebar-controls {
  @apply absolute top-1/2 -right-8 transform -translate-y-1/2 flex flex-col gap-2;
}

.control-btn {
  @apply w-24px h-24px flex items-center justify-center rounded-full bg-white shadow-sm cursor-pointer transition-all duration-200;
  border: 1px solid #f0f0f0;
}

.control-btn:hover {
  @apply shadow-md;
  background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
  color: white;
}

/* 隐藏状态下的触发区域 */
.sidebar-trigger {
  @apply fixed left-0 top-1/2 transform -translate-y-1/2 w-6px h-40px bg-white shadow-md rounded-r-md flex items-center justify-center cursor-pointer transition-all duration-200;
  border: 1px solid #f0f0f0;
  border-left: none;
}

.sidebar-trigger:hover {
  @apply w-8px shadow-lg;
  background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
  color: white;
}

/* 菜单样式 */
.sidebar-menu {
  @apply flex-1 overflow-y-auto border-none;
  width: 100%;
}

.sidebar-menu::-webkit-scrollbar {
  @apply w-0;
}

/* 菜单项样式 */
:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%) !important;
  color: #3b82f6 !important;
  border-right: 3px solid #3b82f6;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%) !important;
}

:deep(.el-menu--collapse) {
  width: 64px;
}

:deep(.el-menu--collapse) .el-sub-menu__title span {
  @apply hidden;
}

:deep(.el-menu--collapse) .el-sub-menu__title .el-sub-menu__icon-arrow {
  @apply hidden;
}

:deep(.el-menu) {
  border-right: none;
  background: transparent !important;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}
</style>
