// 导入公共路径设置
import './public-path.js';
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'uno.css'
import App from './App.vue'
import routes, { setupRouterGuards } from './router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import http from './utils/request'
import mainAppBridge from './utils/mainAppBridge'
import constant from './utils/constant'
import common from './utils/common'
import api from './utils/api'
import { useMainStore } from './store'
// 导入新的Store模块
import { useAuthStore, useCloudStorageStore } from './store'

// 添加样式处理函数，解决沙箱隔离下的样式问题
function handleQiankunStyles() {
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // 确保子应用样式能够在严格隔离模式下正常工作
    const styleElements = document.querySelectorAll('style');
    styleElements.forEach(style => {
      style.setAttribute('data-qiankun', 'ablaze-admin');
    });

    // 监听动态添加的样式
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'STYLE' && !node.hasAttribute('data-qiankun')) {
              node.setAttribute('data-qiankun', 'ablaze-admin');
            }
          });
        }
      }
    });

    observer.observe(document.head, { childList: true, subtree: true });
  }
}

let app = null;
let router = null;
let pinia = null;

// 创建Vue应用的函数
function render(props = {}) {
  const { container } = props;
  
  console.log('子应用render函数被调用', container);
  
  // 创建路由实例
  const baseUrl = qiankunWindow.__POWERED_BY_QIANKUN__ ? '/admin' : '/';
  const history = createWebHistory(baseUrl);
  router = createRouter({
    history,
    routes
  });
  
  // 路由前置守卫，处理页面标题
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    next();
  });
  
  // 创建Vue应用
  app = createApp(App);
  
  // 创建并配置Pinia
  pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  
  // 如果是在qiankun环境中运行，将主应用传递的数据挂载到全局
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // 可以将主应用传递的数据挂载到Vue实例上
    app.config.globalProperties.$mainApp = props;
    // 处理样式问题
    handleQiankunStyles();
  }
  
  // 注册所有Element Plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  
  // 使用插件
  app.use(router).use(pinia).use(ElementPlus);
  
  // 初始化Store
  const store = useMainStore(pinia);
  const authStore = useAuthStore(pinia);
  const cloudStorageStore = useCloudStorageStore(pinia);
  
  // 应用路由守卫
  setupRouterGuards(router, store);
  
  // 初始化管理员store，自动获取管理员信息
  store.initAdminStore().catch(error => {
    console.error('初始化管理员store失败:', error);
  });
  
  // 确定使用哪些工具和常量
  // 如果在qiankun环境中，尝试使用主应用的工具
  let httpService = http;
  let constantData = constant;
  let commonUtils = common;
  let apiService = api;
  
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    const mainUtils = mainAppBridge.getMainUtils();
    if (mainUtils) {
      console.log('Using main app utils');
      if (mainUtils.http) httpService = mainUtils.http;
      if (mainUtils.constant) constantData = mainUtils.constant;
      if (mainUtils.common) commonUtils = mainUtils.common;
      if (mainUtils.api) apiService = mainUtils.api;
    } else {
      console.warn('Main app utils not available, using local utils');
    }
  }
  
  // 注册全局属性
  app.config.globalProperties.$http = httpService;
  app.config.globalProperties.$constant = constantData;
  app.config.globalProperties.$common = commonUtils;
  app.config.globalProperties.$mainBridge = mainAppBridge;
  app.config.globalProperties.$api = apiService;
  
  // 全局依赖注入
  app.provide('$http', httpService);
  app.provide('$constant', constantData);
  app.provide('$common', commonUtils);
  app.provide('$mainBridge', mainAppBridge);
  app.provide('$api', apiService);
  
  // 挂载应用
  let mountContainer;
  if (container) {
    // 检查容器内是否有#app元素
    mountContainer = container.querySelector('#app');
    // 如果没有，直接使用container
    if (!mountContainer) {
      console.log('在容器中未找到#app，直接使用容器');
      mountContainer = container;
    }
  } else {
    mountContainer = '#app';
  }
  console.log('挂载容器:', mountContainer);
  app.mount(mountContainer);
  
  // 如果是在qiankun环境中，处理主应用传递的数据
  if (qiankunWindow.__POWERED_BY_QIANKUN__ && props.mainAppData) {
    const mainStore = useMainStore(pinia);
    mainStore.setMainAppData(props.mainAppData);
  }
}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * qiankun生命周期钩子 - 必须导出
 */
export async function bootstrap() {
  console.log('[ablaze-admin] bootstrap');
  // 不要在bootstrap中执行复杂操作，保持轻量
  return Promise.resolve();
}

export async function mount(props) {
  console.log('[ablaze-admin] mount', props);
  render(props);
  return Promise.resolve();
}

export async function unmount() {
  console.log('[ablaze-admin] unmount');
  app?.unmount();
  app = null;
  router = null;
  pinia = null;
  return Promise.resolve();
}

export async function update(props) {
  console.log('[ablaze-admin] update', props);
  if (props.mainAppData && app && pinia) {
    try {
      const mainStore = useMainStore(pinia);
      if (mainStore && typeof mainStore.setMainAppData === 'function') {
        mainStore.setMainAppData(props.mainAppData);
      }
    } catch (error) {
      console.error('更新主应用数据失败:', error);
    }
  }
  return Promise.resolve();
}

// 使用renderWithQiankun包装生命周期钩子
renderWithQiankun({
  bootstrap,
  mount,
  unmount,
  update
});

// 确保生命周期函数被正确导出
window['bootstrap'] = bootstrap;
window['mount'] = mount;
window['unmount'] = unmount;
window['update'] = update; 