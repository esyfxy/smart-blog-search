import { defineStore } from 'pinia'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import mainAppBridge from '../utils/mainAppBridge'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '../router'
import { authCenterApi } from '../api/authCenter'
import { useAuthStore } from './modules/auth'
import { useCloudStorageStore } from './modules/cloudStorage'

// 导出store模块
export { useAuthStore, useCloudStorageStore }

export const useMainStore = defineStore('main', {
  state: () => ({
    // 管理员信息
    currentAdmin: {},
    
    // 用户信息（可能在某些场景需要）
    currentUser: {},
    
    // 网站信息
    webInfo: {
      webName: "",
      webTitle: [],
      notices: [],
      footer: "",
      backgroundImage: "",
      avatar: ""
    },
    mainAppData: null, // 存储主应用传递的数据
    userInfo: {},
    token: '',
    authCenterAdmin: {} // 添加authCenter管理员信息
  }),
  
  actions: {
    // 加载管理员信息
    loadCurrentAdmin(admin) {
      console.log('加载管理员信息:', admin);
      
      // 确保token被保存
      if (admin && admin.accessToken) {
        localStorage.setItem("userToken", admin.accessToken);
      }
      
      this.currentAdmin = admin;
      
      // 如果在微前端环境中，同步到主应用
      if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        console.log('同步管理员信息到主应用');
        mainAppBridge.setCurrentAdmin(admin);
      }
    },
    
    // 加载用户信息
    loadCurrentUser(user) {
      this.currentUser = user;
    },
    
    // 加载网站信息
    loadWebInfo(webInfo) {
      if (typeof webInfo.webTitle === 'string') {
        webInfo.webTitle = webInfo.webTitle.split('');
      }
      if (typeof webInfo.notices === 'string') {
        try {
          webInfo.notices = JSON.parse(webInfo.notices);
        } catch (e) {
          webInfo.notices = [];
        }
      }
      this.webInfo = webInfo;
    },
    
    // 从主应用同步状态
    syncFromMainApp() {
      if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        console.log('从主应用同步状态');
        const mainStore = mainAppBridge.getMainStore();
        if (mainStore && mainStore.state) {
          if (mainStore.state.currentAdmin) {
            this.currentAdmin = mainStore.state.currentAdmin;
            
            // 同步token
            if (mainStore.state.currentAdmin.accessToken) {
              localStorage.setItem("userToken", mainStore.state.currentAdmin.accessToken);
            }
          }
          if (mainStore.state.currentUser) {
            this.currentUser = mainStore.state.currentUser;
          }
          if (mainStore.state.webInfo) {
            this.loadWebInfo(mainStore.state.webInfo);
          }
        }
      }
    },
    
    // 清除管理员信息
    clearAdmin() {
      this.currentAdmin = {};
      localStorage.removeItem("userToken");
    },

    // 设置主应用传递的数据
    setMainAppData(data) {
      this.mainAppData = data;
      
      // 同步主应用的认证信息
      if (data && data.authToken) {
        this.token = data.authToken;
      }
      
      if (data && data.userInfo) {
        this.userInfo = data.userInfo;
      }
    },
    
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    
    // 设置token
    setToken(token) {
      this.token = token;
    },
    
    // 清除用户数据
    clearUserData() {
      this.userInfo = {};
      this.token = '';
    },
    
    // 登录成功后的操作
    loginSuccess({ userInfo, token }) {
      this.setUserInfo(userInfo);
      this.setToken(token);
    },
    
    // 退出登录
    logout() {
      this.clearUserData();
    },
    
    // 跳转到登录页
    redirectToLogin(redirect) {
      // 清除管理员信息
      this.clearAdmin();
      
      // 准备跳转参数
      const query = redirect ? { redirect } : {};
      
      // 处理跳转逻辑
      if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        // 在微前端环境中，使用history API导航
        const loginPath = '/login' + (redirect ? `?redirect=${encodeURIComponent(redirect)}` : '');
        window.history.pushState({}, '', loginPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        // 独立运行时，使用Vue Router导航
        router.push({ path: '/login', query });
      }
    },
    
    // 处理未登录或登录过期的情况
    handleAuthError(message) {
      // 显示错误消息
      if (window.ElMessage) {
        window.ElMessage.error(message || '登录已过期，请重新登录');
      } else {
        console.error(message || '登录已过期，请重新登录');
      }
      
      // 获取当前路径作为重定向目标
      let currentPath = '/';
      try {
        // 安全地获取当前路径
        if (router && router.currentRoute && router.currentRoute.value) {
          currentPath = router.currentRoute.value.fullPath;
        } else if (window.location && window.location.pathname) {
          // 回退到使用window.location
          currentPath = window.location.pathname + window.location.search;
        }
      } catch (error) {
        console.error('获取当前路径失败:', error);
      }
      
      // 跳转到登录页
      this.redirectToLogin(currentPath);
    },
    
    // 加载authCenter管理员信息
    loadAuthCenterAdmin(admin) {
      this.authCenterAdmin = admin || {};
    },
    
    // 清除authCenter管理员信息
    clearAuthCenterAdmin() {
      this.authCenterAdmin = {};
      localStorage.removeItem("authCenterToken");
    },
    
    // 跳转到authCenter登录页
    redirectToAuthCenterLogin(redirect) {
      // 清除管理员信息
      this.clearAuthCenterAdmin();
      
      // 准备跳转参数
      const query = redirect ? { redirect } : {};
      
      // 处理跳转逻辑
      if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        // 在微前端环境中，使用history API导航
        const loginPath = '/adminInit' + (redirect ? `?redirect=${encodeURIComponent(redirect)}` : '');
        window.history.pushState({}, '', loginPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        // 独立运行时，使用Vue Router导航
        router.push({ path: '/adminInit', query });
      }
    },

    // 获取当前管理员信息
    async fetchCurrentAdmin() {
      try {
        // 导入API
        const api = await import('../utils/api').then(m => m.default);
        
        // 调用API获取管理员信息
        const response = await api.admin.getInfo();
        
        if (response && response.data) {
          // 确保保存完整的管理员信息
          this.loadCurrentAdmin(response.data);
          return response.data;
        } else {
          throw new Error('获取管理员信息失败');
        }
      } catch (error) {
        console.error('获取管理员信息失败:', error);
        throw error;
      }
    },
    
    // 自动获取管理员信息
    async autoFetchAdminInfo() {
      const userToken = localStorage.getItem('userToken');
      if (!userToken || Object.keys(this.currentAdmin).length > 0) return;
      
      try {
        const res = await authCenterApi.getCurrentAdminInfo();
        if (res?.code === 200 && res.data) {
          this.loadCurrentAdmin(res.data);
        }
      } catch (e) {
        console.error('自动获取管理员信息失败:', e);
        if (e.message?.includes('401') || e.response?.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('freshToken');
          this.loadCurrentAdmin({});
        }
      }
    },
    
    // 初始化管理员store
    async initAdminStore() {
      await this.autoFetchAdminInfo();
      // 监听SSO token更新事件
      window.addEventListener('ssoTokenUpdated', () => this.autoFetchAdminInfo());
    }
  },
  
  getters: {
    // 判断用户是否已登录
    isLoggedIn: (state) => !!state.token,
    
    // 获取用户信息
    getUserInfo: (state) => state.userInfo,
    
    // 获取token
    getToken: (state) => state.token,
    
    // 获取主应用数据
    getMainAppData: (state) => state.mainAppData,
    
    // 判断是否为authCenter管理员
    isAuthCenterAdmin: (state) => {
      return state.authCenterAdmin && state.authCenterAdmin.id;
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'admin-store',
        storage: localStorage,
        paths: ['currentAdmin', 'authCenterAdmin', 'webInfo']
      }
    ]
  }
})