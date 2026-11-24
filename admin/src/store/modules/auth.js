import { defineStore } from 'pinia';
import router from '../../router';
import { authCenterApi } from '../../api/authCenter';

// Auth Center状态管理
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('userToken') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
    userInfo: JSON.parse(localStorage.getItem('user_info') || '{}'),
    isAuthenticated: !!localStorage.getItem('userToken'),
  }),
  
  getters: {
    // 获取用户ID
    userId: (state) => state.userInfo.userId,
    
    // 获取用户名
    username: (state) => state.userInfo.username,
    
    // 获取用户角色
    roles: (state) => state.userInfo.roles || [],
    
    // 检查是否有特定角色
    hasRole: (state) => (role) => {
      return state.userInfo.roles?.includes(role) || false;
    },
  },
  
  actions: {
    // 设置认证信息
    setAuth(authData) {
      this.accessToken = authData.accessToken;
      this.refreshToken = authData.refreshToken;
      this.userInfo = {
        userId: authData.userId,
        username: authData.username,
        roles: authData.roles
      };
      this.isAuthenticated = true;
      
      // 保存到本地存储
      localStorage.setItem('userToken', authData.accessToken);
      localStorage.setItem('refresh_token', authData.refreshToken);
      localStorage.setItem('user_info', JSON.stringify(this.userInfo));
      
      console.log('[AuthCenter] 设置认证信息成功');
    },
    
    // 更新访问令牌
    updateAccessToken(accessToken) {
      this.accessToken = accessToken;
      localStorage.setItem('userToken', accessToken);
      console.log('[AuthCenter] 更新访问令牌成功');
    },
    
    // 清除认证信息
    clearAuth() {
      this.accessToken = '';
      this.refreshToken = '';
      this.userInfo = {};
      this.isAuthenticated = false;
      
      // 清除本地存储
      localStorage.removeItem('userToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      
      console.log('[AuthCenter] 清除认证信息成功');
    },
    
    // 登录
    async login(credentials) {
      try {
        console.log('[AuthCenter] 尝试登录...');
        const response = await authCenterApi.login(credentials);
        
        if (response.code == 200 && response.data) {
          this.setAuth(response.data);
          console.log('[AuthCenter] 登录成功');
          return response;
        }
        
        console.log('[AuthCenter] 登录失败:', response.message);
        return response;
      } catch (error) {
        console.error('[AuthCenter] 登录错误:', error);
        throw error;
      }
    },
    
    // 登出
    async logout() {
      try {
        console.log('[AuthCenter] 尝试登出...');
        // 调用登出API
        await authCenterApi.logout();
        console.log('[AuthCenter] 登出API调用成功');
      } catch (error) {
        console.error('[AuthCenter] 登出错误:', error);
      } finally {
        // 无论API调用成功与否，都清除本地认证信息
        this.clearAuth();
        
        // 重定向到登录页
        router.push('/login');
        console.log('[AuthCenter] 已重定向到登录页');
      }
    },
    
    // 刷新令牌
    async refreshToken() {
      try {
        console.log('[AuthCenter] 尝试刷新令牌...');
        if (!this.refreshToken) {
          throw new Error('没有可用的刷新令牌');
        }
        
        const response = await authCenterApi.refreshToken(this.refreshToken);
        
        if (response.code == 200 && response.data) {
          this.setAuth(response.data);
          console.log('[AuthCenter] 刷新令牌成功');
          return response.data;
        }
        
        console.log('[AuthCenter] 刷新令牌失败:', response.message);
        throw new Error('刷新令牌失败');
      } catch (error) {
        console.error('[AuthCenter] 刷新令牌错误:', error);
        this.clearAuth();
        router.push('/login');
        throw error;
      }
    },
    
    // 获取用户资料
    async fetchUserProfile() {
      try {
        console.log('[AuthCenter] 尝试获取用户资料...');
        if (!this.isAuthenticated) {
          throw new Error('用户未登录');
        }
        
        const response = await authCenterApi.getProfile();
        
        if (response.code == 200 && response.data) {
          // 更新用户信息
          const updatedUserInfo = {
            ...this.userInfo,
            ...response.data
          };
          
          this.userInfo = updatedUserInfo;
          localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
          
          console.log('[AuthCenter] 获取用户资料成功');
          return response.data;
        }
        
        console.log('[AuthCenter] 获取用户资料失败:', response.message);
        throw new Error('获取用户资料失败');
      } catch (error) {
        console.error('[AuthCenter] 获取用户资料错误:', error);
        throw error;
      }
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth-store',
        storage: localStorage,
        paths: ['accessToken', 'refreshToken', 'userInfo', 'isAuthenticated']
      }
    ]
  }
}); 