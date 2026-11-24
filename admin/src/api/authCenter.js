import http from '../utils/request';
import { encrypt } from '../utils/common';

// Auth Center API前缀
const AUTH_CENTER_PREFIX = '[AuthCenter]';

/**
 * Auth Center API
 */
export const authCenterApi = {
  /**
   * 用户登录
   * @param {Object} data - 登录凭据
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  login: (data) => {
    console.log(`${AUTH_CENTER_PREFIX} API 发送登录请求`);
    return http.post('/api/auth-center/login', data, false, true, true);
  },
  
  /**
   * 刷新令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  refreshToken: (refreshToken) => {
    console.log(`${AUTH_CENTER_PREFIX} API 发送刷新令牌请求`);
    return http.post('/api/auth-center/refresh-token', { refreshToken }, false, true, true);
  },
  
  /**
   * 登出系统
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  logout: () => {
    console.log(`${AUTH_CENTER_PREFIX} API 发送登出请求`);
    return http.post('/api/auth-center/logout', {}, false, true, true);
  },
  
  /**
   * 获取用户会话列表
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getSessions: () => {
    console.log(`${AUTH_CENTER_PREFIX} API 获取会话列表`);
    return http.get('/api/auth-center/sessions', {}, false, true);
  },
  
  /**
   * 撤销指定会话
   * @param {string} sessionId - 会话ID
   * @returns {Promise} - HTTP DELETE请求的Promise对象
   */
  revokeSession: (sessionId) => {
    console.log(`${AUTH_CENTER_PREFIX} API 撤销会话:`, sessionId);
    return http.delete(`/api/auth-center/sessions/${sessionId}`, {}, false, true);
  },
  
  /**
   * 检查是否存在超级管理员
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  checkAdmin: () => {
    console.log(`${AUTH_CENTER_PREFIX} API 检查超级管理员`);
    return http.get('/api/auth-center/check-admin', {}, false, true);
  },
  
  /**
   * 初始化超级管理员
   * @param {Object} data - 包含用户名和密码的对象
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  initAdmin: (data) => {
    console.log(`${AUTH_CENTER_PREFIX} API 初始化超级管理员`);
    // 加密密码
    const adminData = {
      ...data,
      password: encrypt(data.password)
    };
    return http.post('/api/auth-center/init-admin', adminData, false, true, true);
  },
  
  /**
   * 获取用户资料
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getProfile: () => {
    console.log(`${AUTH_CENTER_PREFIX} API 获取用户资料`);
    return http.get('/api/auth-center/profile', {}, false, true);
  },
  
  /**
   * 验证令牌有效性
   * @param {string} token - 令牌
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  verifyToken: (token) => {
    console.log(`${AUTH_CENTER_PREFIX} API 验证令牌`);
    return http.post('/api/auth-center/verify-token', { token }, false, true, true);
  },
  
  /**
   * 获取当前管理员信息
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getCurrentAdminInfo: () => {
    console.log(`${AUTH_CENTER_PREFIX} API 获取当前管理员信息`);
    return http.get('/api/user/info', {}, false, true);
  }
}; 