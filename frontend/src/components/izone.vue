<template>
  <div>
    <wallwindow ref="wallwindow"></wallwindow>
    
    <!-- 顶部区域 -->
    <div class="signature-wall myCenter my-animation-hideToShow">
      <h1 class="playful">
        <span v-for="(a, index) in '💎我的空间💎'" :key="index">{{a}}</span>
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
        <div class="aside-content" v-if="showAside">
          <myAside class="aside-content-myAside"></myAside>
        </div>
        <div class="recent-posts">
          <div class="announcement background-opacity">
            <i class="fa fa-volume-up" aria-hidden="true"></i>
            <div>
              <div v-for="(notice, index) in store.webInfo.notices" :key="index">
                {{ notice }}
              </div>
            </div>
          </div>
          
          <!-- 初始加载状态 -->
          <div v-if="loading && articles.length === 0" class="initial-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
          </div>
          
          <!-- 文章列表 -->
          <div v-else ref="pictureList">
            <shuoshuo 
              v-for="(item, index) in filterArticles()" 
              :key="item.id || index" 
              :source="item"
              :class="[
                index % 2 === 0 ? 'animate-slide-top' : 'animate-slide-bottom',
                {'newly-loaded': item.isNew}
              ]"
            ></shuoshuo>
          </div>
          
          <!-- 分页区域 -->
          <div class="pagination-wrap">
            <div 
              @click="pageArticles()" 
              class="pagination" 
              v-if="pagination.total !== articles.length && !loadingMore"
            >
              下一页
            </div>
            <div v-else-if="loadingMore" class="loading-more">
              <div class="loading-more-spinner"></div>
              <div class="loading-more-text">加载更多中...</div>
            </div>
            <div v-else class="end-message">
              ~~到底啦~~
            </div>
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
import { ref, reactive, onMounted, inject } from 'vue';
import { useMainStore } from '../store';
import { ElMessage } from 'element-plus';

import zombie from "./common/zombie.vue";
import printer from "./common/printer.vue";
import shuoshuo from "./common/shuoshuo.vue";
import myFooter from "./common/myFooter.vue";
import myAside from "./myAside.vue";
import wallwindow from "./common/wallwindow.vue";

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');
const store = useMainStore();

// 响应式状态
const loading = ref(false);
const loadingMore = ref(false);
const showAside = ref(true);
const printerInfo = ref("你看对面的青山多漂亮");
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  keywords: ""
});
const showPosterVideo = ref(true);
const guShi = reactive({
  "content": "",
  "origin": "",
  "author": "",
  "category": ""
});
const articles = ref([]);
const pictureList = ref(null);

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

// 分页加载文章
const pageArticles = debounce(() => {
  // 如果正在加载更多，不触发新的加载
  if (loadingMore.value) return;
  
  loadingMore.value = true;
  pagination.current = pagination.current + 1;
  
  http.post(constant.baseURL + "/diary/listArticle", pagination)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        // 处理新加载的文章
        const newArticles = res.data.records.map(article => ({
          ...article,
          isNew: true // 标记为新加载的项目
        }));
        
        articles.value = articles.value.concat(newArticles);
        pagination.total = res.data.total;
        
        // 处理文章项目
        let obj = [[],[]];
        newArticles.forEach(article => {
          if (article.articleItems) {
            try {
              const items = JSON.parse(article.articleItems);
              if (Array.isArray(items) && items.length >= 2) {
                obj[0].push(...items[0]);
                obj[1].push(...items[1]);
              }
            } catch (e) {
              console.error('解析文章数据失败:', e);
            }
          }
        });
        
        // 延迟移除新项目标记，以便动画完成
        setTimeout(() => {
          newArticles.forEach(article => {
            article.isNew = false;
          });
        }, 1000);
      }
    })
    .catch((error) => {
      ElMessage.error(error.message || '加载更多失败');
    })
    .finally(() => {
      loadingMore.value = false;
    });
}, 300);

const filterArticles = () => {
  // 这里显示所有文章
  return articles.value;
  /* 如果需要权限过滤，取消注释下面的代码
  if (route.query.showAll)
    return articles.value;
  else if (!common.isEmpty(store.currentUser))
    return articles.value.filter(obj => obj.permission < 2);
  else 
    return articles.value.filter(obj => obj.permission < 1);
  */
};

const getArticles = () => {
  loading.value = true;
  
  http.post(constant.baseURL + "/diary/listArticle", pagination)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        articles.value = res.data.records.map(article => ({
          ...article,
          isNew: true // 标记为新加载的项目
        }));
        
        pagination.total = res.data.total;
        
        // 处理文章项目
        let obj = [[],[]];
        articles.value.forEach(article => {
          if (article.articleItems) {
            try {
              const items = JSON.parse(article.articleItems);
              if (Array.isArray(items) && items.length >= 2) {
                obj[0].push(...items[0]);
                obj[1].push(...items[1]);
              }
            } catch (e) {
              console.error('解析文章数据失败:', e);
            }
          }
        });
        
        // 延迟移除新项目标记，以便动画完成
        setTimeout(() => {
          articles.value.forEach(article => {
            article.isNew = false;
          });
        }, 1000);
      }
    })
    .catch((error) => {
      ElMessage.error(error.message || '获取文章列表失败');
    })
    .finally(() => {
      loading.value = false;
    });
};

const navigation = (selector) => {
  let pageId = document.querySelector(selector);
  window.scrollTo({
    top: pageId.offsetTop,
    behavior: "smooth"
  });
};

const getGuShi = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('get', constant.jinrishici);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const data = JSON.parse(xhr.responseText);
      guShi.content = data.content;
      guShi.origin = data.origin;
      guShi.author = data.author;
      guShi.category = data.category;
      printerInfo.value = data.content;
    }
  };
  xhr.send();
};

// 生命周期钩子
onMounted(() => {
  getGuShi();
  if (common.isEmpty(store.currentUser)) {
    ElMessage({
      message: "登录后可查看更多",
      type: "warning"
    });
  }
  getArticles();
  store.changePlaylist(370417370);
});
</script>

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
    transition: .5s;
  }

  .page-container {
    display: flex;
    justify-content: center;
    width: 90%;
    max-width: 1280px;
    padding: 0 20px 40px 20px;
    margin: 0 auto;
    flex-direction: row;
  }

  .recent-posts {
    width: 70%;
  }

  .announcement {
    padding: 22px;
    border: 1px dashed var(--lightGray);
    color: var(--greyFont);
    border-radius: 10px;
    display: flex;
    max-width: 780px;
    margin: 40px auto 40px;
  }

  .announcement i {
    color: var(--themeBackground);
    font-size: 22px;
    margin: auto 0;
    animation: scale 0.8s ease-in-out infinite;
  }

  .announcement div div {
    margin-left: 20px;
    line-height: 30px;
  }

  .aside-content {
    width: calc(30% - 40px);
    user-select: none;
    margin-top: 40px;
    margin-right: 40px;
    max-width: 300px;
    float: right;
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
    transition: all 0.3s ease;
  }
  
  .aside-content-myAside {
    position: sticky;
    top: 10px;
  }
  
  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }

  /* 初始加载状态 */
  .initial-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    margin: 40px 0;
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

  /* 加载更多样式 */
  .loading-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }

  .loading-more-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--themeBackground, #42b983);
    animation: spin 1s linear infinite;
  }

  .loading-more-text {
    margin-top: 10px;
    font-size: 14px;
    color: var(--fontColor, #333);
  }

  /* 结束提示 */
  .end-message {
    text-align: center;
    color: var(--fontColor);
    opacity: 0.6;
    user-select: none;
  }

  /* 动画效果 */
  .animate-slide-top {
    animation: slideTop 0.8s ease-in-out;
  }

  .animate-slide-bottom {
    animation: slideBottom 0.8s ease-in-out;
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

  @media screen and (max-width: 768px) {
    h1 {
      font-size: 35px;
    }
  }
</style>
