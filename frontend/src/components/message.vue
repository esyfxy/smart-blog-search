<template>
  <div>
    <div>
      <wallwindow :showPosterVideo="showPosterVideo"></wallwindow>
      <!-- <el-image style="animation: header-effect 2s"
                class="background-image"
                :src="$constant.random_image"
                fit="cover">
        <div slot="error" class="image-slot background-image-error"></div>
      </el-image> -->
      <!-- 输入框 -->
      <div class="message-in" style="text-align: center">
        <h2 class="message-title">树洞</h2>
        <div>
          <input class="message-input"
                 type="text"
                 style="outline: none;width: 70%"
                 placeholder="留下点什么啦~"
                 v-model="messageContent"
                 @click="show = true"
                 maxlength="60"/>
          <button v-show="show"
                  style="margin-left: 12px;cursor: pointer;width: 20%"
                  @click="submitMessage"
                  class="message-input">发射
          </button>
        </div>
      </div>
      <!-- 弹幕 -->
      <vue3-danmaku
        ref="danmakuRef"
        class="danmaku-container"
        :danmus="barrageList"
        :speeds="80"
        :channels="rowCount"
        :loop="true"
        :fontSize="18"
        :useSlot="true"
        :randomChannel="true"
        :debounce="1500"
        @list-end="onListEnd"
      >
        <template #dm="{ danmu }">
          <div class="danmaku-item">
            <div v-if="danmu.avatar" class="danmaku-avatar">
              <img :src="danmu.avatar" class="danmaku-avatar-img" alt="">
            </div>
            <div class="danmaku-content">{{ danmu.content }}</div>
          </div>
        </template>
      </vue3-danmaku>
    </div>
    <div class="comment-wrap">
      <div class="comment-content">
        <comment :source="$constant.source" :userId="$constant.userId"></comment>
      </div>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';
import { useMainStore } from '../store/index';
import comment from "./comment/comment.vue";
import myFooter from "./common/myFooter.vue";
import wallwindow from "./common/wallwindow.vue";
import { listTreeHole, saveTreeHole } from '../api/tree-hole';
import vue3Danmaku from 'vue3-danmaku';

// 全局属性
const $common = inject('$common');
const $message = inject('$message');
const $constant = inject('$constant');

const store = useMainStore();
const show = ref(false);
const messageContent = ref("");
const barrageList = ref([]);
const showPosterVideo = ref(true);
const rowCount = ref(16); // 弹幕轨道数量
const danmakuRef = ref(null);

onMounted(() => {
  getTreeHole();
  
  // 设置弹幕容器高度为视口高度
  const setDanmakuHeight = () => {
    const container = document.querySelector('.danmaku-container');
    if (container) {
      container.style.height = `calc(100vh - 50px)`;
    }
  };
  
  // 初始设置和窗口大小变化时调整
  setDanmakuHeight();
  window.addEventListener('resize', setDanmakuHeight);
  
  // 组件卸载时移除事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('resize', setDanmakuHeight);
  });
});

// 弹幕列表播放结束时触发
const onListEnd = () => {
  // 弹幕播放结束后，延迟一段时间再重新开始播放
  setTimeout(() => {
    if (danmakuRef.value) {
      danmakuRef.value.play();
    }
  }, 3000);
};

const getTreeHole = () => {
  listTreeHole()
    .then((res) => {
      if (!$common.isEmpty(res.data)) {
        barrageList.value = res.data.map(m => ({
          id: m.id,
          avatar: m.avatar,
          content: m.message
        }));
      }
    })
    .catch((error) => {
      $message({
        message: error.message,
        type: "error"
      });
    });
};

const submitMessage = () => {
  if (messageContent.value.trim() === "") {
    $message({
      message: "你还没写呢~",
      type: "warning",
    });
    return;
  }

  let treeHole = {
    message: messageContent.value.trim()
  };

  if (!$common.isEmpty(store.currentUser) && !$common.isEmpty(store.currentUser.avatar)) {
    treeHole.avatar = store.currentUser.avatar;
  }

  saveTreeHole(treeHole)
    .then((res) => {
      if (!$common.isEmpty(res.data)) {
        const newDanmu = {
          id: res.data.id,
          avatar: res.data.avatar,
          content: res.data.message
        };
        barrageList.value.push(newDanmu);
        
        // 如果弹幕组件存在，立即发送新弹幕
        if (danmakuRef.value) {
          danmakuRef.value.add(newDanmu);
        }
      }
    })
    .catch((error) => {
      $message({
        message: error.message,
        type: "error"
      });
    });

  messageContent.value = "";
  show.value = false;
};
</script>

<style scoped>
  .message-in {
    text-shadow: 2px 2px 3px #ff000088;
    transition: .5s;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    color: var(--white);
    animation: hideToShow 2.5s;
    width: 360px;
    z-index: 10;
  }

  .message-title {
    user-select: none;
    text-align: center;
  }
  .message-input:hover,.message-input:focus{
    color: var(--themeBackground);
    border: var(--themeBackground) 1px solid;
  }
  .message-input {
    font-family: var(--globalFont);
    transition: .5s;
    border-radius: 1.2rem;
    border: var(--white) 1px solid;
    color: var(--white);
    background: var(--transparent);
    padding: 10px 10px;
  }

  .message-input::-webkit-input-placeholder {
    color: var(--white);
  }

  .danmaku-container {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(100% - 50px);
    width: 100%;
    user-select: none;
    overflow: hidden;
  }

  .danmaku-item {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2px 8px;
    border-radius: 15px;
    align-items: center;
    white-space: nowrap;
  }

  .danmaku-avatar {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    flex-shrink: 0;
  }

  .danmaku-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .danmaku-content {
    white-space: nowrap;
  }

  .comment-wrap {
    background: var(--background);
    position: absolute;
    top: 100vh;
    width: 100%;
  }

  .comment-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
  }
</style>

