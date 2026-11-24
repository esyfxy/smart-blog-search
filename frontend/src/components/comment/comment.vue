<template>
  <div>
    <!-- 评论框 -->
    <div class="mb-10">
      <div class="comment-head">
        <el-icon class="mr-2 text-xl"><Edit /></el-icon> 评论
      </div>
      <div>
        <!-- 文字评论 -->
        <div v-show="!isGraffiti">
          <commentBox 
            @showGraffiti="isGraffiti = !isGraffiti"
            @submitComment="submitComment">
          </commentBox>
        </div>
        <!-- 画笔评论（已注释） -->
        <!-- <div v-show="isGraffiti">
          <graffiti 
            @showComment="isGraffiti = !isGraffiti"
            @addGraffitiComment="addGraffitiComment">
          </graffiti>
        </div> -->
      </div>
    </div>

    <!-- 评论内容 -->
    <div v-if="comments.length > 0">
      <!-- 评论数量 -->
      <div class="commentInfo-title">
        <span class="text-lg">Comments | </span>
        <span>{{ total }} 条评论</span>
      </div>
      
      <!-- 评论详情 -->
      <div 
        id="comment-content" 
        class="commentInfo-detail"
        v-for="(item, index) in comments"
        :key="index">
        <!-- 头像 -->
        <el-avatar 
          shape="square" 
          class="commentInfo-avatar" 
          :size="35" 
          :src="item.avatar">
        </el-avatar>

        <div class="flex-1 pl-3">
          <!-- 评论信息 -->
          <div class="flex justify-between">
            <div>
              <span class="commentInfo-username">{{ item.username }}</span>
              <span class="commentInfo-master" v-if="item.userId === userId">博主</span>
              <span class="commentInfo-other">{{ common.getDateDiff(item.createTime) }}</span>
            </div>
            <div class="commentInfo-reply" @click="replyDialog(item, item)">
              <span v-if="item.childComments.total > 0">{{item.childComments.total}} </span><span>回复</span>
            </div>
          </div>
          
          <!-- 评论内容 -->
          <div class="commentInfo-content">
            <span v-html="item.commentContent"></span>
          </div>
          
          <!-- 回复模块 -->
          <div v-if="!common.isEmpty(item.childComments) && !common.isEmpty(item.childComments.records)">
            <div 
              class="commentInfo-detail" 
              v-for="(childItem, i) in item.childComments.records" 
              :key="i">
              <!-- 头像 -->
              <el-avatar 
                shape="square" 
                class="commentInfo-avatar" 
                :size="30" 
                :src="childItem.avatar">
              </el-avatar>

              <div class="flex-1 pl-3">
                <!-- 评论信息 -->
                <div class="flex justify-between">
                  <div>
                    <span class="commentInfo-username-small">{{ childItem.username }}</span>
                    <span class="commentInfo-master" v-if="childItem.userId === userId">博主</span>
                    <span class="commentInfo-other">{{ common.getDateDiff(childItem.createTime) }}</span>
                  </div>
                  <div>
                    <span class="commentInfo-reply" @click="replyDialog(childItem, item)">回复</span>
                  </div>
                </div>
                
                <!-- 评论内容 -->
                <div class="commentInfo-content">
                  <template v-if="childItem.parentCommentId !== item.id && 
                                  childItem.parentUserId !== childItem.userId">
                    <span class="text-blue-500">@{{ childItem.parentUsername }} </span>:
                  </template>
                  <span v-html="childItem.commentContent"></span>
                </div>
              </div>
            </div>
            
            <!-- 分页 -->
            <div 
              class="pagination-wrap" 
              v-if="item.childComments.records.length < item.childComments.total">
              <div 
                class="pagination"
                @click="toChildPage(item)">
                展开
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <proPage 
        :current="pagination.current"
        :size="pagination.size"
        :total="pagination.total"
        :buttonSize="6"
        :color="constant.commentPageColor"
        @toPage="toPage">
      </proPage>
    </div>

    <div v-else class="flex justify-center items-center text-gray-500">
      <i>来发第一个评论啦~</i>
    </div>

    <!-- 回复对话框 -->
    <el-dialog 
      title="评论"
      v-model="replyDialogVisible"
      width="30%"
      :before-close="handleClose"
      :append-to-body="true"
      destroy-on-close
      center>
      <div>
        <commentBox 
          :disableGraffiti="true"
          @submitComment="submitReply">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
// import graffiti from "./graffiti.vue";
import commentBox from "./commentBox.vue";
import proPage from "../common/proPage.vue";

const props = defineProps({
  source: {
    type: Number
  },
  userId: {
    type: Number
  }
});

// 依赖注入
const common = inject('$common');
const constant = inject('$constant');
const http = inject('$http');

// 响应式状态
const isGraffiti = ref(false);
const total = ref(0);
const replyDialogVisible = ref(false);
const floorComment = ref({});
const replyComment = ref({});
const comments = ref([]);
const pagination = ref({
  current: 1,
  size: 10,
  total: 0,
  source: props.source,
  floorCommentId: null
});

// 生命周期钩子
onMounted(() => {
  getComments(pagination.value);
  getTotal();
});

// 方法
const toPage = (page) => {
  pagination.value.current = page;
  window.scrollTo({
    top: document.getElementById('comment-content').offsetTop
  });
  getComments(pagination.value);
};

const getTotal = () => {
  http.get(constant.baseURL + "/comment/getCommentCount", {source: props.source})
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        total.value = res.data;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const toChildPage = (floorComment) => {
  floorComment.childComments.current += 1;
  let paginationData = {
    current: floorComment.childComments.current,
    size: 5,
    total: 0,
    source: props.source,
    floorCommentId: floorComment.id
  };
  getComments(paginationData, floorComment, true);
};

const emoji = (comments, flag) => {
  comments.forEach(c => {
    c.commentContent = c.commentContent.replace(/\n/g, '<br/>');
    c.commentContent = common.faceReg(c.commentContent);
    c.commentContent = common.pictureReg(c.commentContent);
    if (flag) {
      if (!common.isEmpty(c.childComments) && !common.isEmpty(c.childComments.records)) {
        c.childComments.records.forEach(cc => {
          cc.commentContent = cc.commentContent.replace(/\n/g, '<br/>');
          cc.commentContent = common.faceReg(cc.commentContent);
          cc.commentContent = common.pictureReg(cc.commentContent);
        });
      }
    }
  });
};

const getComments = (paginationData, floorCommentItem = {}, isToPage = false) => {
  http.post(constant.baseURL + "/comment/listComment", paginationData)
    .then((res) => {
      if (!common.isEmpty(res.data) && !common.isEmpty(res.data.records)) {
        if (common.isEmpty(floorCommentItem)) {
          comments.value = res.data.records;
          pagination.value.total = res.data.total;
          emoji(comments.value, true);
        } else {
          if (isToPage === false) {
            floorCommentItem.childComments = res.data;
          } else {
            floorCommentItem.childComments.total = res.data.total;
            floorCommentItem.childComments.records = floorCommentItem.childComments.records.concat(res.data.records);
          }
          emoji(floorCommentItem.childComments.records, false);
        }
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const addGraffitiComment = (graffitiComment) => {
  submitComment(graffitiComment);
};

const submitComment = (commentContent) => {
  let comment = {
    source: props.source,
    commentContent: commentContent
  };

  http.post(constant.baseURL + "/comment/saveComment", comment)
    .then((res) => {
      ElMessage.success('保存成功！');
      pagination.value = {
        current: 1,
        size: 10,
        total: 0,
        source: props.source,
        floorCommentId: null
      };
      getComments(pagination.value);
      getTotal();
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const submitReply = (commentContent) => {
  let comment = {
    source: props.source,
    floorCommentId: floorComment.value.id,
    commentContent: commentContent,
    parentCommentId: replyComment.value.id,
    parentUserId: replyComment.value.userId
  };

  let floorCommentItem = floorComment.value;

  http.post(constant.baseURL + "/comment/saveComment", comment)
    .then((res) => {
      let paginationData = {
        current: 1,
        size: 5,
        total: 0,
        source: props.source,
        floorCommentId: floorCommentItem.id
      };
      getComments(paginationData, floorCommentItem);
      getTotal();
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
  handleClose();
};

const replyDialog = (comment, floorCommentItem) => {
  replyComment.value = comment;
  floorComment.value = floorCommentItem;
  replyDialogVisible.value = true;
};

const handleClose = () => {
  replyDialogVisible.value = false;
  floorComment.value = {};
  replyComment.value = {};
};
</script>

<style scoped>
.comment-head {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 20px 0;
  user-select: none;
  color: var(--themeBackground);
}

.commentInfo-title {
  margin-bottom: 20px;
  color: var(--greyFont);
  user-select: none;
}

.commentInfo-detail {
  display: flex;
}

.commentInfo-avatar {
  border-radius: 5px;
}

.commentInfo-username {
  color: var(--orangeRed);
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
}

.commentInfo-username-small {
  color: var(--orangeRed);
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
}

.commentInfo-master {
  color: var(--green);
  border: 1px solid var(--green);
  border-radius: 0.2rem;
  font-size: 12px;
  padding: 2px 4px;
  margin-right: 5px;
}

.commentInfo-other {
  font-size: 12px;
  color: var(--greyFont);
  user-select: none;
}

.commentInfo-reply {
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  color: var(--white);
  background: var(--themeBackground);
  border-radius: 0.2rem;
  padding: 3px 6px;
}

.commentInfo-content {
  margin: 15px 0 25px;
  padding: 18px 20px;
  background: var(--commentContent);
  border-radius: 12px;
  color: var(--black);
  word-break: break-word;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.pagination {
  padding: 6px 20px;
  border: 1px solid var(--lightGray);
  border-radius: 3rem;
  color: var(--greyFont);
  user-select: none;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
}

.pagination:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}
</style>
