<template>
  <div>
    <el-image class="background-image animate-[header-effect_2s]"
              v-once
              :src="constant.random_backImage_miaomc"
              fit="cover">
      <template #error>
        <div class="image-slot background-image-error"></div>
      </template>
    </el-image>

    <div class="friend-wrap">
      <div class="friend-main">
        <!-- 添加友链 -->
        <div @click="clickLetter()" class="form-wrap">
          <!-- 信封上面 -->
          <img class="before-img w-full" :src="constant.friendLetterTop" />
          <!-- 信 -->
          <div class="envelope animate-[hideToShow_2s]">
            <div class="form-main">
              <img class="w-full" :src="constant.friendLetterMiddle" />
              <div>
                <h3 class="text-center">有朋自远方来</h3>
                <div>
                  <div class="flex justify-center items-center form-friend">
                    <div class="user-title">
                      <div>名称：</div>
                      <div>简介：</div>
                      <div>封面：</div>
                      <div>网址：</div>
                    </div>
                    <div class="user-content">
                      <div>
                        <el-input v-model="friend.title"></el-input>
                      </div>
                      <div>
                        <el-input v-model="friend.introduction"></el-input>
                      </div>
                      <div>
                        <el-input v-model="friend.cover"></el-input>
                      </div>
                      <div>
                        <el-input v-model="friend.url"></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-center items-center mt-20px">
                    <proButton :info="'提交'"
                               @click="submitFriend"
                               :before="constant.before_color_2"
                               :after="constant.after_color_2">
                    </proButton>
                  </div>
                </div>
                <div>
                  <img class="w-full m-5px-auto" :src="constant.friendLetterBiLi" />
                </div>
                <p class="text-12px text-center text-[#999]">欢迎交换友链</p>
              </div>
            </div>
          </div>
          <img class="after-img w-full" :src="constant.friendLetterBottom" />
        </div>

        <hr>

        <h2>🥇友情链接</h2>
        <card :resourcePathList="friendList" @clickResourcePath="clickFriend"></card>
      </div>
    </div>

    <!-- 页脚 -->
    <myFooter></myFooter>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { useMainStore } from '../store';
import { ElMessage } from 'element-plus';
import myFooter from "./common/myFooter.vue";
import card from "./common/card.vue";
import proButton from "./common/proButton.vue";
import wallwindow from "./common/wallwindow.vue";

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');

// store
const store = useMainStore();

// 响应式状态
const pagination = reactive({
  current: 1,
  size: 9999,
  desc: false,
  resourceType: "friendUrl"
});

const friendList = ref([]);
const friend = reactive({
  title: "",
  introduction: "",
  cover: "",
  url: ""
});

// 生命周期钩子
onMounted(() => {
  getFriends();
});

// 方法
const clickLetter = () => {
  if (document.body.clientWidth < 700) {
    $(".form-wrap").css({"height": "1000px", "top": "-200px"});
  } else {
    $(".form-wrap").css({"height": "1150px", "top": "-200px"});
  }
};

const submitFriend = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage({
      message: "请先登录！",
      type: "error"
    });
    return;
  }

  if (common.isEmpty(store.currentUser.email)) {
    ElMessage({
      message: "请先绑定邮箱！",
      type: "error"
    });
    return;
  }

  if (friend.title.trim() === "") {
    ElMessage({
      message: "你还没写名称呢~",
      type: "warning",
    });
    return;
  }

  if (friend.introduction.trim() === "") {
    ElMessage({
      message: "你还没写简介呢~",
      type: "warning",
    });
    return;
  }

  if (friend.cover.trim() === "") {
    ElMessage({
      message: "你还没设置封面呢~",
      type: "warning",
    });
    return;
  }

  if (friend.url.trim() === "") {
    ElMessage({
      message: "你还没写网址呢~",
      type: "warning",
    });
    return;
  }

  http.post(constant.baseURL + "/webInfo/saveFriend", friend)
    .then(() => {
      $(".form-wrap").css({"height": "447px", "top": "0"});
      ElMessage({
        type: 'success',
        message: '提交成功，待管理员审核！'
      });
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
};

const clickFriend = (path) => {
  window.open(path);
};

const getFriends = () => {
  http.post(constant.baseURL + "/webInfo/listResourcePath", pagination)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        friendList.value = res.data.records;
      }
    })
    .catch((error) => {
      ElMessage({
        message: error.message || "获取友链失败",
        type: "error"
      });
    });
};
</script>

<style scoped>
.friend-head {
  @apply h-300px relative;
}

.friend-head::before {
  @apply absolute w-full h-full bg-[rgba(0,0,0,0.3)] content-[''];
}

.friend-main {
  @apply max-w-1200px mx-auto my-40px rounded-10px p-40px bg-[rgba(255,255,255,0.85)];
}

.friend-main h2 {
  @apply text-20px;
}

hr {
  @apply relative mx-auto my-40px border-2px border-dashed border-[var(--lightGreen)] overflow-visible;
}

hr:before {
  @apply absolute top-[-14px] left-[5%] text-[var(--lightGreen)] content-['❄'] text-30px leading-1 transition-all duration-1000 ease-in-out;
}

hr:hover:before {
  @apply left-[calc(95%_-_20px)];
}

.form-wrap {
  @apply mx-auto overflow-hidden w-530px h-447px relative top-0 transition-all duration-1000 ease-in-out delay-300 z-0 cursor-pointer;
}

.before-img {
  @apply absolute bottom-126px left-0 bg-no-repeat w-530px h-317px z-[-100];
}

.after-img {
  @apply absolute bottom-[-2px] left-0 bg-no-repeat w-530px h-259px z-100;
}

.friend-wrap {
  @apply px-20px text-[var(--black)];
}

.envelope {
  @apply relative mx-auto transition-all duration-1000 ease-in-out delay-300 pt-200px px-20px pb-20px;
}

.form-main {
  @apply bg-[var(--white)] mx-auto rounded-10px overflow-hidden;
}

.user-title {
  @apply text-right select-none;
}

.user-content {
  @apply text-left;
}

.user-title div {
  @apply h-55px leading-55px text-center;
}

.user-content > div {
  @apply h-55px flex items-center;
}

.user-content :deep(.el-input__inner) {
  @apply border-none h-35px bg-[var(--whiteMask)];
}

.form-friend {
  @apply mt-12px bg-[#eee] border border-[#ddd] py-20px;
}

@media screen and (max-width: 700px) {
  .form-wrap {
    @apply w-auto;
  }

  .before-img {
    @apply w-auto;
  }

  .after-img {
    @apply w-auto;
  }
}

@media screen and (max-width: 500px) {
  .friend-main {
    @apply px-15px py-40px;
  }

  .friend-wrap {
    @apply px-10px;
  }
}
</style>
