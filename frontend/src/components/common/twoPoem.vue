<template>
  <div class="poem-container myCenter my-animation-hideToShow"
       v-if="!$common.isEmpty(guShi.origin) || !$common.isEmpty(hitokoto.hitokoto)">
    <!-- 背景图片 -->
    <el-image class="my-el-image poem-image "
              style="position: absolute;margin-top: -50px"
              v-once
              :src="$constant.random_backImage_miaomc+'?id='+Math.floor(Math.random()*100)"
              fit="cover">
      <div slot="error" class="image-slot"></div>
    </el-image>
    <div class="poem-wrap">
      <div><span>{{isHitokoto?hitokoto.from:guShi.origin}}</span></div>
      <p class="poem">{{isHitokoto?hitokoto.hitokoto:guShi.content}}</p>
      <p class="info" v-if="!isHitokoto || (isHitokoto && !$common.isEmpty(hitokoto.from_who))">
        {{isHitokoto?hitokoto.from_who:guShi.author}}
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance, watch } from 'vue';
import { defineProps } from 'vue';

// 定义props
const props = defineProps({
  isHitokoto: {
    type: Boolean,
    default: true
  }
});

// 获取全局属性
const instance = getCurrentInstance();
const proxy = instance ? instance.proxy : null;

// 定义响应式数据
const guShi = ref({
  content: "...",
  origin: "...",
  author: "...",
  category: "..."
});

const hitokoto = ref({
  hitokoto: "...",
  from: "...",
  from_who: "..."
});

// 获取古诗
const getGuShi = () => {
  if (!proxy) return;
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', proxy.$constant.jinrishici);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      try {
        guShi.value = JSON.parse(xhr.responseText);
      } catch (e) {
        // 解析失败时保持原内容
      }
    }
  };
  xhr.send();
};

// 获取一言
const getHitokoto = () => {
  if (!proxy) return;
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', proxy.$constant.hitokoto);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      try {
        hitokoto.value = JSON.parse(xhr.responseText);
      } catch (e) {
        // 解析失败时保持原内容
      }
    }
  };
  xhr.send();
};

// 监听props变化，支持动态切换
watch(
  () => props.isHitokoto,
  (val) => {
    if (val) {
      getHitokoto();
    } else {
      getGuShi();
    }
  },
  { immediate: true }
);

// 暴露给模板使用
// 由于<template>中直接用guShi和hitokoto即可
</script>
<style scoped>
.poem-container {
  @apply pt-90px pb-40px relative;
}

.poem-wrap {
  @apply rounded-10px z-10 text-center tracking-4px font-300 w-60%;
}

.poem-wrap div span {
  @apply px-40px py-5px text-white text-1.8em rounded-5px;
}

.poem-wrap p {
  @apply w-70% text-white;
}

.poem-wrap p.poem {
  @apply my-40px mx-auto text-1.5em;
}

.poem-wrap p.info {
  @apply my-20px mx-auto text-1.1em;
}
</style>
