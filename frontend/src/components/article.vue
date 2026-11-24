<template>
  <div>
    <div v-if="!$common.isEmpty(article)">
      <TreeData :treeData="treeData"></TreeData>
      
      <!-- 封面 -->
      <ArticleHeader 
        :article="article" 
        @showWeiYanDialog="weiYanDialogVisible = true">
      </ArticleHeader>
      
      <!-- 文章 -->
      <div style="background: var(--background);" ref="articleContentRef">
        <div class="article-container my-animation-slide-bottom">
          <!-- 最新进展 -->
          <ArticleProcess 
            :treeHoleList="treeHoleList" 
            @deleteTreeHole="deleteTreeHole">
          </ArticleProcess>

          <!-- 文章内容 -->
          <ArticleContent 
            :articleContent="article.articleContent"
            @contentRendered="buildTreeFromHTML">
          </ArticleContent>
          
          <!-- 底部信息 -->
          <ArticleFooter 
            :article="article" 
            :subscribe="subscribe" 
            @subscribe="subscribeLabel">
          </ArticleFooter>

          <!-- 评论 -->
          <div v-if="article.commentStatus === true">
            <comment :type="'article'" :source="article.id" :userId="article.userId"></comment>
          </div>
        </div>

        <!-- 目录 -->
        <ArticleToc :articleRef="articleContentRef"></ArticleToc>
      </div>

      <div style="background: var(--background)">
        <myFooter></myFooter>
      </div>

      <!-- 最新进展弹窗 -->
      <el-dialog title="最新进展"
                 v-model="weiYanDialogVisible"
                 width="40%"
                 :append-to-body="true"
                 destroy-on-close
                 center>
        <div>
          <div class="myCenter" style="margin-bottom: 20px">
            <el-date-picker
              v-model="newsTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              align="center"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <commentBox :disableGraffiti="true"
                      @submitComment="submitWeiYan">
          </commentBox>
        </div>
      </el-dialog>
    </div>

    <!-- 微信 -->
    <el-dialog title="密码"
        :modal="false"
        v-model="showPasswordDialog"
        width="40%"
        :append-to-body="true"
        :close-on-click-modal="false"
        :show-close="false"
        center>
      <div>
        <div>
          <div class="password-content">{{tips}}</div>
        </div>
        <div style="margin: 20px auto;">
          <el-input maxlength="30" v-model="password"></el-input>
        </div>
        <tradeCard :productDescription='`密码与微信号同：janxland<hr />该功能只是支付功能的测试`' :productCode="'prod:www.roginx.ink/article/'+articleId" :amount="1"></tradeCard>
        <div style="display: flex;justify-content: center">
          <proButton :info="'提交'"
            @click.native="submitPassword()"
            :before="$constant.before_color_2"
            :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../store';
import { ElMessage, ElMessageBox } from 'element-plus';

// Import main components
import myFooter from "./common/myFooter.vue";
import comment from "./comment/comment.vue";
import TreeData from "./common/treedata.vue";
import commentBox from "./comment/commentBox.vue";
import proButton from "./common/proButton.vue";
import tradeCard from "./common/tradeCard.vue";

// Import article components
import ArticleHeader from "./article/ArticleHeader.vue";
import ArticleContent from "./article/ArticleContent.vue";
import ArticleFooter from "./article/ArticleFooter.vue";
import ArticleProcess from "./article/ArticleProcess.vue";
import ArticleToc from "./article/ArticleToc.vue";

// 注入依赖
const $http = inject('$http');
const $common = inject('$common');
const $constant = inject('$constant');
const $confirm = ElMessageBox.confirm; // 使用Element Plus的ElMessageBox替代注入的$confirm

// Store and router
const store = useMainStore();
const route = useRoute();

// Refs
const articleContentRef = ref(null);
const article = ref({});
const treeHoleList = ref([]);
const weiYanDialogVisible = ref(false);
const showPasswordDialog = ref(false);
const newsTime = ref("");
const password = ref(null);
const treeData = ref([]);
const tips = ref("");
const subscribe = ref(false);
const id = route.query.id;

// Computed
const articleId = computed(() => route.query.id);

// Article data handling
function getArticle(password = null) {
  $http.get($constant.baseURL + "/article/getArticleById", {id, flag: true, password})
    .then(handleArticleSuccess)
    .catch(handleArticleError);
}

function handleArticleSuccess(res) {
  if ($common.isEmpty(res.data)) return;
  
  article.value = res.data;
  getNews();
  changeMeta();
  
  if (!$common.isEmpty(password.value)) {
    localStorage.setItem("article_password_" + id, password.value);
  }
  showPasswordDialog.value = false;
}

function handleArticleError(error) {
  console.log(error.message);
  if (error.message.substr(0, 4) === "密码错误") {
    ElMessage.error("密码错误，请重新输入！");
    tips.value = error.message.substr(4);
    showPasswordDialog.value = true;
    return;
  }
  
  ElMessage.error(error.message);
}

function submitPassword() {
  if ($common.isEmpty(password.value)) {
    ElMessage.error("请先输入密码！");
    return;
  }
  getArticle(password.value);
}

// Tree data handling
function buildTreeFromHTML() {
  const contentElement = document.querySelector('.entry-content');
  if (!contentElement) return;
  
  const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (!headings || headings.length === 0) return;
  
  // Add IDs to headings
  headings.forEach((heading, i) => {
    if (!heading.id) heading.id = 'heading-' + i;
  });
  
  // Create root node and tree structure
  const rootNode = createRootNode();
  const newTreeData = [rootNode];
  buildTreeStructure(headings, rootNode, newTreeData);
  
  treeData.value = newTreeData;
  document.title = article.value.articleTitle;
}

function createRootNode() {
  return {
    level: 0,
    label: article.value.articleTitle,
    id: ".article-title",
    children: []
  };
}

function buildTreeStructure(headings, rootNode, treeData) {
  let nodeStack = [rootNode];
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    const newNode = {
      level,
      label: heading.textContent,
      id: "#" + heading.id,
      children: []
    };
    
    // Find appropriate parent node
    while (nodeStack.length > 1 && nodeStack[nodeStack.length - 1].level >= level) {
      nodeStack.pop();
    }
    
    // Add to parent's children
    const parentNode = nodeStack[nodeStack.length - 1];
    parentNode.children.push(newNode);
    nodeStack.push(newNode);
  });
}

// News handling
function getNews() {
  $http.post($constant.baseURL + "/weiYan/listNews", {
    current: 1,
    size: 9999,
    source: article.value.id
  })
    .then(handleNewsSuccess)
    .catch(handleNewsError);
}

function handleNewsSuccess(res) {
  if ($common.isEmpty(res.data)) return;
  
  const records = res.data.records.map(formatNewsContent);
  treeHoleList.value = records;
}

function formatNewsContent(item) {
  let content = item.content;
  content = content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
  content = content.replace(/\n/g, '<br/>');
  content = $common.faceReg(content);
  content = $common.pictureReg(content);
  
  return { ...item, content };
}

function handleNewsError(error) {
  ElMessage.error(error.message);
}

function submitWeiYan(content) {
  // 验证时间格式，如果无效则使用当前时间
  let createTime = newsTime.value;
  
  // 检查时间格式是否有效
  const isValidDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return false;
    // 检查是否包含无效字符
    if (dateTimeStr.includes('yyyy') || dateTimeStr.includes('Th') || dateTimeStr.includes('MM') || dateTimeStr.includes('dd')) {
      return false;
    }
    // 尝试解析时间
    const date = new Date(dateTimeStr);
    return !isNaN(date.getTime()) && dateTimeStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  };

  if (!isValidDateTime(createTime)) {
    // 如果时间格式无效，使用当前时间
    const now = new Date();
    createTime = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' + 
      String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0') + ':' + 
      String(now.getSeconds()).padStart(2, '0');
  }

  const weiYan = {
    content,
    createTime: createTime,
    source: article.value.id
  };

  $http.post($constant.baseURL + "/weiYan/saveNews", weiYan)
    .then(() => {
      weiYanDialogVisible.value = false;
      newsTime.value = "";
      getNews();
    })
    .catch(error => ElMessage.error(error.message));
}

function deleteTreeHole(id) {
  if ($common.isEmpty(store.currentUser)) {
    ElMessage.error("请先登录！");
    return;
  }

  $confirm('确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  })
    .then(() => confirmDeleteTreeHole(id))
    .catch(() => ElMessage.success('已取消删除!'));
}

function confirmDeleteTreeHole(id) {
  $http.get($constant.baseURL + "/weiYan/deleteWeiYan", {id})
    .then(() => {
      ElMessage.success('删除成功!');
      getNews();
    })
    .catch(error => ElMessage.error(error.message));
}

// Metadata and UI
function changeMeta() {
  document.title = article.value.articleTitle;
  document.querySelector('meta[name="keywords"]').setAttribute(
    'content', 
    article.value.label.labelDescription + ',' + article.value.articleTitle
  );
  document.querySelector('meta[name="description"]').setAttribute(
    'content', 
    article.value.articleContent
  );
}

function subscribeLabel() {
  subscribe.value = !subscribe.value;
}

// Lifecycle hooks
onMounted(() => {
  store.changePlaylist(489085857);
});

// Initialize
getArticle(localStorage.getItem("article_password_" + id));
</script>

<style scoped>
.article-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 14px;
}

.password-content {
  font-size: 13px;
  color: var(--maxGreyFont);
  line-height: 1.5;
}
</style>
