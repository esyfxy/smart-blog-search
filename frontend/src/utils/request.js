import axios from "axios";
import constant from "./constant";
// 移除qs依赖

// 使用Vue 3的方式导入store
import { useMainStore } from "../store";

// 创建自定义参数序列化函数，替代qs
function serializeParams(params) {
  const parts = [];
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
      let val = params[key];
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
  }
  return parts.join('&');
}

axios.defaults.baseURL = constant.baseURL;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data !== null && response.data.hasOwnProperty("code") && response.data.code !== 200) {
    if (response.data.code === 300) {
      // 使用函数调用而不是直接访问store
      try {
        const store = useMainStore();
        if (store) {
          store.loadCurrentUser({});
          localStorage.removeItem("userToken");
          store.loadCurrentAdmin({});
          localStorage.removeItem("userToken");
        }
      } catch (e) {
        console.error('Failed to use store:', e);
        // 即使store访问失败，也要清除token
        localStorage.removeItem("userToken");
        localStorage.removeItem("userToken");
      }
      // window.location.href = constant.webURL + "/user";
    }
    return Promise.reject(new Error(response.data.message));
  } else {
    return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default {
  post(url, params = {}, isAdmin = false, json = true) {
    let config;
    if (isAdmin) {
      const userToken = localStorage.getItem("userToken");
      config = {
        headers: {"Authorization": userToken}
      };
      console.log('[HTTP] 管理员请求:', url, 'Token:', userToken ? '存在' : '不存在');
    } else {
      const userToken = localStorage.getItem("userToken");
      config = {
        headers: {"Authorization": userToken}
      };
      console.log('[HTTP] 用户请求:', url, 'Token:', userToken ? '存在' : '不存在');
    }

    // 处理数据格式
    let data = params;
    if (!json) {
      // 如果不是json格式，使用自定义序列化函数替代qs
      data = serializeParams(params);
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, data, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  get(url, params = {}, isAdmin = false) {
    let headers;
    if (isAdmin) {
      const userToken = localStorage.getItem("userToken");
      headers = {"Authorization": userToken};
      console.log('[HTTP] 管理员GET请求:', url, 'Token:', userToken ? '存在' : '不存在');
    } else {
      const userToken = localStorage.getItem("userToken");
      headers = {"Authorization": userToken};
      console.log('[HTTP] 用户GET请求:', url, 'Token:', userToken ? '存在' : '不存在');
    }

    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
        headers: headers
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    });
  },

  upload(url, param, isAdmin = false) {
    let config;
    if (isAdmin) {
      config = {
        headers: {"Authorization": localStorage.getItem("userToken"), "Content-Type": "multipart/form-data"}
      };
    } else {
      config = {
        headers: {"Authorization": localStorage.getItem("userToken"), "Content-Type": "multipart/form-data"}
      };
    }
    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  uploadQiniu(url, param) {
    let config = {
      headers: {"Content-Type": "multipart/form-data"},
      timeout: 60000
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
