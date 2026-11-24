<template>
  <div class="cos-config-container">
    <div class="header-section mb-4 flex justify-between items-center">
      <h2 class="text-xl font-semibold">云存储配置管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon>
        添加配置
      </el-button>
    </div>
    
    <el-table :data="configList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="配置名称" min-width="120" />
      <el-table-column prop="type" label="服务提供商" min-width="120">
        <template #default="scope">
          <el-tag :type="getProviderTagType(scope.row.type)">
            {{ getProviderName(scope.row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="region" label="区域" min-width="120" />
      <el-table-column prop="bucket" label="存储桶" min-width="120" />
      <el-table-column prop="domain" label="访问域名" min-width="180" />
      <el-table-column prop="cdnDomain" label="源站CDN域名" min-width="180" />
      <el-table-column prop="prefix" label="路径前缀" min-width="120" />
      <el-table-column prop="isDefault" label="默认配置" width="100" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDefault"
            @change="handleSetDefault(scope.row)"
            :disabled="scope.row.isDefault"
          />
        </template>
      </el-table-column>
      <el-table-column prop="isEnabled" label="启用状态" width="100" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isEnabled"
            @change="handleChangeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="testConnection(scope.row)">
            测试连接
          </el-button>
          <el-button type="warning" size="small" @click="openDialog(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 配置表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑云存储配置' : '添加云存储配置'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置名称" />
        </el-form-item>
        
        <el-form-item label="服务提供商" prop="type">
          <el-select v-model="form.type" placeholder="请选择服务提供商" style="width: 100%">
            <el-option label="腾讯云 COS" value="cos" />
            <el-option label="阿里云 OSS" value="oss" />
            <el-option label="七牛云" value="qiniu" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="区域" prop="region">
          <el-input v-model="form.region" placeholder="请输入区域，如：ap-guangzhou" />
        </el-form-item>
        
        <el-form-item label="存储桶名称" prop="bucket">
          <el-input v-model="form.bucket" placeholder="请输入存储桶名称" />
        </el-form-item>
        
        <el-form-item label="访问域名" prop="domain">
          <el-input v-model="form.domain" placeholder="请输入访问域名，如：https://example.com" />
        </el-form-item>
        
        <el-form-item label="源站CDN域名" prop="cdnDomain">
          <el-input v-model="form.cdnDomain" placeholder="请输入源站CDN域名，如：https://bucket-id.cos.region.myqcloud.com" />
          <div class="text-gray-400 text-xs mt-1">用于直接上传文件到COS，不填则使用默认域名</div>
        </el-form-item>
        
        <el-form-item label="路径前缀" prop="prefix">
          <el-input v-model="form.prefix" placeholder="请输入路径前缀，如：upload/article/{YYYYMM}">
            <template #prepend>/</template>
          </el-input>
          <div class="text-gray-400 text-xs mt-1">
            上传文件时会自动添加此前缀，例如：/uploads/file.jpg
            <br>
            支持的模板标记：{YYYY}=年份, {MM}=月份, {DD}=日期, {YYYYMM}=年月, {YYYYMMDD}=年月日
          </div>
        </el-form-item>
        
        <el-form-item label="访问密钥 ID" prop="accessKey">
          <el-input v-model="form.accessKey" placeholder="请输入访问密钥 ID" />
        </el-form-item>
        
        <el-form-item label="访问密钥密文" prop="secretKey">
          <el-input v-model="form.secretKey" placeholder="请输入访问密钥密文" type="password" show-password />
        </el-form-item>
        
        <el-form-item label="是否为默认">
          <el-switch v-model="form.isDefault" />
          <div class="text-gray-400 text-xs mt-1">设为默认后，上传文件时如不指定配置将使用此配置</div>
        </el-form-item>
        
        <el-form-item label="是否启用">
          <el-switch v-model="form.isEnabled" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useCloudStorageStore } from '../../store';
import { useAuthStore } from '../../store';

const router = useRouter();
const cloudStorageStore = useCloudStorageStore();
const authStore = useAuthStore();

// 数据列表
const configList = computed(() => cloudStorageStore.configList);
const loading = computed(() => cloudStorageStore.loading);
const dialogVisible = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const formRef = ref(null);

// 表单数据
const form = reactive({
  id: null,
  name: '',
  type: 'cos', // 服务提供商类型
  region: '',
  bucket: '',
  domain: '',
  cdnDomain: '',
  prefix: '',
  accessKey: '',
  secretKey: '',
  isDefault: false,
  isEnabled: true
});

// 云存储常量
const CLOUD_STORAGE_PREFIX = '[CloudStorage]';

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择服务提供商', trigger: 'change' }],
  region: [{ required: true, message: '请输入区域', trigger: 'blur' }],
  bucket: [{ required: true, message: '请输入存储桶名称', trigger: 'blur' }],
  domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }],
  accessKey: [{ required: true, message: '请输入访问密钥 ID', trigger: 'blur' }],
  secretKey: [{ required: true, message: '请输入访问密钥密文', trigger: 'blur' }]
};

// 获取提供商显示名称
const getProviderName = (provider) => {
  const providerMap = {
    'cos': '腾讯云 COS',
    'oss': '阿里云 OSS',
    'qiniu': '七牛云'
  };
  return providerMap[provider] || provider;
};

// 获取提供商标签类型
const getProviderTagType = (provider) => {
  const typeMap = {
    'cos': 'success',
    'oss': 'warning',
    'qiniu': 'danger'
  };
  return typeMap[provider] || 'info';
};

// 打开对话框
const openDialog = (row) => {
  resetForm();
  if (row) {
    isEdit.value = true;
    Object.keys(form).forEach(key => {
      if (key in row) {
        form[key] = row[key];
      }
    });
  } else {
    isEdit.value = false;
  }
  dialogVisible.value = true;
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  form.id = null;
  form.name = '';
  form.type = 'cos';
  form.region = '';
  form.bucket = '';
  form.domain = '';
  form.cdnDomain = '';
  form.prefix = '';
  form.accessKey = '';
  form.secretKey = '';
  form.isDefault = false;
  form.isEnabled = true;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        // 打印表单数据，帮助调试
        console.log(`${CLOUD_STORAGE_PREFIX} 提交表单数据:`, JSON.stringify(form, null, 2));
        
        let response;
        if (isEdit.value) {
          console.log(`${CLOUD_STORAGE_PREFIX} 正在更新ID为 ${form.id} 的配置`);
          if (!form.id) {
            ElMessage.error(`${CLOUD_STORAGE_PREFIX} 更新失败: 缺少ID参数`);
            submitLoading.value = false;
            return;
          }
          await cloudStorageStore.updateConfig(form.id, form);
        } else {
          console.log(`${CLOUD_STORAGE_PREFIX} 正在创建新配置`);
          await cloudStorageStore.createConfig(form);
        }
        
          dialogVisible.value = false;
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 提交表单失败:`, error);
        handleApiError(error, '提交表单失败');
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 获取配置列表
const fetchConfigList = async () => {
  try {
    // 检查是否已登录
    if (!authStore.isAuthenticated) {
      ElMessage.error(`${CLOUD_STORAGE_PREFIX} 您尚未登录或登录已过期，请先登录`);
      router.push('/login');
      return;
    }
    
    console.log(`${CLOUD_STORAGE_PREFIX} 用户已登录，开始获取云存储配置列表`);
    await cloudStorageStore.fetchConfigList();
  } catch (error) {
    console.error(`${CLOUD_STORAGE_PREFIX} 获取配置列表失败:`, error);
    handleApiError(error, '获取配置列表失败');
  }
};

// 删除配置
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除配置 "${row.name}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await cloudStorageStore.deleteConfig(row.id);
    } catch (error) {
      console.error(`${CLOUD_STORAGE_PREFIX} 删除失败:`, error);
      handleApiError(error, '删除失败');
    }
  }).catch(() => {
    // 用户取消删除
  });
};

// 设置默认配置
const handleSetDefault = async (row) => {
  try {
    await cloudStorageStore.setDefaultConfig(row.id);
  } catch (error) {
    console.error(`${CLOUD_STORAGE_PREFIX} 设置默认配置失败:`, error);
    handleApiError(error, '设置默认配置失败');
    // 恢复原状态
    row.isDefault = !row.isDefault;
  }
};

// 修改启用状态
const handleChangeStatus = async (row) => {
  try {
    await cloudStorageStore.changeConfigStatus(row.id, row.isEnabled);
  } catch (error) {
    console.error(`${CLOUD_STORAGE_PREFIX} 修改状态失败:`, error);
    handleApiError(error, '修改状态失败');
    // 恢复原状态
    row.isEnabled = !row.isEnabled;
  }
};

// 测试连接
const testConnection = async (row) => {
  try {
    ElMessage.info(`${CLOUD_STORAGE_PREFIX} 正在测试 "${row.name}" 的连接...`);
    await cloudStorageStore.testConnection(row);
  } catch (error) {
    console.error(`${CLOUD_STORAGE_PREFIX} 测试连接失败:`, error);
    handleApiError(error, '测试连接失败');
  }
};

// 处理API错误
const handleApiError = (error, prefix = '操作失败') => {
  if (error.response) {
    // 服务器响应错误
    if (error.response.status === 401) {
      ElMessage.error(`${CLOUD_STORAGE_PREFIX} 登录已过期，请重新登录`);
      authStore.clearAuth();
      // router.push('/login');
    } else {
      const message = error.response.data?.message || '服务器错误';
      ElMessage.error(`${CLOUD_STORAGE_PREFIX} ${prefix}: ${message}`);
    }
  } else if (error.request) {
    // 请求发送但没有收到响应
    ElMessage.error(`${CLOUD_STORAGE_PREFIX} ${prefix}: 无法连接到服务器`);
  } else {
    // 请求设置时出错
    ElMessage.error(`${CLOUD_STORAGE_PREFIX} ${prefix}: ${error.message || '未知错误'}`);
  }
};

// 页面加载时获取配置列表
onMounted(() => {
  // 检查是否已登录
  if (!authStore.isAuthenticated) {
    ElMessage.error(`${CLOUD_STORAGE_PREFIX} 您尚未登录或登录已过期，请先登录`);
    router.push('/login');
    return;
  }
  
  console.log(`${CLOUD_STORAGE_PREFIX} 用户已登录，开始获取云存储配置列表`);
  fetchConfigList();
});
</script>

<style scoped>
.cos-config-container {
  padding: 20px;
}
</style> 