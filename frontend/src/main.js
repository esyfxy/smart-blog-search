import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import http from './utils/request'
import constant from './utils/constant'
import common from './utils/common'
import api from './utils/api'
import { useMainStore } from './store'
import { useEmojiStore } from './store/emoji'
// 引入qiankun
import { registerMicroApps, start } from 'qiankun'
import microApps from './micro/apps'

// 引入UnoCSS
import 'uno.css'

// 阻止子应用把 <style> 重复 append 到主 doc.head
const originAppend = HTMLHeadElement.prototype.appendChild;
HTMLHeadElement.prototype.appendChild = function (newChild) {
  if ((newChild).dataset?.qiankun) return newChild;
  return originAppend.call(this, newChild);
};

// 处理字体CORS问题
const originFetch = window.fetch;
window.fetch = function(...args) {
  // 如果是字体文件请求
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('.woff') || args[0].includes('.ttf') || args[0].includes('.woff2'))) {
    
    // 如果没有第二个参数，添加一个
    if (!args[1]) args[1] = {};
    
    // 确保有headers
    if (!args[1].headers) args[1].headers = {};
    
    // 添加CORS相关头
    args[1].mode = 'cors';
    args[1].credentials = 'omit';
    args[1].headers['Access-Control-Allow-Origin'] = '*';
  }
  
  return originFetch.apply(this, args);
};

// 引入json配置
import EMOJI_DEFAULT from './assets/json/emoji.json' 

// 引入jss
import './utils/title'

// 引入css
import './assets/css/animation.css'
import './assets/css/index.css'
import './assets/css/tocbot.css'
import './assets/css/color.css'
import './assets/css/markdown-highlight.css'
import './assets/css/font-awesome.min.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueLazyLoad from 'vue-lazyload'

// 使用内联的Base64图片代替缺失的图片文件
const loadingImg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMjJjNmZmIj4KICA8cGF0aCBvcGFjaXR5PSIuMjUiIGQ9Ik0xNiAwIEExNiAxNiAwIDAgMCAxNiAzMiBBMTYgMTYgMCAwIDAgMTYgMCBNMTYgNCBBMTIgMTIgMCAwIDEgMTYgMjggQTEyIDEyIDAgMCAxIDE2IDQiLz4KICA8cGF0aCBkPSJNMTYgMCBBMTYgMTYgMCAwIDEgMzIgMTYgTDI4IDE2IEExMiAxMiAwIDAgMCAxNiA0eiI+CiAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCAxNiAxNiIgdG89IjM2MCAxNiAxNiIgZHVyPSIwLjhzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L3BhdGg+Cjwvc3ZnPg=='
const errorImg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjU2YzZjIj4KICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtMmgydjJ6bTAtNGgtMlY3aDJ2NnoiLz4KPC9zdmc+'

// 确保CSS文件存在
try {
  require('./assets/css/main.css');
} catch (e) {
  console.warn('main.css not found, skipping import');
}

// 创建Vue应用
const app = createApp(App)

// 创建并配置pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 先使用pinia
app.use(pinia)

// 创建并初始化store
const store = useMainStore(pinia)
const emojiStore = useEmojiStore(pinia)

emojiStore.initEmoji(EMOJI_DEFAULT)
store.initStore()

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加全局属性，使其与Vue2的$store兼容
app.config.globalProperties.$store = {
  state: store,
  getters: {
    navigationBar: store.navigationBar,
    articleTotal: store.articleTotal
  },
  commit(action, payload) {
    // 映射commit到对应的action
    if (action === 'changeToolbarStatus') {
      store.changeToolbarStatus(payload)
    } else if (action === 'loadSortInfo') {
      store.loadSortInfo(payload)
    } else if (action === 'loadCurrentUser') {
      store.loadCurrentUser(payload)
    } else if (action === 'loadCurrentAdmin') {
      store.loadCurrentAdmin(payload)
    } else if (action === 'loadWebInfo') {
      store.loadWebInfo(payload)
    } else if (action === 'changePlaylist') {
      store.changePlaylist(payload)
    } else if (action === 'pushPlaylist') {
      store.pushPlaylist(payload)
    } else if (action === 'changeCurrentWallpaper') {
      store.changeCurrentWallpaper(payload)
    }
  }
}

// 配置全局属性
app.config.globalProperties.$http = http
app.config.globalProperties.$common = common
app.config.globalProperties.$constant = constant
app.config.globalProperties.$api = api
app.config.globalProperties.global = {
  showVideoPoster: false
}

// 为Vue3提供全局依赖注入
app.provide('$http', http)
app.provide('$common', common)
app.provide('$constant', constant)
app.provide('$api', api)
app.provide('$message', ElementPlus.ElMessage)
app.provide('global', {
  showVideoPoster: false
})

// 注册全局变量
window.faceReg = common.faceReg

// 注册微应用
registerMicroApps(microApps, {
  beforeLoad: [
    app => {
      console.log('before load app.name=', app.name)
    }
  ],
  beforeMount: [
    app => {
      console.log('before mount app.name=', app.name)
    }
  ],
  afterMount: [
    app => {
      console.log('after mount app.name=', app.name)
    }
  ],
  afterUnmount: [
    app => {
      console.log('after unmount app.name=', app.name)
    }
  ]
})

// 添加样式隔离辅助函数
function addStyleToShadowRoot(shadowRoot) {
  // 将主应用的基础样式复制到shadowRoot中
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
  styles.forEach(style => {
    if (style.getAttribute('href') && style.getAttribute('href').includes('element-plus')) {
      const linkClone = document.createElement('link');
      linkClone.setAttribute('rel', 'stylesheet');
      linkClone.setAttribute('href', style.getAttribute('href'));
      shadowRoot.appendChild(linkClone);
    }
  });
}

// 启动qiankun
start({
  prefetch: 'all', // 预加载所有微应用
  sandbox: {
    experimentalStyleIsolation: true, // 使用实验性的样式隔离
    strictStyleIsolation: false, // 使用严格的样式隔离
    speedy: true, // 启用speedy模式，提高性能
  },
  singular: true, // 单实例模式
  // 增加超时配置
  timeoutThreshold: 30000, // 30秒超时，默认是4秒
  // 全局fetch配置
  fetch(url, options = {}) {
    // 确保options和headers存在
    options = options || {};
    options.headers = options.headers || {};
    
    // 处理COS资源的跨域问题
    if (url.includes('cos.roginx.ink')) {
      console.log('处理COS资源:', url);
      return window.fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          ...options.headers,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 其他资源使用默认配置
    return window.fetch(url, options);
  }
})

// 使用其他插件
app.use(router)
app.use(ElementPlus)
app.use(VueLazyLoad, {
  preLoad: 1.3,
  error: errorImg,
  loading: loadingImg,
  attempt: 1
})

// 挂载应用
app.mount('#app')

console.log('%c hello world! \n Print by Roginshin. ', 
'background: #ed556a;line-height:50px;font-size:24px; color: #f6cec1;font-family:var(--globalFont)')