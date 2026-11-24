<template>
  <div ref="fullVideoHeader" class="full-video-header ">
    <div class="hoverOpa wallpaper-controller">
      <div class="wallpaper-controls">
        <div class="wallpaper-love-icon" :class="{ active: wallpaperFavoriteList.includes(store.currentWallpaper) }" ks-text="收藏到最爱壁纸" ks-tag="left">
          <i class="fa fa-heart" aria-hidden="true" @click.stop="addFavoriteWallpaper"></i>
        </div>
        <div class="wallpaper-love-icon" ks-text="上一张" ks-tag="left">
          <i class="fa fa-arrow-left" aria-hidden="true" @click.stop="changeWallpaper(-1)"></i>
        </div>
        <div class="wallpaper-love-icon" ks-text="随机刷新壁纸" ks-tag="left">
          <i class="fa fa-refresh" aria-hidden="true" @click.stop="changeWallpaper(0)"></i>
        </div>
        <div class="wallpaper-love-icon" ks-text="下一张" ks-tag="left">
          <i class="fa fa-arrow-right" aria-hidden="true" @click.stop="changeWallpaper(1)"></i>
        </div>
        <label ks-text="启用动态壁纸" ks-tag="left" class="switch">
          <input type="checkbox" :checked="store.showPosterVideo" @change="togglePosterVideo($event.target.checked)">
          <span class="slider"></span>
        </label>
      </div>
      <div class="wallpaper-info">
        <div class="wallpaper-love-icon theme-name">{{ currentWallpaperTheme || "我的最爱" }}</div>
        <div class="wallpaper-navigation">
          <div class="wallpaper-love-icon" ks-text="全屏" ks-tag="left">
            <i class="fa" :class="{'fa-compress': isFullScreen, 'fa-expand': !isFullScreen}" aria-hidden="true" @click.stop="toggleFullscreen"></i>
          </div>
          <div class="wallpaper-love-icon" ks-text="上一页" ks-tag="left">
            <i class="fa fa-arrow-left" aria-hidden="true" @click.stop="scrollTo('left')"></i>
          </div>
          <div class="wallpaper-love-icon" ks-text="下一页" ks-tag="left">
            <i class="fa fa-arrow-right" aria-hidden="true" @click.stop="scrollTo('right')"></i>
          </div>
        </div>
      </div>
      <div ref="wallSwitchTips" class="wallSwitch-tips overflow-x-auto no-scrollbar">
        <div class="wallSwitch-tips-item" 
             :class="{active: currentWallpaperTheme === item.name}"
             :ks-text="item.name" 
             ks-tag="right" 
             :key="item.name" 
             v-for="item in wallpaperFolder"
             @click.stop="changeWallpaperTheme(item.name)">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M777.514667 131.669333a53.333333 53.333333 0 0 1 0 75.434667L728.746667 255.829333h49.92A160 160 0 0 1 938.666667 415.872v320a160 160 0 0 1-160 160H245.333333A160 160 0 0 1 85.333333 735.872v-320a160 160 0 0 1 160-160h49.749334L246.4 207.146667a53.333333 53.333333 0 1 1 75.392-75.434667l113.152 113.152c3.370667 3.370667 6.186667 7.04 8.448 10.965333h137.088c2.261333-3.925333 5.12-7.68 8.490667-11.008l113.109333-113.152a53.333333 53.333333 0 0 1 75.434667 0z m1.152 231.253334H245.333333a53.333333 53.333333 0 0 0-53.205333 49.365333l-0.128 4.010667v320c0 28.117333 21.76 51.157333 49.365333 53.162666l3.968 0.170667h533.333334a53.333333 53.333333 0 0 0 53.205333-49.365333l0.128-3.968v-320c0-29.44-23.893333-53.333333-53.333333-53.333334z m-426.666667 106.666666c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z m320 0c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z" fill="#fff"></path>
          </svg>
        </div>
      </div>
      <div ks-text="切换声音" ks-tag="bottom">
        <div class="wallpaper-love-icon sound-toggle" @click.stop="toggleMuted">
          <div class="text-marquee">
            <i class="fa" :class="{'fa-volume-up': !store.isMuted, 'fa-volume-off': store.isMuted}" aria-hidden="true"></i>
            {{ getCurrentFileName }}
          </div>
        </div>
      </div>
      <el-select v-model="selectedFont" 
                placeholder="选择字体" 
                clearable 
                @change="handleFontChange"
                class="font-select">
        <el-option v-for="font in store.fonts" 
                  :key="font.name" 
                  :label="font.name" 
                  :value="font.name">
          <span :style="{ fontFamily: font.import }">{{ font.name }}</span>
        </el-option>
      </el-select>
    </div>
    <video ref="video" 
          class="background-image index-full-video" 
          autoplay 
          :muted="store.isMuted" 
          loop 
          :src="videoSource" 
          :poster="DEFAULT_WALLPAPER">
    </video>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useMainStore } from '../../store'
import { getAlistContent } from '../../utils/api'
import { navigation, isMobile } from '../../utils/tools'

// Store
const store = useMainStore()

// 响应式状态
const video = ref(null)
const fullVideoHeader = ref(null)
const wallSwitchTips = ref(null)
const isFullScreen = ref(false)
const selectedFont = ref(localStorage.getItem('fontFamilyName') || 'HarmonyOS Sans SC')
const wallpaperFolder = ref([])
const wallpaperList = ref([])
const wallpaperFavoriteList = ref([])
const currentWallpaperTheme = ref('')

// 计算属性
const DEFAULT_WALLPAPER = computed(() => {
  if (localStorage.getItem('DEFAULT_WALLPAPER')) {
    const wallpaper = JSON.parse(localStorage.getItem('DEFAULT_WALLPAPER'))
    return isMobile() ? wallpaper.PE : wallpaper.PC
  }
  return store.webInfo.backgroundImage
})

const videoSource = computed(() => {
  return store.showPosterVideo ? store.currentWallpaper : DEFAULT_WALLPAPER.value
})

// 修复 TypeError: Cannot read properties of undefined (reading 'match')
const getCurrentFileName = computed(() => {
  if (!store.currentWallpaper || typeof store.currentWallpaper !== 'string') {
    return ''
  }
  const match = store.currentWallpaper.match(/[^/]+$/)
  return match?.[0]?.split(".")?.[0] || ''
})

// 初始化壁纸
const initializeWallpaper = () => {
  wallpaperFolder.value = JSON.parse(localStorage.getItem('alistSource_wallpaperFolder') || '[]')
  wallpaperFavoriteList.value = JSON.parse(localStorage.getItem('favoriteWallpaper') || '[]')
  wallpaperList.value = wallpaperFavoriteList.value
  
  const shouldShowPosterVideo = localStorage.getItem('showPosterVideo') === 'true'
  store.setShowPosterVideo(shouldShowPosterVideo)
  store.setIsMuted(localStorage.getItem('isMuted') === 'true')

  setTimeout(() => {
    if (store.currentWallpaper) {
      changeWallpaper(0)
    } else {
      changeWallpaper(0)
    }
  }, 1000)
}

// 切换壁纸
const changeWallpaper = (index) => {
  if (index === 0 && wallpaperList.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * wallpaperList.value.length)
    store.changeCurrentWallpaper(wallpaperList.value[randomIndex])
  } else {
    const currentIndex = wallpaperList.value.indexOf(store.currentWallpaper)
    const newIndex = currentIndex + index
    if (newIndex >= 0 && newIndex < wallpaperList.value.length) {
      store.changeCurrentWallpaper(wallpaperList.value[newIndex])
    }
  }
}

// 切换壁纸主题
const changeWallpaperTheme = async (folder) => {
  currentWallpaperTheme.value = folder
  localStorage.setItem('currentWallpaperTheme', folder)
  
  try {
    const res = await getAlistContent({ 
      path: `/wallpaper/${folder}`, 
      password: '', 
      page: 1, 
      per_page: 100, 
      refresh: false 
    })
    
    const urlTemplate = `//alist.roginx.ink/d/wallpaper/${folder}/\${name}`
    wallpaperList.value = res.data.content.map(file => {
      return urlTemplate.replace('${name}', file.name)
    })
    
    changeWallpaper(0)
  } catch (error) {
    console.error('加载壁纸主题失败:', error)
  }
}

// 添加收藏壁纸
const addFavoriteWallpaper = () => {
  let favoriteList = JSON.parse(localStorage.getItem('favoriteWallpaper') || '[]')
  
  if (favoriteList.includes(store.currentWallpaper)) {
    favoriteList = favoriteList.filter(wallpaper => wallpaper !== store.currentWallpaper)
  } else {
    favoriteList.push(store.currentWallpaper)
  }
  
  wallpaperFavoriteList.value = favoriteList
  localStorage.setItem('favoriteWallpaper', JSON.stringify(favoriteList))
}

// 切换全屏
const toggleFullscreen = () => {
  isFullScreen.value = !isFullScreen.value
  
  if (isFullScreen.value) {
    const element = document.documentElement
    if (element.requestFullscreen) element.requestFullscreen()
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen()
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()
    else if (element.msRequestFullscreen) element.msRequestFullscreen()
  } else {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.msExitFullscreen) document.msExitFullscreen()
  }
}

// 滚动壁纸主题选择
const scrollTo = (direction) => {
  const container = wallSwitchTips.value
  if (!container) return
  
  const containerWidth = container.offsetWidth
  const contentWidth = container.scrollWidth
  const scrollLeft = container.scrollLeft
  let targetScrollLeft = direction === 'left' ? scrollLeft - containerWidth : scrollLeft + containerWidth

  // 边界处理
  if (targetScrollLeft <= -containerWidth) targetScrollLeft = contentWidth - containerWidth
  if (targetScrollLeft >= contentWidth) targetScrollLeft = 0
  if (targetScrollLeft < 0) targetScrollLeft = 0
  if (targetScrollLeft >= contentWidth - containerWidth) {
    targetScrollLeft = contentWidth - containerWidth
  }

  container.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  })
}

// 切换字体
const handleFontChange = () => {
  const fontFamily = store.fonts.find(font => font.name === selectedFont.value)
  if (!fontFamily) return
  
  localStorage.setItem('fontFamilyName', fontFamily.name)
  
  const fontUrl = fontFamily.href
  const fontLink = document.createElement('link')
  fontLink.setAttribute('rel', 'stylesheet')
  fontLink.setAttribute('href', fontUrl)
  document.head.appendChild(fontLink)
  
  document.documentElement.style.setProperty('--globalFont', fontFamily.import)
}

// 切换视频静音
const toggleMuted = () => {
  store.setIsMuted(!store.isMuted)
  localStorage.setItem('isMuted', store.isMuted)
}

// 切换动态壁纸
const togglePosterVideo = (value) => {
  store.setShowPosterVideo(value)
  localStorage.setItem('showPosterVideo', value)
  
  if (value) {
    document.body.classList.add('showPosterVideo', 'no-scrollbar')
  } else {
    document.body.classList.remove('showPosterVideo', 'no-scrollbar')
  }
  
  changeWallpaper(0)
}

// 键盘事件处理
const handleKeyDown = (event) => {
  if (!store.showPosterVideo) return

  if ([37, 38, 39, 40].includes(event.keyCode)) {
    event.preventDefault()
  }

  switch (event.keyCode) {
    case 37: // 左箭头
      changeWallpaper(-1)
      break
    case 39: // 右箭头
      changeWallpaper(1)
      break
    case 38: // 上箭头
      navigation('body')
      break
    case 40: // 下箭头
      navigation('.page-container-wrap')
      break
  }
}

// 监听store中的currentWallpaper变化
watch(() => store.currentWallpaper, (newValue) => {
  if (newValue) {
    // 可以在这里处理壁纸变化后的逻辑
  }
})

// 生命周期钩子
onMounted(() => {
  initializeWallpaper()
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.full-video-header {
  @apply select-none text-white;
}

.index-full-video {
  @apply w-full h-full bg-black object-cover object-center;
}

.wallpaper-controller {
  @apply flex flex-col absolute right-30px top-70px z-99;
  text-shadow: 2px 2px 3px #ff000088;
}

.wallpaper-controls,
.wallpaper-info,
.wallpaper-navigation {
  @apply flex justify-between;
}

.wallpaper-love-icon {
  @apply cursor-pointer inline-block h-34px mx-10px align-super leading-34px text-inherit text-white transition-600;
}

.wallpaper-love-icon:hover i,
.wallpaper-love-icon.active i {
  @apply transition-600 text-[#f25d64];
}

.wallSwitch-tips {
  @apply h-48px w-240px flex items-center text-22px;
}

.wallSwitch-tips-item {
  @apply m-10px w-20px inline-flex rounded-full h-20px cursor-pointer;
}

.wallSwitch-tips-item path {
  @apply transition-500;
}

.wallSwitch-tips-item.active svg path,
.wallSwitch-tips-item:hover path {
  fill: var(--themeBackground) !important;
}

.sound-toggle {
  @apply w-240px leading-34px text-20px relative whitespace-nowrap overflow-hidden text-ellipsis;
}

.text-marquee {
  @apply absolute overflow-visible right-0;
}

.font-select {
  @apply bg-[#f0f0f0] !important;
}

.switch {
  @apply relative inline-block w-60px h-34px;
}

.switch input {
  @apply opacity-0 w-0 h-0;
}

.slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] transition-400 rounded-34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--themeBackground, #2196F3);
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
