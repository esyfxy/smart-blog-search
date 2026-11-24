<template>
  <div class="admin-login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>管理员登录</h2>
        </div>
      </template>
      
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { authCenterApi } from '../../api/authCenter'
import { encrypt } from '../../utils/common'
import { useAuthStore } from '../../store'

const router = useRouter()
const loading = ref(false)
const loginFormRef = ref(null)
const authStore = useAuthStore()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    // 显示加载状态
    loading.value = true
    
    console.log('[AuthCenter] 正在尝试登录...')
    
    // 加密密码
    const loginData = {
      username: loginForm.username,
      password: encrypt(loginForm.password)
    }
    
    // 发送登录请求
    const response = await authCenterApi.login(loginData)
    
    console.log('[AuthCenter] 登录响应:', response)
    
    // 检查响应
    if (response.code == 200 && response.data) {
      const authData = response.data
      
      // 使用auth store保存认证信息
      authStore.setAuth(authData)
      
      // 显示成功消息
      ElMessage.success('[AuthCenter] 登录成功')
      
      // 跳转到管理页面
      router.push('/admin/dashboard')
    } else {
      ElMessage.error('[AuthCenter] ' + (response.message || '登录失败，请检查用户名和密码'))
    }
  } catch (error) {
    console.error('[AuthCenter] 登录错误:', error)
    
    if (error.response) {
      // 服务器响应错误
      const message = error.response.data?.message || '登录失败，服务器错误'
      ElMessage.error('[AuthCenter] ' + message)
    } else if (error.request) {
      // 请求发送但没有收到响应
      ElMessage.error('[AuthCenter] 登录失败，无法连接到服务器')
    } else {
      // 请求设置时出错
      ElMessage.error('[AuthCenter] 登录失败，请稍后再试')
    }
  } finally {
    // 无论成功与否，都关闭加载状态
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  max-width: 90%;
}

.card-header {
  display: flex;
  justify-content: center;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}
</style> 