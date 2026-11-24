<template>
  <div class="verify-container w-full h-screen flex items-center justify-center">
    <div class="verify-content bg-white/90 rounded-lg shadow-lg w-80 p-6 pt-10 relative">
      <div class="absolute left-1/2 -top-6 -translate-x-1/2">
        <el-avatar :size="50" :src="store.webInfo.avatar || defaultAvatar"></el-avatar>
      </div>
      <h2 class="text-center text-lg font-medium mb-6">管理员登录</h2>
      <div class="mb-4">
        <el-input v-model="account" placeholder="请输入账号">
          <template #prepend>账号</template>
        </el-input>
      </div>
      <div class="mb-6">
        <el-input v-model="password" type="password" placeholder="请输入密码" @keyup.enter="login">
          <template #prepend>密码</template>
        </el-input>
      </div>
      <div class="flex justify-center">
        <proButton :info="'登录'"
                   @click="login"
                   :loading="loading"
                   :before="constant?.before_color_2 || 'rgb(131, 123, 199)'"
                   :after="constant?.after_color_2 || 'linear-gradient(45deg, #f43f3b, #ec008c)'">
        </proButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useMainStore } from '../../store';
import mainAppBridge from '../../utils/mainAppBridge';
import proButton from "../common/proButton.vue";
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { encrypt } from '../../utils/common';

// 注入依赖
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');

// 获取路由实例
const router = useRouter();
const route = useRoute();

// 获取store实例
const store = useMainStore();

// 默认头像
const defaultAvatar = computed(() => {
  if (constant && constant.defaultAvatar) {
    return constant.defaultAvatar;
  }
  
  const mainConstant = mainAppBridge.getConstant();
  if (mainConstant && mainConstant.defaultAvatar) {
    return mainConstant.defaultAvatar;
  }
  
  return 'https://img.roginx.ink/default/avatar.jpg';
});

// 响应式状态
const account = ref('');
const password = ref('');
const loading = ref(false);

// 获取重定向地址，确保使用/admin前缀
const redirect = computed(() => {
  // 获取查询参数中的redirect
  const redirectParam = route.query.redirect;
  
  // 如果有指定的重定向地址，检查是否有/admin前缀
  if (redirectParam) {
    return redirectParam.startsWith('/admin') ? redirectParam : '/admin' + redirectParam;
  }
  
  // 默认重定向到后台首页
  return '/main';
});

// 加密函数


// 登录方法
const login = async () => {
  // 表单验证
  if (!account.value || !password.value) {
    ElMessage({
      message: "请输入账号和密码！",
      type: "error"
    });
    return;
  }
  
  // 设置加载状态
  loading.value = true;
  
  try {
    // 加密密码
    let encryptedPassword;
    if (common && common.encrypt) {
      encryptedPassword = common.encrypt(password.value.trim());
    } else {
      encryptedPassword = encrypt(password.value.trim());
    }
    
    // 构建登录参数 - 确保与主应用格式一致
    const user = {
      account: account.value.trim(), // 使用account作为参数名
      password: encryptedPassword,
      isAdmin: true
    };
    
    console.log('登录参数:', user);
    
    // 获取baseURL
    let baseURL = '/api';
    
    // 发送登录请求
    let response;
    if (http && http.post) {
      response = await http.post(baseURL + "/user/login", user, true, false);
    } else {
      // 如果http不可用，使用axios直接请求
      const axios = (await import('axios')).default;
      response = await axios.post(baseURL + "/user/login", user, {
        headers: { 'X-Admin': 'true' }
      });
      response = response.data; // axios包装了一层data
    }
    
    console.log('登录响应:', response);
    
    // 处理登录成功
    if (response && (response.code === 200 || response.code === undefined)) {
      const data = response.data || response;
      
      if (data) {
        console.log('登录成功，保存token:', data.accessToken);
        // 保存token
        localStorage.setItem("userToken", data.accessToken);
        
        // 更新store
        store.loadCurrentAdmin(data);
        
        // 清空表单
        account.value = "";
        password.value = "";
        
        // 根据环境决定导航方式
        if (qiankunWindow.__POWERED_BY_QIANKUN__) {
          // 在微前端环境中，使用history API导航
          window.history.pushState({}, '', redirect.value);
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          // 独立运行时，使用Vue Router导航
          router.push(redirect.value);
        }
        
        ElMessage({
          message: "登录成功",
          type: "success"
        });
      } else {
        throw new Error('登录响应数据为空');
      }
    } else {
      throw new Error(response?.message || '登录失败，请检查账号和密码');
    }
  } catch (error) {
    console.error('登录错误:', error);
    
    // 处理登录失败
    ElMessage({
      message: error.message || "登录失败，请检查账号和密码",
      type: "error"
    });
  } finally {
    // 重置加载状态
    loading.value = false;
  }
};

// 页面加载时检查是否已登录
onMounted(async () => {
  const token = localStorage.getItem("userToken");
  const adminInfo = store.currentAdmin;
  
  console.log('当前token:', token);
  console.log('当前管理员信息:', adminInfo);
  
  // 如果有token但没有管理员信息，尝试自动获取
  if (token && (!adminInfo || !adminInfo.id)) {
    try {
      console.log('检测到userToken，尝试自动获取管理员信息...');
      await store.autoFetchAdminInfo();
      
      // 获取成功后检查是否有管理员信息
      if (store.currentAdmin && store.currentAdmin.id) {
        console.log('自动获取管理员信息成功，跳转到主页');
        // 根据环境决定导航方式
        if (qiankunWindow.__POWERED_BY_QIANKUN__) {
          // 在微前端环境中，使用history API导航
          window.history.pushState({}, '', redirect.value);
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          // 独立运行时，使用Vue Router导航
          router.push(redirect.value);
        }
        return;
      }
    } catch (error) {
      console.error('自动获取管理员信息失败:', error);
      // 如果获取失败，清除无效的token
      localStorage.removeItem("userToken");
      localStorage.removeItem("freshToken");
    }
  }
  
  // 如果已登录且有token和管理员信息，直接跳转
  if (token && adminInfo && adminInfo.id) {
    // 根据环境决定导航方式
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      // 在微前端环境中，使用history API导航
      window.history.pushState({}, '', redirect.value);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // 独立运行时，使用Vue Router导航
      router.push(redirect.value);
    }
  }
});
</script>

<style scoped>
.verify-container {
  background: var(--verifyImage) center center / cover repeat;
  background-size: cover;
  background-position: center;
}
</style>
