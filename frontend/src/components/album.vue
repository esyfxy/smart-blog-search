<template>
  <album-layout
    :loading="loading"
    :album-title="albumTitle"
    :album-poster="albumPoster"
    :printer-info="printerInfo"
    :album-content="albumContent"
    :album-items-a-sync="albumItemsASync"
    :web-type="webType"
    @get-gushi="getGuShi"
    @get-web="getWeb"
    @update:album-items="albumItems = $event">
    
    <!-- Aurora首页内容 -->
    <album-grid 
      v-if="!route.query.type" 
      :album-items="albumItems" 
      :articles="articles" 
      :pagination="pagination"
      @page="pageArticles"
      @router-aurora="routerAurora"
      ref="gridAuroraRef">
    </album-grid>
    
    <!-- 图片列表 -->
    <album-gallery 
      v-if="route.query.type" 
      :album-items="albumItems" 
      :pagination="pagination"
      @page="pageArticles"
      ref="gridGalleryRef">
    </album-gallery>
  </album-layout>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AlbumLayout from './album/AlbumLayout.vue';
import AlbumGrid from './album/AlbumGrid.vue';
import AlbumGallery from './album/AlbumGallery.vue';
import AlbumService from './album/AlbumService';
import AlbumDataService from './album/AlbumDataService';
import constant from '../utils/constant';

// 路由相关
const route = useRoute();
const router = useRouter();

// 状态数据
const loading = ref(false);
const albumLoading = ref(true);
const albumTitle = ref("动态相册");
const albumPoster = ref(constant.two_poem_image[0]);
const printerInfo = ref("你看对面的青山多漂亮");
const albumContent = ref(undefined);
const gridAuroraRef = ref(null);
const gridGalleryRef = ref(null);

// 分页数据
const pagination = reactive({
  current: 1,
  size: route.query.type ? 10 : 30,
  total: 0,
  keywords: ""
});

// 古诗数据
const guShi = reactive({
  "content": "",
  "origin": "",
  "author": "",
  "category": ""
});

// 网页类型数据
const webType = reactive({
  url: route.query.url || "https://www.roginx.ink/v/daily_picture.html" || "https://www.evacg.cc/"
});

// 数据列表
const articles = ref([]);
const albumItems = ref([]);
const albumItemsASync = ref([]);

// 路由映射
const routerMap = {
  "aurora": getAurora,
  "acg": getRandom,
  "web": getWeb,
  "dynamic": getDynamic,
  "origin": getOrigin
};

// 组件挂载后初始化
onMounted(() => {
  loading.value = true;
  // 获取古诗
  getGuShi();
  
  // 根据路由类型加载数据
  if (!route.query.type) {
    getArticles()
      .catch(error => {
        ElMessage({
          message: "加载数据失败，请刷新重试",
          type: "error"
        });
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    try {
      routerMap[route.query.type]("")
        .catch(error => {
          ElMessage({
            message: "加载数据失败，请刷新重试",
            type: "error"
          });
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (error) {
      console.error("初始化数据失败:", error);
      ElMessage({
        message: "加载数据失败，请刷新重试",
        type: "error"
      });
      loading.value = false;
    }
  }
});

// 监听路由变化
watch(() => route.query, (newQuery, oldQuery) => {
  // 如果路由类型发生变化，需要销毁并重新初始化 lightGallery
  if (newQuery.type !== oldQuery.type) {
    AlbumService.destroyLightGallery();
  }
  // 重置数据
  albumItems.value = [];
  articles.value = [];
  pagination.current = 1;
  pagination.size = route.query.type ? 10 : 30;
  
  // 获取古诗
  getGuShi();
  
  // 重新加载数据
  if (!route.query.type) {
    getArticles().catch(error => {
      console.error("加载数据失败:", error);
      ElMessage({
        message: "加载数据失败，请刷新重试",
        type: "error"
      });
    });
  } else {
    try {
      routerMap[route.query.type]("").catch(error => {
        console.error("加载数据失败:", error);
        ElMessage({
          message: "加载数据失败，请刷新重试",
          type: "error"
        });
      });
    } catch (error) {
      console.error("加载数据失败:", error);
      ElMessage({
        message: "加载数据失败，请刷新重试",
        type: "error"
      });
    }
  }
}, { deep: true });

// 检查图片并初始化布局
function checkPicture() {
  const targetRef = route.query.type ? gridGalleryRef.value?.gridRef : gridAuroraRef.value?.gridRef;
  console.log("看看这里", targetRef)
  return AlbumService.initMasonry(targetRef, !!route.query.type, (loading) => {
    albumLoading.value = loading;
  }).then(() => {
    if (!window.dynamicGallery) {
      AlbumService.initLightGallery(targetRef);
    }
    return true;
  });
}

// 分页加载文章
function pageArticles() {
  pagination.current = pagination.current + 1;
  if (!route.query.type) {
    return getArticles();
  } else {
    try {
      return routerMap[route.query.type]();
    } catch (error) {
      ElMessage({
        message: "错误的路由!",
        type: "error"
      });
      return Promise.reject(error);
    }
  }
}

// 获取原始数据
function getOrigin() {
  return AlbumDataService.getOrigin(route.query.keywords)
    .then(result => {
      if (result.albumItems.length === 0 && !route.query.keywords) {
        setTimeout(() => {
          ElMessage({
            message: "你知道嘛，你误入歧途了！我不打算给你返回任何内容~",
            type: "error"
          });
        }, 1000);
      }
      
      albumItems.value = result.albumItems;
      
      setTimeout(() => {
        checkPicture();
      }, 500);
      
      return result;
    })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
}

// 获取网页图片
function getWeb() {
  albumTitle.value = "网页图片加载中...";
  
  return AlbumDataService.getWeb(webType.url, route.query)
    .then(result => {
      albumItems.value = result.albumItems;
      albumTitle.value = result.title;
      albumPoster.value = result.poster;
      
      if (albumItems.value[0]?.decode) {
        albumItems.value[0].decode(albumItems.value, () => {
          checkPicture();
        });
      }
      
      setTimeout(() => {
        checkPicture();
      }, 500);
      
      return result.doc;
    })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
}

// 获取随机图片
function getRandom() {
  const result = AlbumDataService.getRandom(route.query);
  
  albumTitle.value = result.title;
  albumPoster.value = result.poster;
  albumItems.value = result.albumItems;
  
  setTimeout(() => {
    checkPicture();
  }, 0);
  
  return Promise.resolve(result);
}

// 获取Aurora数据
function getAurora() {
  albumTitle.value = "网页图片加载中...";
  
  return AlbumDataService.getAurora(route.query.id)
    .then(result => {
      if (result) {
        document.title = result.title;
        albumTitle.value = result.title;
        albumContent.value = result.content;
        albumItems.value = result.albumItems;
        albumPoster.value = result.poster;
        
        checkPicture();
        
        // 如果有播放列表ID，提交到store
        if (result.playlistId) {
          // 使用store提交播放列表
        }
        
        return result;
      }
      return null;
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
      return Promise.reject(error);
    });
}

// 获取文章列表
function getArticles() {
  return AlbumDataService.getArticles(pagination, articles.value)
    .then(result => {
      albumTitle.value = result.title;
      articles.value = result.articles;
      pagination.total = result.pagination.total;
      albumItems.value = result.albumItems;
      
      checkPicture();
      return result;
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
      return Promise.reject(error);
    });
}

// 获取动态相册
function getDynamic() {
  return AlbumDataService.getDynamic(pagination, articles.value)
    .then(result => {
      if (result) {
        albumTitle.value = result.title;
        articles.value = result.articles;
        pagination.total = result.pagination.total;
        albumItems.value = result.albumItems;
        
        checkPicture();
        return result;
      }
      return null;
    })
    .catch((error) => {
      if (error.message === "密码错误") {
        ElMessage({
          message: "密码错误啦!我将对你进行传送😆！",
          type: "error"
        });
        
        setTimeout(() => {
          window.location.href = `/album?type=aurora&id=196`;
        }, 3000);
      } else {
        ElMessage({
          message: error.message,
          type: "error"
        });
      }
      return Promise.reject(error);
    });
}

// 获取古诗
function getGuShi() {
  return AlbumDataService.getGuShi()
    .then(data => {
      Object.assign(guShi, data);
      printerInfo.value = data.content;
      return data;
    })
    .catch(error => {
      console.error('Error fetching poem:', error);
      return Promise.reject(error);
    });
}

// 路由到Aurora
function routerAurora(auroraId) {
  router.push({ 
    path: '/album', 
    query: { ...route.query, id: auroraId, type: 'aurora' } 
  });
}
</script>

