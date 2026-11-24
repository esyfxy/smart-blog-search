<template>
  <div class="shuoshuo-container">
    <div class="page-header">
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px;">
          <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
          <path
            d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
            fill="#FFAA44"></path>
          <path
            d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
            fill="#11AA66"></path>
          <path
            d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
            fill="#FFFFFF"></path>
        </svg>
        说说信息
      </el-tag>
    </div>

    <el-form :model="article" :rules="rules" ref="ruleForm" label-width="120px" class="shuoshuo-form">
      <div class="form-grid">
        <div class="main-content">
          <el-form-item label="标题" prop="articleTitle">
            <el-input v-model="article.articleTitle" placeholder="输入说说标题"></el-input>
          </el-form-item>
          
          <el-form-item label="内容" prop="articleContent">
            <md-editor
              v-model="article.articleContent"
              @upload-img="handleUploadImg"
              ref="mdRef"
              style="height: 500px"
              preview-theme="vuepress"
              :toolbars="toolbars"
            />
          </el-form-item>
        </div>
        
        <div class="side-settings">
          <div class="settings-card">
            <h3 class="settings-title">基本信息</h3>
            
            <el-form-item label="心情" prop="articleEmotion">
              <el-input v-model="article.articleEmotion" placeholder="你现在的心情"></el-input>
            </el-form-item>
            
            <el-form-item label="地点" prop="articleAddress">
              <el-input v-model="article.articleAddress" placeholder="你所在的位置"></el-input>
            </el-form-item>
            
            <el-form-item label="配图" prop="articleCover">
              <div class="cover-preview">
                <el-input v-model="article.articleCover" placeholder="图片链接"></el-input>
                <el-button type="primary" @click="visable.editPicture=true" class="select-image-btn">
                  <el-icon><Picture /></el-icon>选择图片
                </el-button>
              </div>
              <div v-if="article.articleCover" class="image-preview">
                <el-image 
                  :src="article.articleCover" 
                  fit="cover"
                  :preview-src-list="[article.articleCover]"
                ></el-image>
              </div>
            </el-form-item>
          </div>

          <div class="settings-card">
            <h3 class="settings-title">分类与标签</h3>
            
            <el-form-item label="分类" prop="sortId">
              <el-select v-model="article.sortId" placeholder="请选择分类" class="full-width">
                <el-option
                  v-for="item in sorts"
                  :key="item.id"
                  :label="item.sortName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="标签" prop="labelId">
              <el-select v-model="article.labelId" placeholder="请选择标签" class="full-width">
                <el-option
                  v-for="item in labelsTemp"
                  :key="item.id"
                  :label="item.labelName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="settings-card">
            <h3 class="settings-title">发布设置</h3>
            
            <el-form-item label="评论" prop="commentStatus" class="switch-item">
              <div class="switch-container">
                <span class="switch-label">{{ article.commentStatus ? '允许评论' : '禁止评论' }}</span>
                <el-switch v-model="article.commentStatus"></el-switch>
              </div>
            </el-form-item>
            
            <el-form-item label="推荐" prop="recommendStatus" class="switch-item">
              <div class="switch-container">
                <span class="switch-label">{{ article.recommendStatus ? '推荐' : '不推荐' }}</span>
                <el-switch v-model="article.recommendStatus"></el-switch>
              </div>
            </el-form-item>
            
            <el-form-item label="可见性" prop="viewStatus" class="switch-item">
              <div class="switch-container">
                <span class="switch-label">{{ article.viewStatus ? '公开' : '私密' }}</span>
                <el-switch v-model="article.viewStatus"></el-switch>
              </div>
            </el-form-item>
            
            <el-form-item v-if="!article.viewStatus" label="访问密码" prop="password">
              <el-input v-model="article.password" placeholder="设置访问密码" type="password" show-password></el-input>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="isSubmitting">发布说说</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-form>

    <el-dialog title="选择配图" v-model="visable.editPicture" fullscreen destroy-on-close>
      <ObjectList 
        @addPicture="addArticleCover" 
        :point="'pt'" 
        :isEdit="visable.editPicture" 
        :prefix="`log-upload/${new Date().getFullYear()}/${new Date().getMonth()+1}`" 
        :isAdmin="true" 
        :maxSize="5" 
        :maxNumber="16" 
        :object="article.articleCover">
      </ObjectList>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useMainStore } from '../../store';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { Picture } from '@element-plus/icons-vue';
import ObjectList from "./ObjectList.vue";

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');
const route = useRoute();
const router = useRouter();
const store = useMainStore();

// refs
const ruleForm = ref(null);
const mdRef = ref(null);

// 响应式状态
const id = ref(route.query.id);
const token = ref("");
const visable = reactive({editPicture: false});
const isSubmitting = ref(false);
const article = reactive({
  articleTitle: "",
  articleContent: "",
  articleAddress: "",
  articleEmotion: "",
  commentStatus: true,
  recommendStatus: false,
  viewStatus: true,
  password: "",
  articleCover: "",
  sortId: null,
  labelId: null
});

// 编辑器工具栏配置
const toolbars = computed(() => [
  'bold', 'italic', 'strikethrough', 'heading', 'quote', 'code', 'link', 'image',
  '-',
  'ordered-list', 'unordered-list', 'table', 'line',
  '-',
  'preview', 'fullscreen'
]);

const sorts = ref([]);
const labels = ref([]);
const labelsTemp = ref([]);

// 表单规则
const rules = {
  articleTitle: [
    {required: true, message: '请输入标题', trigger: 'blur'}
  ],
  articleContent: [
    {required: true, message: '请输入内容', trigger: 'blur'}
  ],
  commentStatus: [
    {required: true, message: '是否启用评论', trigger: 'change'}
  ],
  recommendStatus: [
    {required: true, message: '是否推荐', trigger: 'change'}
  ],
  viewStatus: [
    {required: true, message: '是否可见', trigger: 'change'}
  ],
  articleCover: [
    {required: true, message: '请选择配图', trigger: 'blur'}
  ],
  sortId: [
    {required: true, message: '请选择分类', trigger: 'change'}
  ],
  labelId: [
    {required: true, message: '请选择标签', trigger: 'change'}
  ],
  password: [
    {required: true, message: '私密说说必须设置密码', trigger: 'blur', validator: (rule, value, callback) => {
      if (!article.viewStatus && !value) {
        callback(new Error('私密说说必须设置访问密码'));
      } else {
        callback();
      }
    }}
  ]
};

// 监听分类变化
watch(() => article.sortId, (newVal, oldVal) => {
  if (oldVal !== null) {
    article.labelId = null;
  }
  if (!common.isEmpty(newVal) && !common.isEmpty(labels.value)) {
    labelsTemp.value = labels.value.filter(l => l.sortId === newVal);
  }
});

// 生命周期钩子
onMounted(() => {
  getSortAndLabel();
  getUpToken();
  article.articleAddress = '未知地点';
  
  // 尝试获取位置信息
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        article.articleAddress = `位置(${position.coords.latitude.toFixed(2)},${position.coords.longitude.toFixed(2)})`;
      },
      () => {
        article.articleAddress = '未知地点';
      }
    );
  }
  
  // 设置默认心情
  const emotions = ['开心', '放松', '平静', '疲惫', '思考中', '兴奋', '忙碌'];
  article.articleEmotion = emotions[Math.floor(Math.random() * emotions.length)];
});

// 方法
const getUpToken = () => {
  http.get(constant.baseURL + "/qiniu/getUpToken", {}, true)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        token.value = res.data;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

// 处理图片上传
const handleUploadImg = async (files, callback) => {
  if (common.isEmpty(token.value)) {
    ElMessage.warning("上传出错！");
    return;
  }
  
  const res = await Promise.all(
    files.map(async (file) => {
      let fd = new FormData();
      fd.append("file", file);
      fd.append("token", token.value);
      fd.append("key", "articlePicture" + "/" + store.currentAdmin.username.replace(/[^a-zA-Z]/g, '') + store.currentAdmin.id + new Date().getTime());

      try {
        const res = await http.uploadQiniu(constant.qiniuUrl, fd);
        if (!common.isEmpty(res.key)) {
          let url = constant.qiniuDownload + res.key;
          common.saveResource(null, "articlePicture", url, true);
          return url;
        }
        return '';
      } catch (error) {
        ElMessage.error(error.message);
        return '';
      }
    })
  );
  
  callback(res.filter(url => url !== ''));
};

const addArticleCover = (res) => {
  article.articleCover = res;
  visable.editPicture = false;
};

const getSortAndLabel = () => {
  http.get(constant.baseURL + "/webInfo/listSortAndLabel")
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        sorts.value = res.data.sorts;
        labels.value = res.data.labels;
        if (!common.isEmpty(id.value)) {
          getArticle();
        }
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const getArticle = () => {
  http.get(constant.baseURL + "/diary/getArticleById", {id: id.value}, true)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        Object.assign(article, res.data);
        article.articleCover = article.articleItems;
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const submitForm = (formName) => {
  let md = navigator.userAgent.match(/\((.+?)\)/g)[0];
  article.articleDevice = md ? md : '个人主机';
  
  if (article.viewStatus === false && common.isEmpty(article.password)) {
    ElMessage.error("文章不可见时必须输入密码！");
    return;
  }
  
  ruleForm.value.validate((valid) => {
    if (valid) {
      isSubmitting.value = true;
      
      ElMessageBox.confirm('确认发布这条说说吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        const url = common.isEmpty(id.value) ? "/diary/saveArticle" : "/diary/updateArticle";
        if (!common.isEmpty(id.value)) {
          article.id = id.value;
        }
        
        http.post(constant.baseURL + url, article, true)
          .then(() => {
            ElMessage.success("发布成功！");
            router.push({path: '/postList'});
          })
          .catch((error) => {
            ElMessage.error(error.message);
          })
          .finally(() => {
            isSubmitting.value = false;
          });
      }).catch(() => {
        isSubmitting.value = false;
        ElMessage.info('已取消发布');
      });
    } else {
      ElMessage.error("请完善必填项！");
    }
  });
};

const resetForm = (formName) => {
  ruleForm.value.resetFields();
  if (!common.isEmpty(id.value)) {
    getArticle();
  }
};
</script>

<style scoped>
.shuoshuo-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.page-header {
  margin-bottom: 24px;
}

.my-tag {
  margin-bottom: 0;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
  border-radius: 6px;
}

.shuoshuo-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.main-content {
  padding-right: 24px;
}

.side-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.settings-title {
  font-size: 16px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.switch-label {
  font-size: 14px;
  color: #666;
}

.switch-item :deep(.el-form-item__content) {
  display: flex;
  justify-content: flex-end;
}

.full-width {
  width: 100%;
}

.cover-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.select-image-btn {
  white-space: nowrap;
}

.image-preview {
  margin-top: 8px;
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #eee;
}

.image-preview :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding-right: 0;
    order: 1;
  }
  
  .side-settings {
    order: 0;
  }
}
</style>
