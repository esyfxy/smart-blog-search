/**
 * 常量配置
 * 在独立开发模式下使用，在微前端模式下会被主应用的常量覆盖
 */

import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// 根据环境确定基础URL
const getBaseURL = () => {
  // 生产环境
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // 微前端环境
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    return '/api';  // 带斜杠，确保API请求路径正确
  }
  
  // 独立开发环境
  return '/api';
};

export default {
  // 基础URL
  baseURL: getBaseURL(),
  
  // 七牛云上传URL
  qiniuUrl: 'https://upload-z2.qiniup.com',
  
  // 七牛云下载域名
  qiniuDownload: 'https://img.roginx.ink/',
  
  // 默认头像
  defaultAvatar: 'https://img.roginx.ink/default/avatar.jpg',
  
  // 加密密钥，与主应用保持一致
  cryptojs_key: 'aoligeimeimaobin',
  
  // 按钮颜色
  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b, #ec008c)",
  before_color_2: "rgb(131, 123, 199)",
  after_color_2: "linear-gradient(45deg, #f43f3b, #ec008c)",
  
  // 网站信息
  webInfo: {
    webName: 'Ablaze Admin',
    webTitle: 'Ablaze Admin System',
    footer: '© 2023 Ablaze Admin'
  }
}; 