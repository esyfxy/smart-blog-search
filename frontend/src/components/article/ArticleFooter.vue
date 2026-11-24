<template>
  <div>
    <!-- 最后更新时间 -->
    <div class="article-update-time">
      <span>文章最后更新于 {{ article.updateTime }}</span>
    </div>
    
    <!-- 分类 -->
    <div class="article-sort">
      <span @click="navigateToSort">
        {{ article.sort.sortName + " ▶ " + article.label.labelName }}
      </span>
    </div>
    
    <!-- 作者信息 -->
    <blockquote>
      <div>
        作者：{{ article.username }}
      </div>
      <div>
        版权声明：转载请注明文章出处
      </div>
    </blockquote>
    
    <!-- 订阅 -->
    <div class="myCenter" id="article-like" @click="subscribeLabel">
      <i class="el-icon-thumb article-like-icon" :class="{'article-like': subscribe}"></i>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// Props
const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  subscribe: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['subscribe']);

// Methods
function subscribeLabel() {
  emit('subscribe');
}

function navigateToSort() {
  router.push({
    path: '/sort', 
    query: {
      sortId: props.article.sortId, 
      labelId: props.article.labelId
    }
  });
}
</script>

<style scoped>
.article-update-time {
  color: var(--greyFont);
  font-size: 12px;
  margin: 20px 0;
  user-select: none;
}

blockquote {
  line-height: 2;
  border-left: 0.2rem solid var(--blue);
  padding: 10px 1rem;
  background-color: var(--azure);
  border-radius: 4px;
  margin: 0 0 40px 0;
  user-select: none;
  color: var(--black);
}

.article-sort {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.article-sort span {
  padding: 3px 10px;
  background-color: var(--themeBackground);
  border-radius: 5px;
  font-size: 14px;
  color: var(--white);
  transition: all 0.3s;
  margin-right: 25px;
  cursor: pointer;
  user-select: none;
}

.article-sort span:hover {
  background-color: var(--red);
}

.article-like {
  color: var(--red) !important;
}

.article-like-icon {
  font-size: 60px;
  cursor: pointer;
  color: var(--greyFont);
  transition: all 0.5s;
  border-radius: 50%;
  margin-bottom: 20px;
}

.article-like-icon:hover {
  transform: rotate(360deg);
}
</style> 