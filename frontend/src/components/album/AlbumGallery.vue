<template>
  <div class="page-container-wrap">
    <div ref="gridRef" class="grid">
      <a v-for="(item, index) in albumItems"  
         :key="item.picUrl" 
         class="grid-item" 
         :href="checkImage(item, index)" 
         target="_blank"
         :overtip="`+ ${albumItems.length-9}`"
         :data-sub-html="item?.note || item.picUrl"
         :data-src="checkImage(item, index)"
         @click="item?.click && item.click($event)"
         @mouseenter="item?.mouseOn && item?.mouseOn()" 
         data-fb-html='是否需要添加评论功能呢？'>
        <div class="imgbox" style="position: relative;overflow: hidden;display: flex;border-radius: 14px;">
          <div class="imgAlt">
            {{ item?.note }}
          </div>
          <img target="_blank" 
               :title="item?.note" 
               onerror="this.src='https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png'" 
               class="lazyload_images" 
               :data-src="checkImage(item, index)"
               v-lazy="checkImage(item, index)"   
               alt="">
        </div>
      </a>
      <div class="grid-sizer"></div>
    </div>
    <div class="pagination-wrap">
      <div v-if="pagination.total !== albumItems.length" 
           @click="$emit('page')" 
           class="pagination">
        下一页
      </div>
      <div v-else style="user-select: none">
        ~~到底啦~~
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const gridRef = ref(null);

defineEmits(['page']);
defineExpose({ gridRef });

const props = defineProps({
  albumItems: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    default: () => ({})
  }
});

// 监听 albumItems 变化，确保在数据更新后通知父组件
watch(() => props.albumItems, (newItems) => {
  if (newItems && newItems.length > 0) {
    // 使用 setTimeout 确保 DOM 已更新
    setTimeout(() => {
      // 这里可以添加一些逻辑，比如触发事件通知父组件
      console.log('AlbumGallery: albumItems 已更新，共 ' + newItems.length + ' 项');
    }, 0);
  }
}, { deep: true });

// 检查图片
function checkImage(item, index) {
  let src = item.picUrl; 
  let note = item.note;
  if (note?.slice(0, 4) == "NSFW" && !route.query.NSFW) 
    return 'https://gd-hbimg.huaban.com/9d4628a3c336c8c816366d7f8b6a7937cd2b3b74c9bd4-KYmhYR_fw658webp';
  else 
    return src?.indexOf('qiniu.roginx.ink') !== -1 ? src + '-album' : src;
}
</script>

<style scoped>
.page-container-wrap {
  background: var(--background);
  position: relative;
  transition: .5s;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  background-color: var(--background);
  animation: zoomIn 0.8s ease-in-out;
}

.grid.loadding .grid-item {
  opacity: 0;
  animation: zoomIn 0.8s ease-in-out;
}

.grid-item {
  animation: zoomIn 0.8s ease-in-out;
  display: block;
  position: absolute;
  width: calc(20% - 10px);
  cursor: zoom-in;
  margin-bottom: 12px;
  min-width: 100px;
  min-height: 80px;
  overflow: hidden;
}

.grid-item .imgAlt {
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 0;
  background-color: var(--mask);
  color: white;
  pointer-events: none;
  transition: .3s;
}

.grid-item:hover .imgAlt {
  opacity: 1;
  transition: .3s;
}

.grid-item img {
  background-color: var(--lightGray);
  width: 100%;
  height: 100%;
}

.grid-sizer {
  width: 20%;
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

@media screen and (max-width: 768px) {
  .grid-item {
    width: calc(50% - 10px);
  }
  .grid-sizer {
    width: 50%;
  }
}
</style> 