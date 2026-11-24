/**
 * 通用工具函数
 */
import constant from './constant';
import { useMainStore } from '../store';
import { ElMessage } from 'element-plus';
import CryptoJS from 'crypto-js';

/**
 * 判断是否为空
 */
export function isEmpty(value) {
  if (typeof value === "undefined" || value === null || 
      (typeof value === "string" && value.trim() === "") || 
      (Array.isArray(value) && value.length === 0) || 
      (typeof value === 'object' && Object.keys(value).length === 0)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 加密
 * @param {string} plaintText 明文
 * @returns {string} 密文
 */
export const encrypt = (plainText) => {
  // 获取加密密钥
  let cryptoKey = '';
  
  // 尝试从constant中获取密钥
  if (constant && constant.cryptojs_key) {
    cryptoKey = constant.cryptojs_key;
  } else {
    // 尝试从window.mainUtils中获取
    try {
      if (window.mainUtils && window.mainUtils.constant && window.mainUtils.constant.cryptojs_key) {
        cryptoKey = window.mainUtils.constant.cryptojs_key;
      }
    } catch (e) {
      console.error('Failed to get crypto key from mainUtils', e);
    }
    
    // 如果还是没有密钥，使用默认密钥
    if (!cryptoKey) {
      cryptoKey = defaultConstant.cryptojs_key;
    }
  }
  
  // 加密配置
  let options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  
  // 执行加密
  let key = CryptoJS.enc.Utf8.parse(cryptoKey);
  let encryptedData = CryptoJS.AES.encrypt(plainText, key, options);
  
  // 返回加密结果，替换特殊字符
  return encryptedData.toString().replace(/\//g, "_").replace(/\+/g, "-");
};

/**
 * 解密
 * @param {string} encryptedBase64Str 密文
 * @returns {string} 明文
 */
export function decrypt(encryptedBase64Str) {
  // 获取加密密钥
  let cryptoKey = '';
  
  // 尝试从constant中获取密钥
  if (constant && constant.cryptojs_key) {
    cryptoKey = constant.cryptojs_key;
  } else {
    // 尝试从window.mainUtils中获取
    try {
      if (window.mainUtils && window.mainUtils.constant && window.mainUtils.constant.cryptojs_key) {
        cryptoKey = window.mainUtils.constant.cryptojs_key;
      }
    } catch (e) {
      console.error('Failed to get crypto key from mainUtils', e);
    }
    
    // 如果还是没有密钥，使用默认密钥
    if (!cryptoKey) {
      cryptoKey = 'aoligeimeimaobin'; // 默认密钥
    }
  }
  
  // 替换特殊字符
  let val = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
  
  // 解密配置
  let options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
  
  // 执行解密
  let key = CryptoJS.enc.Utf8.parse(cryptoKey);
  let decryptedData = CryptoJS.AES.decrypt(val, key, options);
  
  // 返回解密结果
  return CryptoJS.enc.Utf8.stringify(decryptedData);
}

/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象或时间戳
 * @param {string} fmt 格式化模板，如 yyyy-MM-dd hh:mm:ss
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!date) return '';
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  
  return fmt;
}

/**
 * 保存资源
 */
export function saveResource(that, type, path, isAdmin = false) {
  const resource = {
    type: type,
    path: path
  };

  // 获取http服务
  let httpService;
  if (that && that.$http) {
    httpService = that.$http;
  } else {
    try {
      // 尝试从window获取
      if (window.mainUtils && window.mainUtils.http) {
        httpService = window.mainUtils.http;
      } else {
        // 使用本地导入的http
        const { default: http } = require('./request');
        httpService = http;
      }
    } catch (e) {
      console.error('Failed to get HTTP service', e);
      return;
    }
  }

  // 获取baseURL
  let baseURL;
  if (that && that.$constant && that.$constant.baseURL) {
    baseURL = that.$constant.baseURL;
  } else if (window.mainUtils && window.mainUtils.constant && window.mainUtils.constant.baseURL) {
    baseURL = window.mainUtils.constant.baseURL;
  } else {
    baseURL = constant.baseURL;
  }

  httpService.post(baseURL + "/resource/saveResource", resource, isAdmin)
    .catch((error) => {
      ElMessage({
        message: error.message || '保存资源失败',
        type: "error"
      });
    });
}

/**
 * 深拷贝对象
 * @param {Object} obj 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const clone = Array.isArray(obj) ? [] : {};
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  
  return clone;
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间，单位毫秒
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} interval 间隔时间，单位毫秒
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, interval) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 获取URL参数
 * @param {string} name 参数名
 * @returns {string|null} 参数值
 */
export function getUrlParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

/**
 * 检查对象是否为空
 * @param {Object} obj 要检查的对象
 * @returns {boolean} 是否为空
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
export function randomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 默认导出所有工具函数
export default {
  isEmpty,
  formatDate,
  saveResource,
  deepClone,
  debounce,
  throttle,
  getUrlParam,
  isEmptyObject,
  randomString,
  encrypt,
  decrypt
}; 