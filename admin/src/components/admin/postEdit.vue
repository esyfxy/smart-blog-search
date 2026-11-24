<template>
  <div>
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
      文章信息
    </el-tag>
    <el-form :model="article" :rules="rules" ref="ruleFormRef" label-width="150px"
             class="demo-ruleForm">
      <el-form-item label="标题" prop="articleTitle">
        <el-input v-model="article.articleTitle"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="articleContent">
        <md-editor
          v-model="article.articleContent"
          @upload-img="handleUploadImg"
          ref="mdRef"
          style="height: 500px"
        />
      </el-form-item>

      <el-form-item label="是否启用评论" prop="commentStatus">
        <el-tag :type="article.commentStatus === false ? 'danger' : 'success'"
                disable-transitions>
          {{article.commentStatus === false ? '否' : '是'}}
        </el-tag>
        <el-switch v-model="article.commentStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否推荐" prop="recommendStatus">
        <el-tag :type="article.recommendStatus === false ? 'danger' : 'success'"
                disable-transitions>
          {{article.recommendStatus === false ? '否' : '是'}}
        </el-tag>
        <el-switch v-model="article.recommendStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否可见" prop="viewStatus">
        <el-tag :type="article.viewStatus === false ? 'danger' : 'success'"
                disable-transitions>
          {{article.viewStatus === false ? '否' : '是'}}
        </el-tag>
        <el-switch v-model="article.viewStatus"></el-switch>
      </el-form-item>

      <el-form-item label="访问密码" prop="password">
        <el-input v-model="article.password"></el-input>
      </el-form-item>

      <el-form-item label="关键词" prop="keywords">
        <el-input v-model="article.keywords"></el-input>
      </el-form-item>

      <el-form-item label="封面" prop="articleCover">
        <div style="display: flex">
          <el-input v-model="article.articleCover"></el-input>
          <el-image class="table-td-thumb"
                    style="margin-left: 10px"
                    :preview-src-list="[article.articleCover]"
                    :src="article.articleCover"
                    fit="cover"></el-image>
        </div>
        <div class="block">
          <uploadPicture 
            :isAdmin="true" 
            :prefix="'articleCover'" 
            @addPicture="addArticleCover"
            :maxSize="5"
            :maxNumber="1">
          </uploadPicture>
        </div>
      </el-form-item>
      <el-form-item label="分类" prop="sortId">
        <el-select v-model="article.sortId" placeholder="请选择分类">
          <el-option
            v-for="item in sorts"
            :key="item.id"
            :label="item.sortName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="labelId">
        <el-select v-model="article.labelId" placeholder="请选择标签">
          <el-option
            v-for="item in labelsTemp"
            :key="item.id"
            :label="item.labelName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合集" prop="collectionId">
        <el-select v-model="article.collectionId" placeholder="请选择合集">
          <el-option
            v-for="item in collections"
            :key="item.id"
            :label="item.collectionName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex justify-center" style="margin-bottom: 22px">
      <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      <el-button type="danger" @click="resetForm(ruleFormRef)">重置所有修改</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import uploadPicture from "./common/uploadPicture.vue";
import { useMainStore } from '../../store';
import COS from 'cos-js-sdk-v5';
import { format } from 'date-fns';
import { cloudStorageApi } from '../../api/cloudStorage';
import axios from 'axios';

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');
const store = useMainStore();
const route = useRoute();
const router = useRouter();

// DOM引用
const ruleFormRef = ref(null);
const mdRef = ref(null);

// 响应式状态
const id = ref(route.query.id);
const cosInstance = ref(null);
const cosCredentials = ref(null);
const article = reactive({
  articleTitle: "",
  articleContent: "",
  commentStatus: true,
  recommendStatus: false,
  viewStatus: true,
  password: "",
  keywords: "",
  articleCover: "",
  sortId: null,
  labelId: null,
  collectionId: null
});

const sorts = ref([]);
const labels = ref([]);
const labelsTemp = ref([]);
const collections = ref([]);

// 表单验证规则
const rules = {
  articleTitle: [
    {required: true, message: '请输入标题', trigger: 'change'}
  ],
  articleContent: [
    {required: true, message: '请输入内容', trigger: 'change'}
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
  keywords: [
    {required: false, message: '文章关键词', trigger: 'change'}
  ],
  articleCover: [
    {required: true, message: '封面', trigger: 'change'}
  ],
  sortId: [
    {required: true, message: '分类', trigger: 'change'}
  ],
  labelId: [
    {required: true, message: '标签', trigger: 'blur'}
  ],
  collectionId: [
    {required: false, message: '合集', trigger: 'blur'}
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
  initCosUploader();
});

// 初始化COS上传器
const initCosUploader = async () => {
  try {
    // 获取"文章上传"配置的临时密钥
    console.log('请求临时密钥，使用"文章上传"配置');
    const response = await cloudStorageApi.getUploadToken({ configName: "文章上传" });
    
    if (response.code == 200 && response.data) {
      cosCredentials.value = response.data;
      
      // 初始化COS实例
      cosInstance.value = new COS({
        SecretId: cosCredentials.value.secretId,
        SecretKey: cosCredentials.value.secretKey,
        SecurityToken: cosCredentials.value.sessionToken,
        Protocol: 'https:',
        FileParallelLimit: 3,    // 文件并发数
        ChunkParallelLimit: 6,   // 同一个文件下分片并发数
        ChunkSize: 1024 * 1024,  // 分片大小，1MB
        ProgressInterval: 1000,  // 进度回调间隔
        Domain: cosCredentials.value.cdnDomain || undefined,
        ForcePathStyle: false,   // 使用虚拟主机模式
      });
      
      console.log('COS上传器初始化成功');
    } else {
      ElMessage.warning("获取上传凭证失败！");
    }
  } catch (error) {
    console.error('初始化COS上传器失败:', error);
    ElMessage.error("初始化上传组件失败！");
  }
};

// 刷新临时密钥
const refreshCosCredentials = async () => {
  try {
    // 使用"文章上传"配置刷新临时密钥
    const response = await cloudStorageApi.getUploadToken({ configName: "文章上传" });
    
    if (response.code == 200 && response.data) {
      cosCredentials.value = response.data;
      console.log('COS临时密钥刷新成功');
      
      // 更新COS实例的配置
      if (cosInstance.value) {
        cosInstance.value.options.SecretId = cosCredentials.value.secretId;
        cosInstance.value.options.SecretKey = cosCredentials.value.secretKey;
        cosInstance.value.options.SecurityToken = cosCredentials.value.sessionToken;
        cosInstance.value.options.Domain = cosCredentials.value.cdnDomain || undefined;
        console.log('COS实例配置已更新');
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('刷新COS临时密钥失败:', error);
    return false;
  }
};

// 处理图片上传
const handleUploadImg = async (files, callback) => {
  if (!cosInstance.value || !cosCredentials.value) {
    await initCosUploader();
    if (!cosInstance.value || !cosCredentials.value) {
      ElMessage.warning("上传组件未就绪，请稍后再试！");
      return;
    }
  }
  
  // 检查临时密钥是否过期
  const now = Math.floor(Date.now() / 1000);
  if (now >= cosCredentials.value.expiredTime - 60) { // 提前60秒刷新
    const refreshed = await refreshCosCredentials();
    if (!refreshed) {
      ElMessage.warning("上传凭证已过期，请刷新页面重试！");
      return;
    }
  }
  
  try {
    const uploadResults = [];
    
    for (const file of files) {
      try {
        // 生成唯一文件名
        const fileName = `${store.currentAdmin.username.replace(/[^a-zA-Z0-9]/g, '')}_${store.currentAdmin.id}_${Date.now()}_${file.name}`;
        
        // 使用服务器返回的前缀
        const key = `${cosCredentials.value.prefix}${fileName}`;
        
        console.log('开始上传文件:', key);
        console.log('存储桶:', cosCredentials.value.bucket);
        console.log('区域:', cosCredentials.value.region);
        console.log('临时密钥信息:', {
          secretId: cosCredentials.value.secretId ? '已设置' : '未设置',
          secretKey: cosCredentials.value.secretKey ? '已设置' : '未设置',
          sessionToken: cosCredentials.value.sessionToken ? '已设置' : '未设置',
          expiredTime: cosCredentials.value.expiredTime
        });
        
        // 使用COS SDK上传
        const result = await new Promise((resolve, reject) => {
          cosInstance.value.putObject({
            Bucket: cosCredentials.value.bucket,
            Region: cosCredentials.value.region,
            Key: key,
            Body: file,
            onProgress: (progressData) => {
              console.log('上传进度:', JSON.stringify(progressData));
            }
          }, (err, data) => {
            if (err) {
              console.error('上传失败:', err);
              // 记录更详细的错误信息
              console.error('错误详情:', {
                code: err.code,
                message: err.message,
                statusCode: err.statusCode,
                headers: err.headers
              });
              reject(err);
              return;
            }
            resolve(data);
          });
        });
        
        console.log('上传结果:', result);
        
        // 构建访问URL
        let url = '';
        if (cosCredentials.value.domain) {
          // 确保域名使用HTTPS
          const domain = cosCredentials.value.domain.startsWith('http') 
            ? cosCredentials.value.domain 
            : `https://${cosCredentials.value.domain}`;
          // 确保URL路径正确，避免多余的斜杠
          url = `${domain}/${key}`.replace(/([^:])\/\//g, '$1/');
        } else {
          url = `https://${cosCredentials.value.bucket}.cos.${cosCredentials.value.region}.myqcloud.com/${key}`;
        }
        
        console.log('上传成功，URL:', url);
        
        // 记录资源
        common.saveResource(null, "articlePicture", url, true);
        uploadResults.push(url);
      } catch (err) {
        console.error('单个文件上传失败:', err);
        ElMessage.error(`文件 ${file.name} 上传失败: ${err.message || '未知错误'}`);
      }
    }
    
    // 返回上传结果给编辑器
    callback(uploadResults);
  } catch (error) {
    console.error('上传图片失败:', error);
    ElMessage.error("上传图片失败，请重试！");
  }
};

const addArticleCover = (res) => {
  article.articleCover = res;
};

const getSortAndLabel = () => {
  http.get(constant.baseURL + "/webInfo/listSortAndLabel")
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        sorts.value = res.data.sorts;
        labels.value = res.data.labels;
        collections.value = [{id:null, collectionName:"无合集"}, ...res.data.collections];
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
  http.get(constant.baseURL + "/admin/article/getArticleById", {id: id.value}, true)
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        Object.assign(article, res.data);
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const submitForm = (formEl) => {
  if (!formEl) return;
  
  if (article.viewStatus === false && common.isEmpty(article.password)) {
    ElMessage.error("文章不可见时必须输入密码！");
    return;
  }
  
  formEl.validate((valid) => {
    if (valid) {
      if (common.isEmpty(id.value)) {
        saveArticle(article, "/article/saveArticle");
      } else {
        article.id = id.value;
        saveArticle(article, "/article/updateArticle");
      }
    } else {
      ElMessage.error("请完善必填项！");
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  if (!common.isEmpty(id.value)) {
    getArticle();
  }
};

const saveArticle = (value, url) => {
  ElMessageBox.confirm('确认保存？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true
  }).then(() => {
    http.post(constant.baseURL + url, value, true)
      .then(() => {
        ElMessage.success("保存成功！");
        router.push({path: '/postList'});
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
  }).catch(() => {
    ElMessage.info('已取消保存!');
  });
};
</script>

<style scoped>
.my-tag {
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
}

.table-td-thumb {
  border-radius: 2px;
  width: 40px;
  height: 40px;
}

.el-switch {
  margin-left: 10px;
}

.el-form-item {
  margin-bottom: 40px;
}
</style>
