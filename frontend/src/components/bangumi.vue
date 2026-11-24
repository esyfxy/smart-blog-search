<template>
  <div ref="bangumiView">
	<summary-card :class="{show: isHover}" :fitem="hoverItem" :style="summaryCardStyle"></summary-card>
    <div class="full-video-header">
      <label class="switch hoverOpa" style="z-index: 99;position:absolute;right:5vw;top:80px">
        <input type="checkbox" :checked="showPosterVideo" @change="showPosterVideo = $event.target.checked">
        <span class="slider"></span>
      </label>
      <video-background 
        :showPosterVideo="showPosterVideo"
        @update:showPosterVideo="showPosterVideo = $event"
        :videoIndex="videoIndex"
        @update:videoIndex="videoIndex = $event"
        :videoList="constant.favoriteVideo"
        :posterImage="constant.background.bangumi"
        :showControls="true"
      />
    </div>
    <div class="signature-wall myCenter my-animation-hideToShow">
      <h1 class="playful">
        <span v-for="(a, index) in '🎇分享追番列表🎇'" :key="index">{{a}}</span>
      </h1>
      <div class="printer" @click="getGuShi">
        <printer :printerInfo="printerInfo">
          <template #paper="scope">
            <h3>
              {{ scope.content }}<span class="cursor">|</span>
            </h3>
          </template>
        </printer>
      </div>
      <div id="bannerWave1"></div>
      <div id="bannerWave2"></div>
      <i class="el-icon-arrow-down" @click="navigation('.page-container-wrap')"></i>
    </div>
    <!-- 首页内容 -->
    <div class="page-container-wrap">
      <div class="page-container">
        <div class="bv_container">
          <div class="bv_font">🎃我的追番追剧🎃</div>
          
          <!-- 初始加载状态 -->
          <div v-if="loading && animeList.length === 0" class="initial-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
          </div>
          
          <!-- 番剧列表 -->
          <div class="bv_block" v-else>
            <anime 
              v-for="(item, index) in animeList" 
              :key="item.subject?.id || index"
              :fitem="item"
              @mouseout="isHover = false" 
              @mouseover="handleHover($event, item)"
              :class="[
                index % 2 === 0 ? 'animate-slide-top' : 'animate-slide-bottom',
                {'newly-loaded': item.isNew}
              ]"
            ></anime>
            
            <!-- 加载更多状态 -->
            <div v-if="loadingMore" class="loading-more-container">
              <div v-for="i in 6" :key="i" class="anime-skeleton animate-pulse"></div>
            </div>
          </div>
          
          <!-- 到底了提示 -->
          <div v-if="animeList.length > 0 && !canLoadMore && !loadingMore" class="end-message">
            — 已经到底啦 —
          </div>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <div style="background: var(--background)">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, inject } from 'vue';
import { useMainStore } from '../store';
import { storeToRefs } from 'pinia';

// 导入组件
import anime from '../components/common/anime.vue';
import summaryCard from "./common/summary.vue";
import printer from "./common/printer.vue";
import myFooter from "./common/myFooter.vue";
import videoBackground from "./common/videoBackground.vue";

// 导入API和工具函数
import { bangu_getCollection } from '../utils/api.js';
import { navigation } from '../utils/tools.js';

// 注入常量
const constant = inject('$constant');

// 使用Pinia store
const store = useMainStore();

// 响应式状态
const bangumiView = ref(null);
const loading = ref(true);
const loadingMore = ref(false);
const showPosterVideo = ref(true);
const videoIndex = ref(0);
const printerInfo = ref("观众眼中的热爱最为炽热");
const isHover = ref(false);
const animeList = ref([]);
const canLoadMore = ref(true);
const pageIndex = ref(1);
const pageSize = 24;

// 悬浮卡片相关
const hoverItem = reactive({
  subject: {
    short_summary: "",
    id: "",
    name: "",
    name_cn: ""
  },
  comment: "",
  rate: 0,
  ep_status: 0,
  type: 0
});
const summaryCardStyle = ref({});

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 获取动漫数据
const getAnime = (page, size) => {
  if (!canLoadMore.value) return;
  
  if (page === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }
  
  canLoadMore.value = false;
  
  // 计算偏移量
  const offset = (page - 1) * size;
  
  bangu_getCollection({
    subject_type: 2,
    limit: size,
    offset: offset
  }, (response) => {
    if (page === 1) {
      loading.value = false;
    } else {
      loadingMore.value = false;
    }
				
    // 错误处理
    if (!response || (response.code && response.code !== 200)) {
      console.error("获取数据失败:", response?.message || "未知错误");
      canLoadMore.value = true;
      return;
    }
				
    // 处理数据
    if (response.data && Array.isArray(response.data)) {
      // 处理并过滤数据
      const validData = response.data
        .filter(item => item && item.subject)
        .map(item => ({
          ...item,
          subject: {
            ...item.subject,
            short_summary: item.subject.short_summary || "",
            name: item.subject.name || "",
            name_cn: item.subject.name_cn || "",
            images: item.subject.images || { common: "" },
            eps: item.subject.eps || 0
          },
          comment: item.comment || "",
          rate: item.rate || 0,
          ep_status: item.ep_status || 0,
          type: item.type || 0,
          isNew: true // 标记为新加载的项目
        }));
      
      // 添加到列表
      animeList.value.push(...validData);
      
      // 延迟移除新项目标记，以便动画完成
      setTimeout(() => {
        validData.forEach(item => {
          item.isNew = false;
        });
      }, 1000);
    }
    
    // 恢复可加载状态
    canLoadMore.value = true;
  });
};

// 处理滚动加载
const handleScroll = debounce(() => {
  if (!bangumiView.value) return;
  
  // 如果正在加载中，不触发新的加载
  if (loading.value || loadingMore.value || !canLoadMore.value) return;
  
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  
  // 当滚动到接近底部时，加载下一页
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    pageIndex.value++;
    getAnime(pageIndex.value, pageSize);
  }
}, 200);

// 处理卡片悬浮
const handleHover = (event, item) => {
  isHover.value = true;
  
  // 更新悬浮项数据
  if (item && item.subject) {
    Object.assign(hoverItem, {
      ...item,
      subject: {
        ...item.subject,
        short_summary: item.subject.short_summary || "",
        id: item.subject.id || "",
        name: item.subject.name || "",
        name_cn: item.subject.name_cn || ""
      },
      comment: item.comment || "",
      rate: item.rate || 0,
      ep_status: item.ep_status || 0,
      type: item.type || 0
    });
  }
  
  // 计算位置
  const offset = event.currentTarget.getBoundingClientRect();
  if (offset.x > window.innerWidth / 2) {
    summaryCardStyle.value.left = `${offset.x - 240}px`;
  } else {
    summaryCardStyle.value.left = `${offset.x + offset.width}px`;
  }
  summaryCardStyle.value.top = `${offset.y}px`;
};

// 获取诗句
const getGuShi = () => {
  printerInfo.value = "观众眼中的热爱最为炽热";
};

// 生命周期钩子
onMounted(() => {
  // 设置播放列表
  if (store.changePlaylist) {
    store.changePlaylist(436692330);
  }
  
  // 加载数据
  getAnime(pageIndex.value, pageSize);
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .signature-wall {
    /* 向下排列 */
    display: flex;
    flex-direction: column;
    position: relative;
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

  .page-container-wrap {
    background: var(--background);
    position: relative;
	min-height: 100vh;
  }

  .page-container {
    display: flex;
    justify-content: center;
    width: 90%;
    padding: 0 0 40px 0;
    margin: 0 auto;
    flex-direction: row;
  }
  

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }
 
  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }

  @media screen and (max-width: 1100px) {
    .recent-posts {
      width: 100%;
    }

    .page-container {
      width: 100%;
    }
  }

  @media screen and (max-width: 1000px) {

    .page-container {
      /* 文章栏与侧标栏垂直排列 */
      flex-direction: column;
    }

    .aside-content {
      width: 100%;
      max-width: unset;
      float: unset;
      margin: 40px auto 0;
    }
  }


#BangumiView{
	color: var(--font-color);
	margin: auto;
	text-align:center;
	display:flex;
	width:100%;
}
.bv_container{
	width:100%;
}
.bv_font{
	font-size: 1.8rem;
	line-height: 3rem;
	height: 3rem;
    width: 100%;
	text-align: center;
}
.bv_block{
	position:relative;
	display: grid;
	flex-wrap: wrap;
	grid-gap: 20px;
	justify-content: center;
	grid-template-columns: repeat(6,160px);
    margin-top: 20px;
}
.bv_block::-webkit-scrollbar{
	display: none;
}
.pageBlock{
	display: flex;
    justify-content: center;
    text-align: center;
    height: 32px;
    list-style: none;
}
.pageBlock li {
    width: 32px;
    height: 32px;
    margin: 0 5px 0;
    line-height: 32px;
    color: var(--focus-color);
    background: #dc143c;
}
.pageBlock li.pageBlock_selcted,.pageBlock li:hover{
	background-color: var(--font-color);
	cursor: pointer;
} 
@media screen and (max-width: 768px) {
	.bv_block{
		position:relative;
		width:100%;
		max-height: 85vh;
		overflow-y:scroll;
		display: flex;
		flex-wrap: wrap;
		margin:0.8em auto;
		max-width: 340px;
	}
	
	h1 {
	font-size: 35px;
	}
}

/* 初始加载状态 */
.initial-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--themeBackground, #42b983);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

.loading-text {
  font-size: 16px;
  color: var(--fontColor, #333);
}

/* 加载更多容器 */
.loading-more-container {
  display: contents;
}

/* 骨架屏 */
.anime-skeleton {
  width: 160px;
  height: 220px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

/* 结束提示 */
.end-message {
  text-align: center;
  color: var(--fontColor);
  opacity: 0.6;
  margin: 20px 0;
  font-size: 14px;
}

/* 动画效果 */
.animate-slide-top {
  animation: slideTop 0.8s ease-in-out;
}

.animate-slide-bottom {
  animation: slideBottom 0.8s ease-in-out;
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.newly-loaded {
  animation: fadeIn 1s ease-in-out;
}

@keyframes slideTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
