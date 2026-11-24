<template>
  <div class="app-container min-h-screen flex flex-col">
    <!-- 根据路由判断是否显示主应用内容 -->
    <template v-if="!isSubAppRoute">
      <main class="main-content flex-1">
        <!-- 主应用的路由视图 -->
        <router-view />
      </main>
      
    </template>
    
    <!-- 子应用容器 -->
    <div id="subapp-container" v-show="isSubAppRoute" class="w-full h-screen"></div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref, computed } from 'vue';
import { getAlistContent, getValue } from './utils/api.js';
import { useMainStore } from './store';
import { useEmojiStore } from './store/emoji';
import { useRoute } from 'vue-router';

// 使用ref创建响应式变量，而不是直接初始化store
const store = ref(null);
// 初始化emoji store
const emojiStore = useEmojiStore();

// 用于存储常量和emoji，防止this未定义报错
const constant = {
  playlists: [],
};

// 加载字体函数，解耦this
function loadFont(fontFamily) {
  // store.fonts 可能为 undefined，需防御
  const fonts = store.value?.fonts || [];
  const fontFamilyObj = fonts.find((font) => font.name === fontFamily);
  const fontUrl = fontFamilyObj?.href;

  if (fontUrl) {
    const fontLink = document.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('href', fontUrl);
    document.head.appendChild(fontLink);
    document.documentElement.style.setProperty('--globalFont', fontFamilyObj?.import || '');
  }
}

// 获取设置
function fetchSettings() {
  if (!store.value) return;
  
  getValue({ id: 2 }).then((res) => {
    if (res && res.code === 200) {
      const settings = res.data.value || {};

      // 本地存储
      if (settings.PLAYLIST_LIST) {
        localStorage.setItem("PLAYLIST_LIST", JSON.stringify(settings.PLAYLIST_LIST));
      }
      if (settings.COLLECTS_FLODER) {
        localStorage.setItem("COLLECTS_FLODER", JSON.stringify(settings.COLLECTS_FLODER));
      }
      if (settings.DEFAULT_WALLPAPER) {
        localStorage.setItem("DEFAULT_WALLPAPER", JSON.stringify(settings.DEFAULT_WALLPAPER));
      }
      if (!localStorage.getItem("favoriteWallpaper") && settings.favoriteWallpaper) {
        localStorage.setItem("favoriteWallpaper", JSON.stringify(settings.favoriteWallpaper));
      }

      // 处理歌单
      constant.playlists = Array.isArray(settings.playlist) ? settings.playlist : [];
      // 随机切换或推送歌单
      nextTick(() => {
        if (constant.playlists.length > 0) {
          const playlistAction = Math.random() < 0.5 ? "changePlaylist" : "pushPlaylist";
          const randomPlaylist = constant.playlists[Math.floor(Math.random() * constant.playlists.length)];
          if (playlistAction === "changePlaylist" && typeof store.value.changePlaylist === 'function') {
            store.value.changePlaylist(randomPlaylist);
          } else if (playlistAction === "pushPlaylist" && typeof store.value.pushPlaylist === 'function') {
            store.value.pushPlaylist(randomPlaylist);
          }
        }
      });

      // emoji - 使用pinia store处理
      if (Array.isArray(settings.emoji)) {
        emojiStore.addEmoji(settings.emoji);
      }

      // 字体
      if (Array.isArray(settings.fonts)) {
        store.value.fonts = settings.fonts;
        const defaultFont = localStorage.getItem("fontFamilyName") || (settings.fonts[2] && settings.fonts[2].name) || '';
        if (defaultFont) {
          loadFont(defaultFont);
        }
      }
    }
  }).catch(() => {});
}

// 获取壁纸内容
function fetchWallpaperContent() {
  getAlistContent({ path: "/wallpaper", password: "", page: 1, per_page: 20, refresh: false })
    .then((res) => {
      if (res && res.data && res.data.content) {
        window.localStorage.setItem("alistSource_wallpaperFolder", JSON.stringify(res.data.content));
      }
    })
    .catch((error) => {
      // 防止报错
      // 可以根据需要打印错误
      // console.error(error);
    });
}

// 生命周期钩子
onMounted(async () => {
  // 在组件挂载后初始化store
  store.value = useMainStore();
  
  // 获取设置和壁纸
  fetchSettings();
  fetchWallpaperContent();
  
  // 初始化wow.js
  if (window.WOW) {
    new window.WOW().init();
  }
});

// 判断当前路由是否为子应用路由
const route = useRoute()
const isSubAppRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>
