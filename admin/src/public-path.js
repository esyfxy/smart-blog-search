import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// 判断是否为生产环境
const isProd = typeof window !== 'undefined' && (
  window.location.href.includes('cos.roginx.ink') || 
  window.location.href.includes('roginx.ink') ||
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
);

// 如果是在qiankun环境中运行，则设置公共路径
if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  // 在生产环境下，手动设置为COS路径
  if (isProd) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || 'https://cos.roginx.ink/www/admin/';
    window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = 'https://cos.roginx.ink/www/admin/';
  } else {
    // 开发环境下使用qiankun注入的路径
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  }
  
  // 兼容vite
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN_FROM_MASTER__ = __webpack_public_path__;
  
  console.log('子应用publicPath已设置:', __webpack_public_path__);
} 