import { defineStore } from 'pinia';
import { cloudStorageApi } from '../../api/cloudStorage';
import { ElMessage } from 'element-plus';

// 云存储常量
const CLOUD_STORAGE_PREFIX = '[CloudStorage]';

export const useCloudStorageStore = defineStore('cloudStorage', {
  state: () => ({
    configList: [],
    currentConfig: null,
    loading: false,
    submitting: false,
  }),
  
  getters: {
    // 获取默认配置
    defaultConfig: (state) => state.configList.find(config => config.isDefault) || null,
    
    // 获取启用的配置列表
    enabledConfigs: (state) => state.configList.filter(config => config.isEnabled),
    
    // 获取配置总数
    configCount: (state) => state.configList.length,
  },
  
  actions: {
    // 获取所有云存储配置
    async fetchConfigList() {
      this.loading = true;
      
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始获取云存储配置列表`);
        const response = await cloudStorageApi.getList();
        
        if (response.data) {
          this.configList = response.data;
          console.log(`${CLOUD_STORAGE_PREFIX} 获取云存储配置列表成功，共 ${response.data.length} 条`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 获取云存储配置列表失败:`, response.message);
        throw new Error(response.message || '获取云存储配置列表失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 获取云存储配置列表错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 获取云存储配置失败: ${error.message || '未知错误'}`);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取单个云存储配置
    async fetchConfig(id) {
      this.loading = true;
      
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始获取云存储配置详情，ID: ${id}`);
        const response = await cloudStorageApi.getDetail(id);
        
        if (response.code == 200 && response.data) {
          this.currentConfig = response.data;
          console.log(`${CLOUD_STORAGE_PREFIX} 获取云存储配置详情成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 获取云存储配置详情失败:`, response.message);
        throw new Error(response.message || '获取云存储配置详情失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 获取云存储配置详情错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 获取云存储配置详情失败: ${error.message || '未知错误'}`);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 创建云存储配置
    async createConfig(configData) {
      this.submitting = true;
      
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始创建云存储配置`);
        const response = await cloudStorageApi.create(configData);
        
        if (response.code == 200 && response.data) {
          // 添加到列表
          this.configList.push(response.data);
          console.log(`${CLOUD_STORAGE_PREFIX} 创建云存储配置成功`);
          ElMessage.success(`${CLOUD_STORAGE_PREFIX} 创建云存储配置成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 创建云存储配置失败:`, response.message);
        throw new Error(response.message || '创建云存储配置失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 创建云存储配置错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 创建云存储配置失败: ${error.message || '未知错误'}`);
        throw error;
      } finally {
        this.submitting = false;
      }
    },
    
    // 更新云存储配置
    async updateConfig(id, configData) {
      this.submitting = true;
      
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始更新云存储配置，ID: ${id}`);
        const response = await cloudStorageApi.update(id, configData);
        
        if (response.code == 200 && response.data) {
          // 更新列表中的配置
          const index = this.configList.findIndex(config => config.id === id);
          if (index !== -1) {
            this.configList[index] = response.data;
          }
          
          console.log(`${CLOUD_STORAGE_PREFIX} 更新云存储配置成功`);
          ElMessage.success(`${CLOUD_STORAGE_PREFIX} 更新云存储配置成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 更新云存储配置失败:`, response.message);
        throw new Error(response.message || '更新云存储配置失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 更新云存储配置错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 更新云存储配置失败: ${error.message || '未知错误'}`);
        throw error;
      } finally {
        this.submitting = false;
      }
    },
    
    // 删除云存储配置
    async deleteConfig(id) {
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始删除云存储配置，ID: ${id}`);
        const response = await cloudStorageApi.delete(id);
        
        if (response.success) {
          // 从列表中移除
          this.configList = this.configList.filter(config => config.id !== id);
          
          // 如果当前配置是被删除的配置，清空当前配置
          if (this.currentConfig && this.currentConfig.id === id) {
            this.currentConfig = null;
          }
          
          console.log(`${CLOUD_STORAGE_PREFIX} 删除云存储配置成功`);
          ElMessage.success(`${CLOUD_STORAGE_PREFIX} 删除云存储配置成功`);
          return true;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 删除云存储配置失败:`, response.message);
        throw new Error(response.message || '删除云存储配置失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 删除云存储配置错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 删除云存储配置失败: ${error.message || '未知错误'}`);
        throw error;
      }
    },
    
    // 设置默认配置
    async setDefaultConfig(id) {
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始设置默认配置，ID: ${id}`);
        const response = await cloudStorageApi.setDefault(id);
        
        if (response.code == 200 && response.data) {
          // 更新列表中的配置
          this.configList = this.configList.map(config => ({
            ...config,
            isDefault: config.id === id
          }));
          
          console.log(`${CLOUD_STORAGE_PREFIX} 设置默认配置成功`);
          ElMessage.success(`${CLOUD_STORAGE_PREFIX} 设置默认配置成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 设置默认配置失败:`, response.message);
        throw new Error(response.message || '设置默认配置失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 设置默认配置错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 设置默认配置失败: ${error.message || '未知错误'}`);
        throw error;
      }
    },
    
    // 修改配置启用状态
    async changeConfigStatus(id, isEnabled) {
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始${isEnabled ? '启用' : '禁用'}配置，ID: ${id}`);
        const response = await cloudStorageApi.changeStatus(id, isEnabled);
        
        if (response.code == 200 && response.data) {
          // 更新列表中的配置
          const index = this.configList.findIndex(config => config.id === id);
          if (index !== -1) {
            this.configList[index].isEnabled = isEnabled;
          }
          
          console.log(`${CLOUD_STORAGE_PREFIX} ${isEnabled ? '启用' : '禁用'}配置成功`);
          ElMessage.success(`${CLOUD_STORAGE_PREFIX} ${isEnabled ? '启用' : '禁用'}配置成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} ${isEnabled ? '启用' : '禁用'}配置失败:`, response.message);
        throw new Error(response.message || `${isEnabled ? '启用' : '禁用'}配置失败`);
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} ${isEnabled ? '启用' : '禁用'}配置错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} ${isEnabled ? '启用' : '禁用'}配置失败: ${error.message || '未知错误'}`);
        throw error;
      }
    },
    
    // 测试配置连接
    async testConnection(configData) {
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始测试配置连接`);
        const response = await cloudStorageApi.testConnection(configData);
        
        if (response.code == 200 && response.data) {
          const message = response.data.message || '连接测试成功';
          console.log(`${CLOUD_STORAGE_PREFIX} 连接测试成功`);
          ElMessage.success(`${CLOUD_STORAGE_PREFIX} ${message}`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 连接测试失败:`, response.message);
        throw new Error(response.message || '连接测试失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 连接测试错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 连接测试失败: ${error.message || '未知错误'}`);
        throw error;
      }
    },
    
    // 获取上传凭证
    async getUploadToken(params) {
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始获取上传凭证`);
        const response = await cloudStorageApi.getUploadToken(params);
        
        if (response.code == 200 && response.data) {
          console.log(`${CLOUD_STORAGE_PREFIX} 获取上传凭证成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 获取上传凭证失败:`, response.message);
        throw new Error(response.message || '获取上传凭证失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 获取上传凭证错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 获取上传凭证失败: ${error.message || '未知错误'}`);
        throw error;
      }
    },
    
    // 获取文件URL
    async getFileUrl(params) {
      try {
        console.log(`${CLOUD_STORAGE_PREFIX} 开始获取文件URL`);
        const response = await cloudStorageApi.getFileUrl(params);
        
        if (response.code == 200 && response.data) {
          console.log(`${CLOUD_STORAGE_PREFIX} 获取文件URL成功`);
          return response.data;
        }
        
        console.log(`${CLOUD_STORAGE_PREFIX} 获取文件URL失败:`, response.message);
        throw new Error(response.message || '获取文件URL失败');
      } catch (error) {
        console.error(`${CLOUD_STORAGE_PREFIX} 获取文件URL错误:`, error);
        ElMessage.error(`${CLOUD_STORAGE_PREFIX} 获取文件URL失败: ${error.message || '未知错误'}`);
        throw error;
      }
    }
  }
}); 