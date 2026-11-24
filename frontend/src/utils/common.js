import constant from "./constant";
import EMOJI from "../assets/json/emoji.json"
import CryptoJS from 'crypto-js';
import { useMainStore } from "../store/index.js";
import { defineAsyncComponent } from 'vue';

export default {
  mobile() {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return flag && flag.length && flag.length > 0;
  },

  /**
   * 判断是否为空
   */
  isEmpty(value) {
    if (typeof value === "undefined" || value === null || (typeof value === "string" && value.trim() === "") || (Array.prototype.isPrototypeOf(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 加密
   */
  encrypt(plaintText) {
    let options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };
    let key = CryptoJS.enc.Utf8.parse(constant.cryptojs_key);
    let encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
    return encryptedData.toString().replace(/\//g, "_").replace(/\+/g, "-");
  },

  /**
   * 解密
   */
  decrypt(encryptedBase64Str) {
    let val = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
    let options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };
    let key = CryptoJS.enc.Utf8.parse(constant.cryptojs_key);
    let decryptedData = CryptoJS.AES.decrypt(val, key, options);
    return CryptoJS.enc.Utf8.stringify(decryptedData);
  },

  /**
   * 表情包转换
   */
  faceReg(content) {
    content = content.replace(/\[[^\[^\]]+\]/g, (word) => {
      let arr = [];
      let new_EMOJI = localStorage.getItem('emoji') ? JSON.parse(localStorage.getItem('emoji')) : EMOJI;
      new_EMOJI.forEach(element => {
        arr = arr.concat(element.emote);
      });
      let index = arr.findIndex(function(item) {
        return item.text === word;
      });
      if (index > -1) {
        let url = arr[index].url
        return '<img style="vertical-align: middle;width: 32px;height: 32px" src="' + url + '" title="' + word + '"/>';
      } else {
        return word;
      }
    });
    return content;
  },
  loadAssets(assets) {
    const head = document.getElementsByTagName('head')[0];
    const loadAsset = (asset) => {
      return new Promise((resolve, reject) => {
        let element;
        if (asset.type === 'js') {
          element = document.createElement('script');
          element.src = asset.src;
        } else if (asset.type === 'css') {
          element = document.createElement('link');
          element.href = asset.src;
          element.rel = 'stylesheet';
        }
        element.onload = () => {
          console.log(`Loaded ${asset.type} file: ${asset.src}`);
          resolve();
        };
        element.onerror = () => {
          console.error(`Error loading ${asset.type} file: ${asset.src}`);
          reject();
        };
        head.appendChild(element);
      });
    };
    return Promise.all(assets.map(loadAsset));
  },
  /**
   * 图片转换
   */
  pictureReg(content) {
    content = content.replace(/\<[^\<^\>]+\>/g, (word) => {
      let index = word.indexOf(",");
      if (index > -1) {
        let arr = word.replace("<", "").replace(">", "").split(",");
        return '<img style="border-radius: 5px;width: 100%;max-width: 250px;display: block" src="' + arr[1] + '" title="' + arr[0] + '"/>';
      } else {
        return word;
      }
    });
    return content;
  },

  /**
   * 字符串转换为时间戳
   */
  getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
  },

  getDateDiff(dateStr) {
    let publishTime = isNaN(Date.parse(dateStr.replace(/-/gi, "/")) / 1000) ? Date.parse(dateStr) / 1000 : Date.parse(dateStr.replace(/-/gi, "/")) / 1000;
    let d_seconds,
      d_minutes,
      d_hours,
      d_days,
      timeNow = Math.floor(new Date().getTime() / 1000),
      d,
      date = new Date(publishTime * 1000),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
      M = '0' + M;
    }
    if (D < 10) {
      D = '0' + D;
    }
    if (H < 10) {
      H = '0' + H;
    }
    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }
    d = timeNow - publishTime;
    d_days = Math.floor(d / 86400);
    d_hours = Math.floor(d / 3600);
    d_minutes = Math.floor(d / 60);
    d_seconds = Math.floor(d);
    if (d_days > 0 && d_days < 3) {
      return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
      if (d_seconds <= 0) {
        return '刚刚发表';
      } else {
        return d_seconds + '秒前';
      }
    } else if (d_days >= 3) {
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
    }
  },

  /**
   * 保存资源
   */
  saveResource(that, type, path, isAdmin = false) {
    let resource = {
      type: type,
      path: path
    };

    that.$http.post(that.$constant.baseURL + "/resource/saveResource", resource, isAdmin)
      .catch((error) => {
        that.$message({
          message: error.message,
          type: "error"
        });
      });
  }
}

/**
 * 处理异步组件导入，避免[object Promise]显示在页面上
 * @param {Function} importFn - 导入函数，例如 () => import('./component.vue')
 * @returns {Object} 处理后的组件
 */
export function asyncComponent(importFn) {
  return defineAsyncComponent({
    loader: importFn,
    delay: 200,
    timeout: 3000,
    errorComponent: {
      template: '<div>加载组件失败</div>'
    },
    loadingComponent: {
      template: '<div>加载中...</div>'
    }
  });
}
