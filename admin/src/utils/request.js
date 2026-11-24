import axios from 'axios';
import { ElMessage } from 'element-plus';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import mainAppBridge from './mainAppBridge';
import { useMainStore } from '../store';

// 清除认证中心相关的token和用户信息
const clearAuthCenterTokens = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');
  console.log('[AuthCenter] 已清除认证中心相关的token和用户信息');
};

// 创建axios实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const accessToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userToken = localStorage.getItem('userToken');
    
    // 判断是否使用认证中心的token
    const useAuthCenter = config.useAuthCenter === true;
    
    if (useAuthCenter && accessToken) {
      // 如果指定使用认证中心token且存在，则在请求头中添加，并带上Bearer前缀
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('[AuthCenter] 使用认证中心token，带Bearer前缀');
    } else if (userToken) {
      // 默认使用旧系统token，不带Bearer前缀
      config.headers.Authorization = `${userToken}`;
    }
    
    // 如果是刷新令牌请求，添加刷新令牌到请求头
    if (config.url.includes('/auth-center/refresh-token') && refreshToken) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }
    
    // 增强日志记录
    const logPrefix = useAuthCenter ? '[AuthCenter]' : '';
    console.log(`${logPrefix} 请求: ${config.method.toUpperCase()} ${config.url}`);
    console.log(`${logPrefix} 请求头:`, JSON.stringify(config.headers, null, 2));
    if (config.params && Object.keys(config.params).length > 0) {
      console.log(`${logPrefix} 请求参数:`, JSON.stringify(config.params, null, 2));
    }
    if (config.data) {
      console.log(`${logPrefix} 请求数据:`, JSON.stringify(config.data, null, 2));
    }
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 判断是否使用认证中心的token
    const useAuthCenter = response.config.useAuthCenter === true;
    const logPrefix = useAuthCenter ? '[AuthCenter]' : '';
    
    // 增强日志记录
    console.log(`${logPrefix} 响应: ${response.config.method.toUpperCase()} ${response.config.url}`);
    console.log(`${logPrefix} 响应状态码:`, response.status);
    console.log(`${logPrefix} 响应头:`, JSON.stringify(response.headers, null, 2));
    console.log(`${logPrefix} 响应数据:`, JSON.stringify(response.data, null, 2));
    
    // 检查响应中的业务状态码
    if (response.data && response.data.hasOwnProperty('code')) {
      if (response.data.code === 200) {
        return response.data;
      } else if (response.data.code === 300 || response.data.code === 401) {
        // 未授权，根据是否使用认证中心token处理登出和跳转
        console.error(`${logPrefix} 未授权: 代码=${response.data.code}, 消息=${response.data.message}`);
        
        if (useAuthCenter) {
          // 清除认证中心token
          clearAuthCenterTokens();
          
          // 显示错误消息
          ElMessage.error(`${logPrefix} 登录已过期，请重新登录`);
          
          // 如果不是登录页面，则重定向到登录页
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else {
          // 使用store处理旧系统的登出和跳转
          const store = useMainStore();
          store.handleAuthError(response.data.message || '登录已过期，请重新登录');
        }
        
        return Promise.reject(new Error(response.data.message || '登录已过期'));
      } else {
        // 其他业务错误
        console.error(`${logPrefix} 业务错误: 代码=${response.data.code}, 消息=${response.data.message}`);
        ElMessage.error(`${logPrefix} ${response.data.message || '请求失败'}`);
        return Promise.reject(new Error(response.data.message || '请求失败'));
      }
    }
    
    // 没有业务状态码，直接返回数据
    return response.data;
  },
  async error => {
    // 获取原始请求配置
    const originalRequest = error.config;
    const useAuthCenter = originalRequest?.useAuthCenter === true;
    const logPrefix = useAuthCenter ? '[AuthCenter]' : '';
    
    // 如果是401错误（未授权）且未尝试过刷新令牌，且使用认证中心token
    if (error.response?.status === 401 && !originalRequest._retry && useAuthCenter) {
      originalRequest._retry = true;
      
      try {
        // 获取刷新令牌
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // 尝试刷新令牌
          const response = await service.post('/auth-center/refresh-token', {
            refreshToken,
          }, { useAuthCenter: true });
          
          // 如果刷新成功
          if (response.code == 200 && response.data) {
            // 保存新的令牌
            localStorage.setItem('auth_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            
            // 更新请求头并重试原始请求，添加Bearer前缀
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return service(originalRequest);
          }
        }
      } catch (refreshError) {
        // 刷新令牌失败，清除令牌并重定向到登录页
        clearAuthCenterTokens();
        
        // 如果不是登录页面，则重定向到登录页
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // 处理响应错误
    console.error(`${logPrefix} 响应错误:`, error);
    
    // 获取错误状态码
    const status = error.response ? error.response.status : null;
    
    // 详细记录错误信息
    if (error.response) {
      console.error(`${logPrefix} 错误响应: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error(`${logPrefix} 状态码: ${status}`);
      console.error(`${logPrefix} 响应头:`, JSON.stringify(error.response.headers, null, 2));
      console.error(`${logPrefix} 错误数据:`, JSON.stringify(error.response.data, null, 2));
      
      // 记录特定的错误信息
      if (error.response.data) {
        const { code, error: errorType, message, originUrl } = error.response.data;
        if (code) console.error(`${logPrefix} 错误代码: ${code}`);
        if (errorType) console.error(`${logPrefix} 错误类型: ${errorType}`);
        if (message) {
          if (typeof message === 'string') {
            console.error(`${logPrefix} 错误消息: ${message}`);
          } else if (Array.isArray(message)) {
            console.error(`${logPrefix} 错误消息列表:`, message);
          }
        }
        if (originUrl) console.error(`${logPrefix} 原始URL: ${originUrl}`);
      }
    }
    
    // 根据状态码处理不同情况
    if (status === 401) {
      if (useAuthCenter) {
        // 清除认证中心token
        clearAuthCenterTokens();
        
        // 显示错误消息
        ElMessage.error(`${logPrefix} 登录已过期，请重新登录`);
        
        // 如果不是登录页面，则重定向到登录页
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        // 使用store处理旧系统的登出和跳转
        const store = useMainStore();
        store.handleAuthError('登录已过期，请重新登录');
      }
    } else if (status === 403) {
      // 权限不足
      ElMessage.error(`${logPrefix} 权限不足，无法访问`);
    } else if (status === 404) {
      // 资源不存在
      ElMessage.error(`${logPrefix} 请求的资源不存在`);
    } else if (status === 500) {
      // 服务器错误
      const errorMessage = error.response?.data?.message || '服务器错误';
      const errorType = error.response?.data?.error || '';
      ElMessage.error(`${logPrefix} 服务器错误${errorType ? `(${errorType})` : ''}: ${errorMessage}`);
    } else if (status === 400) {
      // 请求错误
      let errorMessage = '请求参数错误';
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (Array.isArray(message) && message.length > 0) {
          errorMessage = message[0]; // 显示第一个错误消息
        } else {
          errorMessage = message;
        }
      }
      ElMessage.error(`${logPrefix} ${errorMessage}`);
    } else {
      // 其他错误
      ElMessage.error(`${logPrefix} ${error.response?.data?.message || '请求失败，请稍后再试'}`);
    }
    
    return Promise.reject(error);
  }
);

// HTTP请求方法
const http = {
  /**
   * GET请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @param {boolean} isAdmin - 是否是管理员请求
   * @param {boolean} useAuthCenter - 是否使用认证中心token
   * @returns {Promise} - 返回Promise
   */
  get(url, params = {}, isAdmin = false, useAuthCenter = false) {
    // 优先使用主应用的HTTP服务
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      const mainHttp = mainAppBridge.getHttp();
      if (mainHttp && mainHttp.get) {
        return mainHttp.get(url, params, isAdmin);
      }
    }
    
    // 使用自己的HTTP服务
    const headers = isAdmin ? { 'X-Admin': 'true' } : {};
    
    return service({
      url,
      method: 'get',
      params,
      headers,
      useAuthCenter
    });
  },
  
  /**
   * POST请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {boolean} isAdmin - 是否是管理员请求
   * @param {boolean} json - 是否使用JSON格式
   * @param {boolean} useAuthCenter - 是否使用认证中心token
   * @returns {Promise} - 返回Promise
   */
  post(url, data = {}, isAdmin = false, json = true, useAuthCenter = false) {
    // 优先使用主应用的HTTP服务
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      const mainHttp = mainAppBridge.getHttp();
      if (mainHttp && mainHttp.post) {
        return mainHttp.post(url, data, isAdmin, json);
      }
    }
    
    // 使用自己的HTTP服务
    const headers = {
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded'
    };
    
    if (isAdmin) {
      headers['X-Admin'] = 'true';
    }
    
    return service({
      url,
      method: 'post',
      data,
      headers,
      useAuthCenter
    });
  },
  
  /**
   * PUT请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {boolean} isAdmin - 是否是管理员请求
   * @param {boolean} useAuthCenter - 是否使用认证中心token
   * @returns {Promise} - 返回Promise
   */
  put(url, data = {}, isAdmin = false, useAuthCenter = false) {
    // 优先使用主应用的HTTP服务
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      const mainHttp = mainAppBridge.getHttp();
      if (mainHttp && mainHttp.put) {
        return mainHttp.put(url, data, isAdmin);
      }
    }
    
    // 使用自己的HTTP服务
    const headers = isAdmin ? { 'X-Admin': 'true' } : {};
    
    return service({
      url,
      method: 'put',
      data,
      headers,
      useAuthCenter
    });
  },
  
  /**
   * DELETE请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @param {boolean} isAdmin - 是否是管理员请求
   * @param {boolean} useAuthCenter - 是否使用认证中心token
   * @returns {Promise} - 返回Promise
   */
  delete(url, params = {}, isAdmin = false, useAuthCenter = false) {
    // 优先使用主应用的HTTP服务
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      const mainHttp = mainAppBridge.getHttp();
      if (mainHttp && mainHttp.delete) {
        return mainHttp.delete(url, params, isAdmin);
      }
    }
    
    // 使用自己的HTTP服务
    const headers = isAdmin ? { 'X-Admin': 'true' } : {};
    
    return service({
      url,
      method: 'delete',
      params,
      headers,
      useAuthCenter
    });
  },
  
  /**
   * 上传文件
   * @param {string} url - 请求地址
   * @param {FormData} formData - 表单数据
   * @param {boolean} isAdmin - 是否是管理员请求
   * @param {boolean} useAuthCenter - 是否使用认证中心token
   * @returns {Promise} - 返回Promise
   */
  upload(url, formData, isAdmin = false, useAuthCenter = false) {
    // 优先使用主应用的HTTP服务
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      const mainHttp = mainAppBridge.getHttp();
      if (mainHttp && mainHttp.upload) {
        return mainHttp.upload(url, formData, isAdmin);
      }
    }
    
    // 使用自己的HTTP服务
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    
    if (isAdmin) {
      headers['X-Admin'] = 'true';
    }
    
    return service({
      url,
      method: 'post',
      data: formData,
      headers,
      useAuthCenter
    });
  }
};

export default http; 