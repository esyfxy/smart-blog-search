import http from '../utils/request';

// 云存储API前缀
const CLOUD_STORAGE_PREFIX = '[CloudStorage]';

/**
 * 云存储API
 */
export const cloudStorageApi = {
  /**
   * 获取云存储配置列表
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getList: () => {
    // 检查token是否存在
    const token = localStorage.getItem('auth_token');
    console.log(`${CLOUD_STORAGE_PREFIX} API 获取配置列表，当前token:`, token);
    
    return http.get('/api/cloud-storage/config', {}, false, true);
  },
  
  /**
   * 获取云存储配置详情
   * @param {number} id - 配置ID
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getDetail: (id) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 获取配置详情:`, id);
    return http.get(`/api/cloud-storage/config/${id}`, {}, false, true);
  },
  
  /**
   * 创建云存储配置
   * @param {Object} data - 配置信息
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  create: (data) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 创建配置`);
    return http.post('/api/cloud-storage/config', data, false, true, true);
  },
  
  /**
   * 更新云存储配置
   * @param {number} id - 配置ID
   * @param {Object} data - 配置信息
   * @returns {Promise} - HTTP PUT请求的Promise对象
   */
  update: (id, data) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 发送更新请求: ID=${id}, URL=/api/cloud-storage/config/${id}`);
    // 创建一个不包含id字段的新对象，避免TypeORM的empty criteria错误
    const { id: _, ...updateData } = data;
    return http.put(`/api/cloud-storage/config/${id}`, updateData, false, true);
  },
  
  /**
   * 删除云存储配置
   * @param {number} id - 配置ID
   * @returns {Promise} - HTTP DELETE请求的Promise对象
   */
  delete: (id) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 删除配置:`, id);
    return http.delete(`/api/cloud-storage/config/${id}`, {}, false, true);
  },
  
  /**
   * 测试云存储配置连接
   * @param {Object} data - 配置信息
   * @returns {Promise} - HTTP POST请求的Promise对象
   */
  testConnection: (data) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 测试连接`);
    return http.post('/api/cloud-storage/config/test-connection', data, false, true, true);
  },
  
  /**
   * 设置默认配置
   * @param {number} id - 配置ID
   * @returns {Promise} - HTTP PUT请求的Promise对象
   */
  setDefault: (id) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 设置默认配置:`, id);
    return http.put(`/api/cloud-storage/config/${id}/default`, {}, false, true);
  },
  
  /**
   * 修改配置启用状态
   * @param {number} id - 配置ID
   * @param {boolean} isEnabled - 是否启用
   * @returns {Promise} - HTTP PUT请求的Promise对象
   */
  changeStatus: (id, isEnabled) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 修改配置状态: ID=${id}, 启用=${isEnabled}`);
    return http.put(`/api/cloud-storage/config/${id}/status`, { isEnabled }, false, true);
  },
  
  /**
   * 获取上传凭证
   * @param {Object} params - 参数对象，可包含configName（配置名称）或prefix（文件路径前缀）
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getUploadToken: (params) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 获取上传凭证`, params);
    // 确保params作为查询参数传递
    return http.get('/api/cloud-storage/temp-credentials', params, false, true);
  },
  
  /**
   * 获取上传URL
   * @param {Object} params - 参数对象
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getUploadUrl: (params) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 获取上传URL`);
    return http.get('/api/cloud-storage/upload-url', params, false, true);
  },
  
  /**
   * 获取文件URL
   * @param {Object} params - 参数对象
   * @returns {Promise} - HTTP GET请求的Promise对象
   */
  getFileUrl: (params) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 获取文件URL`);
    return http.get('/api/cloud-storage/file-url', params, false, true);
  },
  
  /**
   * 删除文件
   * @param {Object} data - 文件信息
   * @returns {Promise} - HTTP DELETE请求的Promise对象
   */
  deleteFile: (data) => {
    console.log(`${CLOUD_STORAGE_PREFIX} API 删除文件`);
    return http.delete('/api/cloud-storage', data, false, true);
  }
}; 