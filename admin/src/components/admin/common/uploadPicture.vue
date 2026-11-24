<template>
  <div class="py-3">
    <el-upload
      class="upload-demo"
      ref="uploadRef"
      multiple
      drag
      :action="getQiniuUrl()"
      :data="qiniuParam"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      list-type="picture"
      accept="image/*"
      :limit="maxNumber"
      :auto-upload="false">
      <div class="el-upload__text">
        <svg viewBox="0 0 1024 1024" w-10 h-10>
          <path
            d="M666.2656 629.4528l-113.7664-112.4864c-20.7872-20.5824-54.3232-20.5312-75.1104 0.1024l-113.3056 112.4864c-20.8896 20.736-21.0432 54.528-0.256 75.4688 20.736 20.8896 54.528 21.0432 75.4688 0.256l22.6304-22.4256v189.5936c0 29.44 23.9104 53.3504 53.3504 53.3504s53.3504-23.9104 53.3504-53.3504v-189.5424l22.6816 22.4256a53.1456 53.1456 0 0 0 37.5296 15.4112c13.7728 0 27.4944-5.2736 37.9392-15.8208 20.6336-20.9408 20.4288-54.7328-0.512-75.4688z"
            fill="#FFE37B"></path>
          <path
            d="M820.992 469.504h-5.376c-3.072-163.328-136.3456-294.8096-300.4416-294.8096S217.856 306.1248 214.784 469.504H209.408c-100.7104 0-182.3744 81.664-182.3744 182.3744s81.664 182.3744 182.3744 182.3744h209.7664V761.856c-30.208 5.5808-62.464-3.3792-85.6576-26.7264-37.3248-37.5808-37.0688-98.5088 0.512-135.7824l113.3056-112.4864c37.2224-36.9664 97.8432-37.0176 135.168-0.1536l113.7664 112.4864c18.2272 18.0224 28.3648 42.0864 28.5184 67.7376 0.1536 25.6512-9.728 49.8176-27.7504 68.0448a95.40096 95.40096 0 0 1-68.3008 28.5184c-5.9392 0-11.776-0.512-17.5104-1.5872v72.3456h209.7664c100.7104 0 182.3744-81.664 182.3744-182.3744S921.7024 469.504 820.992 469.504z"
            fill="#8C7BFD"></path>
        </svg>
        <div>拖拽上传 / 点击上传</div>
      </div>
      <div slot="tip" class="el-upload__tip">
        一次最多上传{{maxNumber}}张图片，且每张图片不超过{{maxSize}}M！
      </div>
    </el-upload>

    <div class="text-center mt-5">
      <el-button type="success" text-xs @click="submitUpload">
        上传
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { useMainStore } from '../../../store';
import mainAppBridge from '../../../utils/mainAppBridge';
import localConstant from '../../../utils/constant';

// 定义props
const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  },
  prefix: {
    type: String,
    default: ""
  },
  maxSize: {
    type: Number,
    default: 5
  },
  maxNumber: {
    type: Number,
    default: 5
  }
});

// 定义emit
const emit = defineEmits(['addPicture']);

// 注入依赖，同时提供备用方案
const http = inject('$http', null);
const common = inject('$common', null);
const constant = inject('$constant', null);
const store = useMainStore();

// 获取七牛云上传URL
const getQiniuUrl = () => {
  // 优先使用注入的常量
  if (constant && constant.qiniuUrl) {
    return constant.qiniuUrl;
  }
  
  // 尝试从主应用获取
  const mainConstant = mainAppBridge.getConstant();
  if (mainConstant && mainConstant.qiniuUrl) {
    return mainConstant.qiniuUrl;
  }
  
  // 使用本地常量
  return localConstant.qiniuUrl;
};

// 获取七牛云下载URL前缀
const getQiniuDownload = () => {
  // 优先使用注入的常量
  if (constant && constant.qiniuDownload) {
    return constant.qiniuDownload;
  }
  
  // 尝试从主应用获取
  const mainConstant = mainAppBridge.getConstant();
  if (mainConstant && mainConstant.qiniuDownload) {
    return mainConstant.qiniuDownload;
  }
  
  // 使用本地常量
  return localConstant.qiniuDownload;
};

// 获取API基础URL
const getBaseURL = () => {
  // 优先使用注入的常量
  if (constant && constant.baseURL) {
    return constant.baseURL;
  }
  
  // 尝试从主应用获取
  const mainConstant = mainAppBridge.getConstant();
  if (mainConstant && mainConstant.baseURL) {
    return mainConstant.baseURL;
  }
  
  // 使用本地常量
  return localConstant.baseURL;
};

// 获取HTTP服务
const getHttpService = () => {
  // 优先使用注入的HTTP服务
  if (http) {
    return http;
  }
  
  // 尝试从主应用获取
  const mainHttp = mainAppBridge.getHttp();
  if (mainHttp) {
    return mainHttp;
  }
  
  // 使用默认导入的HTTP服务
  return require('../../../utils/request').default;
};

// 获取通用工具
const getCommonUtils = () => {
  // 优先使用注入的通用工具
  if (common) {
    return common;
  }
  
  // 尝试从主应用获取
  const mainCommon = mainAppBridge.getCommon();
  if (mainCommon) {
    return mainCommon;
  }
  
  // 使用默认导入的通用工具
  return require('../../../utils/common').default;
};

// refs
const uploadRef = ref(null);

// 响应式状态
const qiniuParam = reactive({
  token: "",
  key: ""
});

// 生命周期钩子
onMounted(() => {
  // 获取通用工具
  const commonUtils = getCommonUtils();
  
  if ((!props.isAdmin && !commonUtils.isEmpty(store.currentUser)) || 
      (props.isAdmin && !commonUtils.isEmpty(store.currentAdmin))) {
    getUpToken();
  }
});

// 方法
const getUpToken = () => {
  // 获取HTTP服务和基础URL
  const httpService = getHttpService();
  const baseURL = getBaseURL();
  
  httpService.get(baseURL + "/qiniu/getUpToken", {}, props.isAdmin)
    .then((res) => {
      // 获取通用工具
      const commonUtils = getCommonUtils();
      
      if (!commonUtils.isEmpty(res.data)) {
        qiniuParam.token = res.data;
      }
    })
    .catch((error) => {
      ElMessage({
        message: error.message || "获取上传凭证失败",
        type: "error"
      });
    });
};

const submitUpload = () => {
  if (uploadRef.value) {
    uploadRef.value.submit();
  } else {
    ElMessage({
      message: "上传组件未初始化",
      type: "warning"
    });
  }
};

// 文件上传成功时的钩子
const handleSuccess = (response, file, fileList) => {
  qiniuParam.key = "";
  let url = getQiniuDownload() + response.key;
  
  // 获取通用工具
  const commonUtils = getCommonUtils();
  
  if (commonUtils.saveResource) {
    commonUtils.saveResource(null, props.prefix, url, props.isAdmin);
  }
  
  emit("addPicture", url);
};

const handleError = (err, file, fileList) => {
  qiniuParam.key = "";
  ElMessage({
    message: "上传出错！",
    type: "warning"
  });
};

// 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
const beforeUpload = (file) => {
  if (!qiniuParam.token) {
    ElMessage({
      message: "上传凭证未获取，请重试！",
      type: "warning"
    });
    return false;
  }
  
  // 获取通用工具
  const commonUtils = getCommonUtils();
  
  let username = "anonymous";
  try {
    if (props.isAdmin && !commonUtils.isEmpty(store.currentAdmin)) {
      username = store.currentAdmin.username.replace(/[^a-zA-Z]/g, '') + store.currentAdmin.id;
    } else if (!props.isAdmin && !commonUtils.isEmpty(store.currentUser)) {
      username = store.currentUser.username.replace(/[^a-zA-Z]/g, '') + store.currentUser.id;
    }
  } catch (e) {
    console.error("获取用户名失败", e);
  }
    
  qiniuParam.key = props.prefix + "/" + username + new Date().getTime() + Math.floor(Math.random() * 1000);
};

// 添加文件、上传成功和上传失败时都会被调用
const handleChange = (file, fileList) => {
  let flag = false;

  if (file.size > props.maxSize * 1024 * 1024) {
    ElMessage({
      message: "图片最大为" + props.maxSize + "M！",
      type: "warning"
    });
    flag = true;
  }

  if (flag) {
    fileList.splice(fileList.length - 1, 1);
  }
};
</script>

<style scoped>

</style>
