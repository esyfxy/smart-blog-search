<template>
  <div>
    <!-- 框 -->
    <textarea
      class="comment-textarea"
      v-model="commentContent"
      placeholder="写下点什么..."
      maxlength="1000"/>
    <!-- 按钮 -->
    <div class="myBetween" style="margin-bottom: 10px">
      <div style="display: flex">
        <div :class="{'emoji-active':showEmoji}"
             @click="showEmoji = !showEmoji">
          <Orange class="myEmoji h-[22px]" />
        </div>
        <div @click="openPicture()" v-if="!disablePicture">
          <Picture class="myPicture h-[22px]" />
        </div>
      </div>

      <div style="display: flex">
       <!-- <proButton :info="'涂鸦'"
                  v-show="!isMobile && !disableGraffiti"
                  @click="showGraffiti()"
                  :before="constant.before_color_1"
                  :after="constant.after_color_1"
                  style="margin-right: 6px">
       </proButton> -->
        <proButton :info="'提交'"
                   @click="submitComment()"
                   :before="constant.before_color_2"
                   :after="constant.after_color_2">
        </proButton>
      </div>
    </div>
    <!-- 表情 -->
    <emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></emoji>

    <el-dialog title="图片"
               v-model="showPicture"
               width="25%"
               :append-to-body="true"
               destroy-on-close
               center>
      <div>
        <UploadImage :prefix="'commentPicture'" @addPicture="addPicture" :maxSize="5"
                       :maxNumber="1"></UploadImage>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useMainStore } from '../../store';
import { ElMessage } from 'element-plus';
import { ChatRound, Picture, Orange } from '@element-plus/icons-vue';
import emoji from "../common/emoji.vue";
import proButton from "../common/proButton.vue";
import UploadImage from '../common/uploadImage.vue';
const store = useMainStore();
const common = inject('$common');
const constant = inject('$constant');

const props = defineProps({
  disableGraffiti: {
    type: Boolean,
    default: false
  },
  disablePicture: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['showGraffiti', 'submitComment']);

// 响应式状态
const commentContent = ref('');
const showEmoji = ref(false);
const showPicture = ref(false);
const picture = ref({
  name: store.currentUser.username,
  url: ''
});

// 计算属性
const isMobile = computed(() => common.mobile());

// 方法
const openPicture = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error('请先登录！');
    return;
  }

  if (common.isEmpty(store.currentUser.email)) {
    ElMessage.error('请先绑定邮箱！');
    return;
  }

  showPicture.value = true;
};

const addPicture = (res) => {
  picture.value.url = res;
  savePicture();
};

const savePicture = () => {
  let img = "<" + picture.value.name + "," + picture.value.url + ">";
  commentContent.value += img;
  picture.value.url = "";
  showPicture.value = false;
};

const addEmoji = (key) => {
  commentContent.value += key;
};

const showGraffiti = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error('请先登录！');
    return;
  }

  if (common.isEmpty(store.currentUser.email)) {
    ElMessage.error('请先绑定邮箱！');
    return;
  }

  commentContent.value = "";
  emit('showGraffiti');
};

const submitComment = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error('请先登录！');
    return;
  }

  if (common.isEmpty(store.currentUser.email)) {
    ElMessage.error('请先绑定邮箱！');
    return;
  }

  if (commentContent.value.trim() === "") {
    ElMessage.warning('你还没写呢~');
    return;
  }
  
  emit('submitComment', commentContent.value.trim());
  commentContent.value = "";
};
</script>

<style scoped>
  .comment-textarea {
    border: 1px solid var(--lightGray);
    width: 100%;
    font-size: 14px;
    padding: 15px;
    min-height: 180px;
    /* 不改变大小 */
    resize: none;
    /* 不改变边框 */
    outline: none;
    border-radius: 4px;
    background-image: var(--commentURL);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 100%;
    margin-bottom: 10px;
  }

  .comment-textarea:focus {
    border-color: var(--themeBackground);
  }

  .myBetween {
    display: flex;
    justify-content: space-between;
  }

  .myEmoji {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 12px;
    color: var(--themeBackground);
  }

  .myEmoji:hover {
    transform: rotate(360deg);
    font-size: 22px;
  }

  .myPicture {
    font-size: 18px;
    cursor: pointer;
    color: var(--themeBackground);
  }

  .emoji-active {
    color: var(--themeBackground);
  }
</style>
