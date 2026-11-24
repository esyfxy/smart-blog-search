<template>
  <div v-if="!isEmpty(articleList)" :class="containerClass">
    <!-- 标题栏 -->
    <div class="border-gray-300 mb-12 text-gray-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg viewBox="0 0 1024 1024" class="w-5 h-5">
            <path d="M224.2 472.3c-13-5.7-3.7-23.5 8.2-19 91 34 146.8 108.7 182.4 138.5 5.6 4.7 14 2.9 17.3-3.5 16.8-32 45.8-113.7-57.1-168.6-87.3-46.5-188-53.6-247.3-82.2-14.5-7-31.1 4.6-29.9 20.7 5 69.7 28.9 124.7 62.3 181.5 67.3 114.3 140.6 132.9 216.6 104 2.2-0.9 4.5-1.8 7-3 7-3.4 8.3-12.9 2.5-18.1 0.1 0-45.7-69.3-162-150.3z" fill="#FFD401"/>
            <path d="M282.7 849.9c79.5-137 172.4-263.1 385.4-401.3 9.8-6.4 2.1-21.5-8.9-17.4C497.7 492.8 429.7 585 373.3 640.8c-8.7 8.7-23.4 6.3-29.1-4.6-27.2-51.8-69.5-174.1 97.3-263.1 147.7-78.8 319.9-91.4 429.7-93.3 18.9-0.3 31.5 19.4 23.3 36.4C863.7 380 842.6 478 789.9 567.6 680.8 753.1 545.5 766.7 422.2 719.8c-8.8-3.4-18.8-0.2-24 7.7-16.6 25.2-50.3 80.1-58.7 122.4-11.4 56.8-82.2 43.9-56.8 0z" fill="#8BC03C"/>
          </svg>
          <span>发现</span>
        </div>
        <div class="cursor-pointer" @click="toggleView">
          <i v-if="!isGridView" class="fa fa-align-justify h-[20px]"></i>
          <i v-else class="fa fa-th-large h-[20px]"></i>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="grid gap-4" :class="gridClass">
      <article v-for="(article, index) in articleList" 
               :key="article.id"
               class="group bg-white/80 rounded-lg overflow-hidden shadow-[0_1px_20px_-6px_var(--borderColor)] hover:shadow-lg transition-all duration-300 cursor-pointer"
               :class="[
                 isGridView ? 'h-100' : 'h-75 flex',
                 index % 2 !== 0 ? 'animate-slide-top' : 'animate-slide-bottom'
               ]"
               @click.left="() => openWindow(article)"
               @click.right.prevent="() => openWindow(article, true)">
        
        <!-- 文章封面 -->
        <div :class="[
          'overflow-hidden',
          isGridView ? 'h-40' : 'w-3/5 h-full',
          !isGridView && index % 2 !== 0 ? 'order-first' : 'order-last'
        ]">
          <el-image class="w-full h-full transition duration-300 hover:scale-110"
                    :src="article.articleCover || getRandomImage()"
                    fit="cover">
            <template #error>
              <div class="w-full h-full flex items-center justify-center bg-green">
                <div class="text-xl tracking-widest text-white">遇事不决，可问春风</div>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 文章内容 -->
        <div :class="[
          'flex flex-col p-4 bg-[var(--background)]',
          isGridView ? 'h-60' : 'w-2/5 h-full'
        ]">
          <!-- 发布时间 -->
          <div class="text-sm text-gray-500 flex items-center gap-1 mb-2">
            <svg viewBox="0 0 1024 1024" class="w-3.5 h-3.5">
              <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#409EFF"/>
            </svg>
            发布于 {{ article.createTime }}
          </div>

          <!-- 标题 -->
          <el-tooltip placement="top" effect="light">
            <template #content>{{ article.articleTitle }}</template>
            <span class="text-lgfont-medium truncate mb-2 font-bold">{{ article.articleTitle }}</span>
          </el-tooltip>

          <!-- 文章信息 -->
          <div class="text-sm text-gray-500 flex gap-3">
            <span class="flex items-center gap-1">
              <svg viewBox="0 0 1024 1024" class="w-3.5 h-3.5">
                <path d="M14.656 512a497.344 497.344 0 1 0 994.688 0 497.344 497.344 0 1 0-994.688 0z" fill="#FF0000"/>
              </svg>
              {{ article.viewCount }} 热度
            </span>
            <span class="flex items-center gap-1">
              <svg viewBox="0 0 1024 1024" class="w-3.5 h-3.5">
                <path d="M113.834667 291.84v449.194667a29.013333 29.013333 0 0 0 28.842666 29.013333h252.928v90.453333l160.597334-90.453333h252.928a29.013333 29.013333 0 0 0 29.013333-29.013333V291.84a29.013333 29.013333 0 0 0-29.013333-29.013333h-665.6a29.013333 29.013333 0 0 0-29.696 29.013333z" fill="#FFDEAD"/>
              </svg>
              {{ article.commentCount }} 评论
            </span>
            <span class="flex items-center gap-1">
              <svg viewBox="0 0 1024 1024" class="w-3.5 h-3.5">
                <path d="M510.671749 348.792894S340.102978 48.827055 134.243447 254.685563C-97.636714 486.565724 510.671749 913.435858 510.671749 913.435858s616.107079-419.070494 376.428301-658.749272c-194.095603-194.096626-376.428302 94.106308-376.428301 94.106308z" fill="#FF713C"/>
              </svg>
              {{ article.likeCount }} 点赞
            </span>
          </div>

          <!-- 文章描述 -->
          <p class="text-sm line-clamp-4 flex-1">{{ article.articleContent }}</p>

          <!-- 分类标签 -->
          <div class="flex gap-2 mt-4">
            <span class="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
                  @click.stop="$router.push({path: '/sort', query: {sortId: article.sortId}})">
              <svg viewBox="0 0 1024 1024" class="w-3.5 h-3.5 inline-block align-text-bottom">
                <path d="M179.2 153.6m89.6 0l588.8 0q89.6 0 89.6 89.6l0 486.4q0 89.6-89.6 89.6l-588.8 0q-89.6 0-89.6-89.6l0-486.4q0-89.6 89.6-89.6Z" fill="#FF9C55"/>
              </svg>
              {{ article.sort.sortName }}
            </span>
            <span v-if="article.label" 
                  class="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
                  @click.stop="$router.push({path: '/sort', query: {sortId: article.sortId, labelId: article.labelId}})">
              <svg viewBox="0 0 1024 1024" class="w-3.5 h-3.5 inline-block align-text-bottom">
                <path d="M905.0112 560.4352l-342.784 342.784c-56.7808 56.7808-148.7872 56.7808-205.568 0l-231.5776-231.5776c-56.7808-56.7808-56.7808-148.7872 0-205.568l342.9376-342.9376a114.8928 114.8928 0 0 1 84.224-33.5872l266.3936 7.2192c60.7744 1.6384 109.7216 50.3808 111.5648 111.1552l8.2944 267.8272c1.024 31.6928-11.1104 62.3104-33.4848 84.6848z" fill="#8C7BFD"/>
              </svg>
              {{ article.label.labelName }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  articleList: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const route = useRoute()

// 视图状态
const isGridView = ref(true)
const toggleView = () => isGridView.value = !isGridView.value

// 计算样式类
const containerClass = computed(() => ({
  'max-w-screen-lg': !isGridView.value,
  'max-w-screen-2xl': isGridView.value,
  'mx-auto': true
}))

const gridClass = computed(() => 
  isGridView.value ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''
)

// 工具函数
const isEmpty = (val) => {
  return val === undefined || val === null || val === '' || 
         (Array.isArray(val) && val.length === 0) ||
         (typeof val === 'object' && Object.keys(val).length === 0)
}

const getRandomImage = () => {
  const constant = inject('constant')
  return constant.random_image + new Date() + Math.floor(Math.random() * 10)
}

// 打开文章
const openWindow = (article, basic = false) => {
  const url = `/article?id=${article.id}`
  if (basic || route.query.keywords) {
    router.push(url)
  } else {
    window.open(url, '_blank')
  }
}
</script>

<style>
.animate-slide-top {
  animation: slideTop 0.8s ease-in-out;
}

.animate-slide-bottom {
  animation: slideBottom 0.8s ease-in-out;
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
</style>
