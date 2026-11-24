<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <div class="desc">抱歉，您访问的页面不存在</div>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const router = useRouter();

const goHome = () => {
  // 根据环境决定导航方式
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // 在微前端环境中，使用history API导航
    window.history.pushState({}, '', '/main');
    window.dispatchEvent(new PopStateEvent('popstate'));
  } else {
    // 独立运行时，使用Vue Router导航
    router.push('/main');
  }
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.content {
  text-align: center;
}

h1 {
  font-size: 120px;
  color: #409eff;
  margin: 0;
  line-height: 1.2;
}

.desc {
  font-size: 18px;
  color: #666;
  margin: 20px 0 30px;
}
</style> 