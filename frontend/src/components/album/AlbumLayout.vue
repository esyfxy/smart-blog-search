<template>
  <div>
    <div v-if="loading" class="fixed top-0 left-0 w-full h-full z-1000 bg-[var(--background)]">
      <zombie></zombie>
    </div>
    
    <div v-else class="album-container">
      <!-- 首页图片 -->
      <el-image class="background-image animate-[header-effect_2s]"
                :src="albumPoster"
                @click="$emit('update:albumItems', albumItemsASync)"
                fit="cover">
        <template #error>
          <div class="image-slot background-image-error"></div>
        </template>
      </el-image>
      
      <!-- 首页文字 -->
      <div class="signature-wall flex justify-center items-center animate-[hideToShow_0.7s] absolute top-0 w-full h-full">
        <h1 class="playful">
          <span v-for="(a, index) in albumTitle" :key="index">{{a}}</span>
        </h1>
        <div class="printer cursor-pointer" @click="$emit('get-gushi')">
          <album-printer :printer-info="printerInfo">
            <template #paper="scope">
              <h3>
                {{ scope.content }}<span class="cursor">|</span>
              </h3>
            </template>
          </album-printer>
        </div>
        <input v-if="route.query.type === 'web'" 
               v-model="webUrl" 
               @keydown.enter="$emit('get-web')"
               class="webUrlInput">
        <div id="bannerWave1"></div>
        <div id="bannerWave2"></div>
        <i class="el-icon-arrow-down" @click="navigation('.page-container-wrap')"></i>
      </div>
      
      <div v-show="albumContent" class="page-container-content">
        <div class="aurora-content" v-html="albumContent"></div>
      </div>
      
      <!-- 内容区域 -->
      <slot></slot>
      
      <!-- 页脚 -->
      <div class="bg-[var(--background)]">
        <my-footer></my-footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useRoute } from 'vue-router';
import AlbumPrinter from './AlbumPrinter.vue';
import myFooter from '../common/myFooter.vue';
import zombie from '../common/zombie.vue';

// 路由相关
const route = useRoute();

// 定义属性
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  albumTitle: {
    type: String,
    default: "动态相册"
  },
  albumPoster: {
    type: String,
    default: ""
  },
  printerInfo: {
    type: String,
    default: "你看对面的青山多漂亮"
  },
  albumContent: {
    type: String,
    default: undefined
  },
  albumItemsASync: {
    type: Array,
    default: () => []
  },
  webType: {
    type: Object,
    default: () => ({})
  }
});

// 定义事件
defineEmits(['update:albumItems', 'get-gushi', 'get-web']);

// 计算属性
const webUrl = ref(props.webType.url || "");

// 监听 webUrl 变化
watch(webUrl, (newUrl) => {
  if (props.webType) {
    props.webType.url = newUrl;
  }
});

// 页面滚动导航
function navigation(selector) {
  let pageId = document.querySelector(selector);
  window.scrollTo({
    top: pageId.offsetTop,
    behavior: "smooth"
  });
}
</script>

<style scoped>
.album-container {
  position: relative;
}

.background-image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.background-image-error {
  width: 100%;
  height: 100vh;
  background-color: var(--background);
}

.page-container-content {
  background: var(--background);
  padding: 25px 15px;
  margin-top: -3px;
}

.page-container-content .aurora-content {
  margin: auto;
  max-width: 800px;
}

.webUrlInput {
  outline: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  background: none;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  letter-spacing: 1px;
  width: 300px;
  padding: 20px 8px 8px 8px;
  transition: .3s;
  border-bottom: 3px solid transparent;
}

.webUrlInput:hover,
.webUrlInput:focus {
  color: #FFF;
  left: 0;
  border-bottom: 3px solid #FFF;
}

.signature-wall {
  /* 向下排列 */
  display: flex;
  flex-direction: column;
  position: absolute;
  user-select: none;
  height: 100vh;
  overflow: hidden;
}

.playful {
  color: var(--white);
  font-size: 40px;
}

.printer {
  cursor: pointer;
  color: var(--white);
  background: var(--translucent);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

#bannerWave1 {
  height: 84px;
  background: var(--bannerWave1);
  position: absolute;
  width: 200%;
  bottom: 0;
  z-index: 10;
  animation: gradientBG 120s linear infinite;
}

#bannerWave2 {
  height: 100px;
  background: var(--bannerWave2);
  position: absolute;
  width: 400%;
  bottom: 0;
  z-index: 5;
  animation: gradientBG 120s linear infinite;
}

/* 光标 */
.cursor {
  margin-left: 1px;
  animation: hideToShow 0.7s infinite;
  font-weight: 200;
}

.el-icon-arrow-down {
  font-size: 40px;
  font-weight: bold;
  color: var(--white);
  position: absolute;
  bottom: 60px;
  animation: my-shake 1.5s ease-out infinite;
  z-index: 15;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .playful {
    font-size: 35px;
  }
}
</style> 