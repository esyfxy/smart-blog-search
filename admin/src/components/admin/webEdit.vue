<template>
  <div class="web-edit-container w-full max-w-6xl mx-auto px-4 py-6">
    <!-- 基础信息部分 -->
    <div class="section-container">
      <div class="section-header blue">
        <h2 class="text-xl font-medium flex items-center">
          <div class="i-carbon-settings mr-2 text-2xl"></div>
          基础信息
        </h2>
      </div>
      
      <div class="section-content">
        <el-form :model="webInfo" :rules="rules" ref="ruleFormRef" label-width="100px"
                class="demo-ruleForm">
          <el-form-item label="网站名称" prop="webName">
            <el-input v-model="webInfo.webName" class="input-field"></el-input>
          </el-form-item>

          <el-form-item label="网站标题" prop="webTitle">
            <el-input v-model="webInfo.webTitle" class="input-field"></el-input>
          </el-form-item>

          <el-form-item label="页脚" prop="footer">
            <el-input v-model="webInfo.footer" class="input-field"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-switch @click="changeWebStatus(webInfo)" v-model="webInfo.status" 
                      class="custom-switch" active-color="#3b82f6" inactive-color="#cbd5e1"></el-switch>
          </el-form-item>

          <el-form-item label="背景" prop="backgroundImage">
            <div class="flex flex-col sm:flex-row gap-4">
              <el-input v-model="webInfo.backgroundImage" class="flex-1 input-field"></el-input>
              <el-image class="w-20 h-20 rounded-md object-cover border border-gray-200"
                        :preview-src-list="[webInfo.backgroundImage]"
                        :src="webInfo.backgroundImage"></el-image>
            </div>
            <div class="mt-4">
              <uploadPicture 
                :isAdmin="true" 
                :prefix="'webBackgroundImage'" 
                @addPicture="addBackgroundImage"
                :maxSize="5"
                :maxNumber="1">
              </uploadPicture>
            </div>
          </el-form-item>

          <el-form-item label="头像" prop="avatar">
            <div class="flex flex-col sm:flex-row gap-4">
              <el-input v-model="webInfo.avatar" class="flex-1 input-field"></el-input>
              <el-image class="avatar-preview"
                        :preview-src-list="[webInfo.avatar]"
                        :src="webInfo.avatar"></el-image>
            </div>
            <div class="mt-4">
              <uploadPicture 
                :isAdmin="true" 
                :prefix="'webAvatar'" 
                @addPicture="addAvatar"
                :maxSize="5"
                :maxNumber="1">
              </uploadPicture>
            </div>
          </el-form-item>

          <el-form-item label="提示" prop="waifuJson">
            <div class="flex">
              <el-input :disabled="disabled" :rows="6" type="textarea" v-model="webInfo.waifuJson"
                      class="input-field"></el-input>
              <div class="i-carbon-edit ml-2 text-xl text-blue-500 cursor-pointer" @click="disabled = !disabled"></div>
            </div>
          </el-form-item>
        </el-form>
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="submitForm(ruleFormRef)" 
                    class="btn-primary">保存</el-button>
        </div>
      </div>
    </div>

    <!-- 公告部分 -->
    <div class="section-container">
      <div class="section-header orange">
        <h2 class="text-xl font-medium flex items-center">
          <div class="i-carbon-notification mr-2 text-2xl"></div>
          公告
        </h2>
      </div>
      
      <div class="section-content">
        <div class="flex flex-wrap gap-2 mb-4">
          <el-tag
            v-for="(notice, i) in notices" 
            :key="i"
            closable
            class="tag-item tag-blue"
            :disable-transitions="false"
            @close="handleClose(notices, notice)">
            {{notice}}
          </el-tag>
        </div>
        
        <div class="flex items-center">
          <el-input
            class="w-64 mr-2"
            v-if="inputNoticeVisible"
            v-model="inputNoticeValue"
            ref="saveNoticeInputRef"
            size="small"
            placeholder="请输入公告内容"
            @keyup.enter="handleInputNoticeConfirm"
            @blur="handleInputNoticeConfirm">
          </el-input>
          <el-button v-else size="small" @click="showNoticeInput()" 
                    class="btn-primary add-button">
            <div class="i-carbon-add add-button-icon"></div> 添加公告
          </el-button>
        </div>
        
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="saveNotice()" 
                    class="btn-orange">保存公告</el-button>
        </div>
      </div>
    </div>

    <!-- 随机名称部分 -->
    <div class="section-container">
      <div class="section-header blue">
        <h2 class="text-xl font-medium flex items-center">
          <div class="i-carbon-user-profile mr-2 text-2xl"></div>
          随机名称
        </h2>
      </div>
      
      <div class="section-content">
        <div class="flex flex-wrap gap-2 mb-4">
          <el-tag
            :key="i"
            v-for="(name, i) in randomName"
            closable
            :disable-transitions="false"
            class="tag-item"
            :class="[
              i % 5 === 0 ? 'tag-blue' :
              i % 5 === 1 ? 'bg-green-100 text-green-800 border-green-200' :
              i % 5 === 2 ? 'tag-orange' :
              i % 5 === 3 ? 'bg-purple-100 text-purple-800 border-purple-200' :
              'bg-red-100 text-red-800 border-red-200'
            ]"
            @close="handleClose(randomName, name)">
            {{name}}
          </el-tag>
        </div>
        
        <div class="flex items-center">
          <el-input
            class="w-64 mr-2"
            v-if="inputRandomNameVisible"
            v-model="inputRandomNameValue"
            ref="saveRandomNameInput"
            size="small"
            placeholder="请输入随机名称"
            @keyup.enter="handleInputRandomNameConfirm"
            @blur="handleInputRandomNameConfirm">
          </el-input>
          <el-button v-else size="small" @click="showRandomNameInput" 
                    class="btn-primary add-button">
            <div class="i-carbon-add add-button-icon"></div> 添加随机名称
          </el-button>
        </div>
        
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="saveRandomName()" 
                    class="btn-orange">保存随机名称</el-button>
        </div>
      </div>
    </div>

    <!-- 随机头像部分 -->
    <div class="section-container">
      <div class="section-header orange">
        <h2 class="text-xl font-medium flex items-center">
          <div class="i-carbon-user-avatar mr-2 text-2xl"></div>
          随机头像
        </h2>
      </div>
      
      <div class="section-content">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div v-for="(avatar, i) in randomAvatar" :key="i" class="item-card">
            <el-tag
              class="flex-1 mr-4 py-2 px-3 tag-blue truncate"
              closable
              :disable-transitions="false"
              @close="handleClose(randomAvatar, avatar)">
              {{avatar}}
            </el-tag>
            <el-image class="avatar-preview"
                      :preview-src-list="[avatar]"
                      :src="avatar"></el-image>
          </div>
        </div>

        <div class="flex items-center mb-4">
          <el-input
            class="w-64 mr-2"
            v-if="inputRandomAvatarVisible"
            v-model="inputRandomAvatarValue"
            ref="saveRandomAvatarInput"
            size="small"
            placeholder="请输入头像URL"
            @keyup.enter="handleInputRandomAvatarConfirm"
            @blur="handleInputRandomAvatarConfirm">
          </el-input>
          <el-button v-else size="small" @click="showRandomAvatarInput" 
                    class="btn-primary add-button">
            <div class="i-carbon-add add-button-icon"></div> 添加随机头像
          </el-button>
        </div>
        
        <div class="mt-4">
          <uploadPicture 
            :isAdmin="true" 
            :prefix="'randomAvatar'" 
            @addPicture="addRandomAvatar"
            :maxSize="1"
            :maxNumber="5">
          </uploadPicture>
        </div>
        
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="saveRandomAvatar()" 
                    class="btn-orange">保存随机头像</el-button>
        </div>
      </div>
    </div>

    <!-- 随机封面部分 -->
    <div class="section-container">
      <div class="section-header blue">
        <h2 class="text-xl font-medium flex items-center">
          <div class="i-carbon-image mr-2 text-2xl"></div>
          随机封面
        </h2>
      </div>
      
      <div class="section-content">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div v-for="(cover, i) in randomCover" :key="i" class="item-card">
            <el-tag
              class="flex-1 mr-4 py-2 px-3 tag-blue truncate"
              closable
              :disable-transitions="false"
              @close="handleClose(randomCover, cover)">
              {{cover}}
            </el-tag>
            <el-image class="cover-preview"
                      :preview-src-list="[cover]"
                      :src="cover"></el-image>
          </div>
        </div>

        <div class="flex items-center mb-4">
          <el-input
            class="w-64 mr-2"
            v-if="inputRandomCoverVisible"
            v-model="inputRandomCoverValue"
            ref="saveRandomCoverInput"
            size="small"
            placeholder="请输入封面URL"
            @keyup.enter="handleInputRandomCoverConfirm"
            @blur="handleInputRandomCoverConfirm">
          </el-input>
          <el-button v-else size="small" @click="showRandomCoverInput" 
                    class="btn-primary add-button">
            <div class="i-carbon-add add-button-icon"></div> 添加随机封面
          </el-button>
        </div>
        
        <div class="mt-4">
          <uploadPicture 
            :isAdmin="true" 
            :prefix="'randomCover'" 
            @addPicture="addRandomCover"
            :maxSize="5"
            :maxNumber="5">
          </uploadPicture>
        </div>
        
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="saveRandomCover()" 
                    class="btn-orange">保存随机封面</el-button>
        </div>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="flex justify-center mt-6 mb-10">
      <el-button type="danger" @click="resetForm('ruleForm')" 
                class="btn-danger">
        <div class="i-carbon-reset mr-1"></div> 重置所有修改
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import uploadPicture from "./common/uploadPicture.vue";

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');

// DOM引用
const ruleFormRef = ref(null);
const saveNoticeInputRef = ref(null);
const saveRandomNameInput = ref(null);
const saveRandomAvatarInput = ref(null);
const saveRandomCoverInput = ref(null);

// 响应式状态
const webInfo = reactive({
  webName: "",
  webTitle: "",
  footer: "",
  status: false,
  backgroundImage: "",
  avatar: "",
  waifuJson: ""
});

const disabled = ref(true);
const inputNoticeVisible = ref(false);
const inputNoticeValue = ref('');
const notices = ref([]);
const inputRandomNameVisible = ref(false);
const inputRandomNameValue = ref('');
const randomName = ref([]);
const inputRandomAvatarVisible = ref(false);
const inputRandomAvatarValue = ref('');
const randomAvatar = ref([]);
const inputRandomCoverVisible = ref(false);
const inputRandomCoverValue = ref('');
const randomCover = ref([]);
const types = ['', 'success', 'info', 'warning', 'danger'];

// 表单验证规则
const rules = {
  webName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' }
  ],
  webTitle: [
    { required: true, message: '请输入网站标题', trigger: 'blur' }
  ],
  footer: [
    { required: true, message: '请输入页脚', trigger: 'blur' }
  ],
  backgroundImage: [
    { required: true, message: '请上传背景图片', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '请上传头像', trigger: 'blur' }
  ]
};

// 生命周期钩子
onMounted(() => {
  getWebInfo();
});

// 方法
const getWebInfo = () => {
  http.get(constant.baseURL + "/webInfo/getWebInfo")
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        // 基本信息直接赋值
        Object.assign(webInfo, {
          id: res.data.id,
          webName: res.data.webName,
          webTitle: res.data.webTitle,
          footer: res.data.footer,
          backgroundImage: res.data.backgroundImage,
          avatar: res.data.avatar,
          waifuJson: res.data.waifuJson,
          status: res.data.status
        });
        
        // 使用辅助函数处理数组类型字段
        notices.value = ensureArray(res.data.notices);
        randomName.value = ensureArray(res.data.randomName);
        randomAvatar.value = ensureArray(res.data.randomAvatar);
        randomCover.value = res.data.randomCover === "null" ? [] : ensureArray(res.data.randomCover);
      }
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 创建一个新对象，避免直接修改响应式对象
      const formData = { ...webInfo };
      
      http.post(constant.baseURL + "/webInfo/updateWebInfo", formData, true)
        .then(() => {
          ElMessage.success("保存成功！");
        })
        .catch((error) => {
          ElMessage.error(error.message);
        });
    } else {
      ElMessage.error("请完善必填项！");
    }
  });
};

const changeWebStatus = (item) => {
  ElMessageBox.confirm('确认修改网站状态？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(() => {
    http.get(constant.baseURL + "/webInfo/changeWebStatus", {status: item.status}, true)
      .then(() => {
        ElMessage.success("修改成功！");
      })
      .catch((error) => {
        ElMessage.error(error.message);
      });
  }).catch(() => {
    item.status = !item.status;
    ElMessage.success('已取消修改!');
  });
};

const addBackgroundImage = (res) => {
  webInfo.backgroundImage = res;
};

const addAvatar = (res) => {
  webInfo.avatar = res;
};

// 通用处理函数，确保数组是响应式的
const ensureArray = (value) => {
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('解析JSON失败:', e);
      return [];
    }
  }
  return Array.isArray(value) ? value : [];
};

// 处理数组元素删除
const handleClose = (array, item) => {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
};

const showNoticeInput = () => {
  inputNoticeVisible.value = true;
  nextTick(() => {
    saveNoticeInputRef.value.focus();
  });
};

const handleInputNoticeConfirm = () => {
  if (inputNoticeValue.value) {
    notices.value.push(inputNoticeValue.value);
  }
  inputNoticeVisible.value = false;
  inputNoticeValue.value = '';
};

const saveNotice = () => {
  // 构建正确的请求格式
  const noticeData = {
    id: webInfo.id,
    notices: JSON.stringify(notices.value)
  };
  
  http.post(constant.baseURL + "/webInfo/updateWebInfo", noticeData, true)
    .then(() => {
      ElMessage.success("公告保存成功！");
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const showRandomNameInput = () => {
  inputRandomNameVisible.value = true;
  nextTick(() => {
    saveRandomNameInput.value.focus();
  });
};

const handleInputRandomNameConfirm = () => {
  if (inputRandomNameValue.value) {
    randomName.value.push(inputRandomNameValue.value);
  }
  inputRandomNameVisible.value = false;
  inputRandomNameValue.value = '';
};

const saveRandomName = () => {
  // 构建正确的请求格式
  const nameData = {
    id: webInfo.id,
    randomName: JSON.stringify(randomName.value)
  };
  
  http.post(constant.baseURL + "/webInfo/updateRandomName", nameData, true)
    .then(() => {
      ElMessage.success("随机名称保存成功！");
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const showRandomAvatarInput = () => {
  inputRandomAvatarVisible.value = true;
  nextTick(() => {
    saveRandomAvatarInput.value.focus();
  });
};

const handleInputRandomAvatarConfirm = () => {
  if (inputRandomAvatarValue.value) {
    randomAvatar.value.push(inputRandomAvatarValue.value);
  }
  inputRandomAvatarVisible.value = false;
  inputRandomAvatarValue.value = '';
};

const addRandomAvatar = (res) => {
  randomAvatar.value.push(res);
};

const saveRandomAvatar = () => {
  // 构建正确的请求格式
  const avatarData = {
    id: webInfo.id,
    randomAvatar: JSON.stringify(randomAvatar.value)
  };
  
  http.post(constant.baseURL + "/webInfo/updateRandomAvatar", avatarData, true)
    .then(() => {
      ElMessage.success("随机头像保存成功！");
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

const showRandomCoverInput = () => {
  inputRandomCoverVisible.value = true;
  nextTick(() => {
    saveRandomCoverInput.value.focus();
  });
};

const handleInputRandomCoverConfirm = () => {
  if (inputRandomCoverValue.value) {
    randomCover.value.push(inputRandomCoverValue.value);
  }
  inputRandomCoverVisible.value = false;
  inputRandomCoverValue.value = '';
};

const addRandomCover = (res) => {
  randomCover.value.push(res);
};

const saveRandomCover = () => {
  // 构建正确的请求格式
  const coverData = {
    id: webInfo.id,
    randomCover: JSON.stringify(randomCover.value)
  };
  
  http.post(constant.baseURL + "/webInfo/updateRandomCover", coverData, true)
    .then(() => {
      ElMessage.success("随机封面保存成功！");
    })
    .catch((error) => {
      ElMessage.error(error.message);
    });
};

// 重置表单
const resetForm = (formName) => {
  ElMessageBox.confirm('确定要重置所有修改吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重新获取数据
    getWebInfo();
    ElMessage.success('已重置所有修改！');
  }).catch(() => {
    ElMessage.info('已取消重置');
  });
};
</script>

<style scoped>
.section-container {
  @apply bg-white rounded-lg shadow-sm mb-8 overflow-hidden;
}

.section-header {
  @apply p-4 text-white;
}

.section-header.blue {
  @apply bg-gradient-to-r from-blue-500 to-blue-600;
}

.section-header.orange {
  @apply bg-gradient-to-r from-orange-400 to-orange-500;
}

.section-content {
  @apply p-6;
}

.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white;
}

.btn-orange {
  @apply bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 text-white;
}

.btn-danger {
  @apply bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white;
}

.input-field {
  @apply hover:border-blue-500 focus:border-blue-500;
}

.tag-item {
  @apply px-3 py-2 text-sm rounded-full;
}

.tag-blue {
  @apply bg-blue-100 text-blue-800 border-blue-200;
}

.tag-orange {
  @apply bg-orange-100 text-orange-800 border-orange-200;
}

.avatar-preview {
  @apply w-12 h-12 rounded-full object-cover border border-gray-200;
}

.cover-preview {
  @apply w-16 h-12 rounded object-cover border border-gray-200;
}

.item-card {
  @apply flex items-center p-3 border border-gray-200 rounded-lg;
}

.add-button {
  @apply flex items-center justify-center;
}

.add-button-icon {
  @apply mr-1;
}
</style>
