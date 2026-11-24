<template>
    <div>
    <div class="flex-container">
      <!-- Left Panel: Key List -->
      <div class="left-panel">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索键名"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        
        <div class="key-list">
          <el-scrollbar height="calc(100vh - 270px)">
            <div
              v-for="(item, index) in filteredKeys"
              :key="index"
              class="key-item"
              :class="{ 'active': currentIndex === index }"
              @click="selectKey(index)"
            >
              <div class="key-name">{{ item.name || '未命名' }}</div>
              <div class="key-id">ID: {{ item.id }}</div>
            </div>
            <el-empty v-if="filteredKeys.length === 0" description="暂无数据" />
          </el-scrollbar>
          
          <!-- 分页组件 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              background
              small
            />
          </div>
        </div>
        
        <div class="button-group">
          <el-button type="primary" @click="Save">保存</el-button>
          <el-button type="success" @click="createNew">新建</el-button>
          <el-button type="danger" @click="deleteItem" v-if="jsonDatas.length > 0">删除</el-button>
        </div>
      </div>
      
      <!-- Right Panel: JSON Editor Visualization -->
      <div class="right-panel">
        <div ref="jsonEditorContainer" class="json-editor"></div>
      </div>
    </div>
    
    <!-- JSON Editor Dialog -->
    <el-dialog v-model="editorVisible" title="JSON Editor" width="80%">
      <div v-for="(value, key) in editedJson" :key="key" class="edit-item">
        <div class="key-label">{{key}}</div>
          <el-input
              v-model="editedJson[key]"
              placeholder="Value"
          class="value-input"
          ></el-input>  
        <flexi-json v-if="indexKey===key" v-model:modelValue="editedJson[key]"></flexi-json>
         
        <el-button type="primary" @click="(indexKey==key)?indexKey='':indexKey=key">
          <el-icon><EditPen /></el-icon>
        </el-button>
        <el-button type="danger" @click="removeKeyValuePair(key)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="addKeyValuePair">添加键值对</el-button>
        <el-button type="primary" @click="addArrayItem">添加对象</el-button>
        <el-button type="primary" @click="saveChanges">保存修改</el-button>
        <el-button @click="closeEditor">关闭</el-button>
      </div>
    </el-dialog>
    </div>
  </template>
  
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { EditPen, Delete, ArrowLeft, ArrowRight, Search, Plus } from '@element-plus/icons-vue';
import api from '../../utils/api';
import flexiJson from "./common/flexiJSON.vue";
// Import the JSON Editor package
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

// 注入依赖
const http = inject('$http');

// 路由
const route = useRoute();

// DOM引用
const jsonEditorContainer = ref(null);

// 响应式状态
const jsonDatas = ref([]);
const jsonData = ref('{"type": "value1","key": "","value": ""}');
const searchQuery = ref('');
const filteredKeys = ref([]);
const editorVisible = ref(false);
const editedJson = reactive({});
const indexKey = ref("");
const jsonEditor = ref(null);
const currentIndex = ref(0);
const jsonDatasTotal = computed(() => jsonDatas.value?.length || 0);

// 分页相关
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

// 监听jsonData变化
watch(jsonData, (newValue, oldValue) => {
  if (oldValue !== undefined) {
    try {
      Object.assign(editedJson, JSON.parse(newValue));
    } catch (error) {
      console.error('Invalid JSON data', error);
    }
  }
}, { immediate: true });

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted, route query:', route.query);
  nextTick(() => {
    initEditor();
  });

  fetchInitialData();
});

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  console.log('Route query changed:', newQuery);
  fetchInitialData();
}, { deep: true });

// 清理资源
onBeforeUnmount(() => {
  if (jsonEditor.value) {
    jsonEditor.value.destroy();
  }
});

// 方法
const fetchInitialData = async () => {
  try {
    console.log('Fetching data with query:', route.query);
    
    // 构建查询参数
    const queryParams = {
      ...route.query,
      page: pagination.page,
      pageSize: pagination.pageSize,
      // 如果有搜索关键字，添加到查询参数中
      ...(searchQuery.value ? { keyword: searchQuery.value } : {})
    };
    
    // 使用getList API获取键值对列表
    const res = await api.kv.getList(queryParams);
    console.log('API response:', res);
    
    if (res?.code === 200) {
      // 正确读取data.pageData和data.total
      if (res.data && Array.isArray(res.data.pageData)) {
        // 更新数据列表
        jsonDatas.value = res.data.pageData;
        
        // 更新分页信息
        pagination.total = res.data.total || 0;
        
        console.log('Data loaded, pageData:', jsonDatas.value);
        console.log('Total count:', pagination.total);
        
        // 更新过滤后的键列表
        if (jsonDatas.value.length > 0) {
          filteredKeys.value = jsonDatas.value.map(item => ({
            id: item.id || '',
            name: item.name || item.type || item.key || '未命名'
          }));
          
          // 如果当前索引超出范围，重置为0
          if (currentIndex.value >= jsonDatas.value.length) {
            currentIndex.value = 0;
          }
          
          // 选择当前项
          if (jsonDatas.value.length > 0) {
            selectKey(currentIndex.value);
          }
        } else {
          filteredKeys.value = [];
          // 清空编辑器
          jsonData.value = '{}';
          if (jsonEditor.value) {
            jsonEditor.value.setText(jsonData.value);
          }
          ElMessage.info("未找到匹配的数据");
        }
      } else {
        console.error("API返回的数据结构不正确:", res);
        ElMessage.error("API返回的数据结构不正确");
        filteredKeys.value = [];
        jsonDatas.value = [];
      }
    } else {
      ElMessage.error(res?.message || "获取数据失败");
      filteredKeys.value = [];
      jsonDatas.value = [];
    }
  } catch (error) {
    console.error("获取初始数据错误:", error);
    ElMessage.error("获取数据失败: " + (error.message || "未知错误"));
    filteredKeys.value = [];
    jsonDatas.value = [];
  }
};

const initEditor = () => {
  if (!jsonEditorContainer.value) {
    console.error('JSONEditor DOM element not found');
    return;
  }
  
  try {
    // 创建编辑器实例
    const options = {
      mode: 'tree',
      modes: ['code', 'form', 'text', 'tree', 'view'], // 允许的模式
      onError: function(err) {
        ElMessage.error(err.toString());
      },
      onChange: function() {
        try {
          jsonData.value = jsonEditor.value.getText();
        } catch (err) {
          console.error('Error getting text from editor', err);
        }
      }
    };
    
    jsonEditor.value = new JSONEditor(jsonEditorContainer.value, options);
    
    try {
      jsonEditor.value.setText(jsonData.value);
      
      // 验证数据是否有效
      const errors = jsonEditor.value.validate();
      if (errors.length) {
        ElMessage.error(errors[0].message);
      }
    } catch (error) {
      console.error('Error setting initial JSON', error);
      ElMessage.error('初始化JSON数据失败');
    }
  } catch (error) {
    console.error('Error initializing editor:', error);
    ElMessage.error('初始化编辑器失败');
  }
};

// 过滤键列表
const filterKeys = () => {
  // 重置分页到第一页
  pagination.page = 1;
  // 调用API获取数据
  fetchInitialData();
};

// 选择键
const selectKey = async (index) => {
  if (index < 0 || index >= jsonDatas.value.length) {
    return;
  }
  
  currentIndex.value = index;
  const selectedItem = jsonDatas.value[index];
  
  try {
    console.log('Selected key at index:', index, 'with ID:', selectedItem.id);
    
    // 通过API获取详细数据
    const res = await api.kv.getValue({ id: selectedItem.id });
    console.log('Detailed data response:', res);
    
    if (res?.code === 200) {
      // 正确读取data字段
      const detailData = res.data;
      
      if (detailData) {
        console.log('Detail data:', detailData);
        
        // 将数据转换为JSON字符串并设置到编辑器
        jsonData.value = JSON.stringify(detailData, null, 2);
        if (jsonEditor.value) {
          jsonEditor.value.setText(jsonData.value);
        }
      } else {
        ElMessage.warning("获取的详细数据为空");
        // 使用列表中的数据作为备用
        jsonData.value = JSON.stringify(selectedItem, null, 2);
        if (jsonEditor.value) {
          jsonEditor.value.setText(jsonData.value);
        }
      }
    } else {
      ElMessage.warning("获取详细数据失败，使用列表数据");
      // 使用列表中的数据作为备用
      jsonData.value = JSON.stringify(selectedItem, null, 2);
      if (jsonEditor.value) {
        jsonEditor.value.setText(jsonData.value);
      }
    }
  } catch (error) {
    console.error("获取详细数据错误:", error);
    ElMessage.error("获取详细数据失败: " + (error.message || "未知错误"));
    // 使用列表中的数据作为备用
    jsonData.value = JSON.stringify(selectedItem, null, 2);
    if (jsonEditor.value) {
      jsonEditor.value.setText(jsonData.value);
    }
  }
};

// 创建新键值对
const createNew = () => {
  const newJson = {
    type: "config",
    name: "新配置",
    key: "",
    value: {}
  };
  
  // 清除当前选择
  currentIndex.value = -1;
  
  // 更新编辑器内容
  jsonData.value = JSON.stringify(newJson, null, 2);
  if (jsonEditor.value) {
    jsonEditor.value.setText(jsonData.value);
  }
  
  ElMessage.success("已创建新配置，请编辑后保存");
};

const Save = async () => {
  try {
    let parsedData;
    try {
      parsedData = JSON.parse(jsonData.value);
    } catch (e) {
      // 如果JSON解析失败，尝试从编辑器获取
      if (jsonEditor.value) {
        parsedData = jsonEditor.value.get();
      } else {
        throw e;
      }
    }
    
    // 过滤 createdAt 和 updatedAt 过滤空值
    parsedData = Object.fromEntries(
      Object.entries(parsedData).filter(([key, value]) => value !== null && value !== undefined && key !== 'createdAt' && key !== 'updatedAt')
    );
    
    console.log('Saving data:', parsedData);
    const res = await api.kv.setValue(parsedData);
    console.log('Save response:', res);
    
    if (res?.code === 200) {
      ElMessage.success("保存成功");
      // 刷新数据
      fetchInitialData();
    } else {
      ElMessage.error(res?.message || "保存失败");
    }
  } catch (error) {
    console.error("保存错误:", error);
    ElMessage.error("保存失败: " + (error.message || "未知错误"));
  }
};

const deleteItem = async () => {
  if (!jsonDatas.value || jsonDatas.value.length === 0 || currentIndex.value < 0 || currentIndex.value >= jsonDatas.value.length) {
    ElMessage.warning("没有可删除的数据");
    return;
  }
  
  try {
    const currentItem = jsonDatas.value[currentIndex.value];
    
    // 确认删除
    await ElMessageBox.confirm(
      `确定要删除 "${currentItem.name || currentItem.key || currentItem.type || '未知'}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    console.log('Deleting item with ID:', currentItem.id);
    const res = await api.kv.deleteValue({ id: currentItem.id });
    console.log('Delete response:', res);
    
    if (res?.code === 200) {
      ElMessage.success("删除成功");
      // 刷新数据
      fetchInitialData();
    } else {
      ElMessage.error(res?.message || "删除失败");
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error("删除错误:", error);
      ElMessage.error("删除失败: " + (error.message || "未知错误"));
    }
  }
};

const parseObject = (obj) => {
  if (!obj) return {};
  
  const result = { ...obj };
  for (let key in result) {
    if (typeof result[key] === 'string') {
      try {
        const parsed = JSON.parse(result[key]);
        result[key] = parsed;
      } catch (error) {
        // 如果解析失败，保持属性值不变
      }
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = parseObject(result[key]);
    }
  }
  return result;
};

const openEditor = () => {
  try {
    Object.assign(editedJson, JSON.parse(jsonData.value));
    editorVisible.value = true;
  } catch (error) {
    console.error('Invalid JSON data');
    ElMessage.error('无效的JSON数据');
  }
};

const addKeyValuePair = () => {
  const newKey = `key${Object.keys(editedJson).length + 1}`;
  const newValue = `value${Object.keys(editedJson).length + 1}`;
  editedJson[newKey] = newValue;
};

const addArrayItem = () => {
  const newKey = `key${Object.keys(editedJson).length + 1}`;
  editedJson[newKey] = [];
};

const removeKeyValuePair = (key) => {
  delete editedJson[key];
};

const saveChanges = () => {
  try {
    jsonData.value = JSON.stringify(editedJson, null, 2);
    editorVisible.value = false;
    if (jsonEditor.value) {
      jsonEditor.value.setText(jsonData.value);
    }
  } catch (error) {
    console.error("保存修改错误:", error);
    ElMessage.error("保存修改失败");
  }
};

const closeEditor = () => {
  editorVisible.value = false;
};

const handleSearch = () => {
  filterKeys();
};

const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize;
  fetchInitialData();
};

const handleCurrentChange = (newPage) => {
  pagination.page = newPage;
  fetchInitialData();
};
</script>

<style scoped>
.flex-container {
  display: flex;
  height: calc(100vh - 120px);
  padding: 20px;
  gap: 20px;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 280px;
  border-right: 1px solid #e6e6e6;
  padding-right: 15px;
}

.right-panel {
  flex: 4;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.search-box {
  margin-bottom: 15px;
}

.key-list {
  flex: 1;
  overflow: hidden;
}

.key-item {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #e6e6e6;
  transition: all 0.3s;
}

.key-item:hover {
  background-color: #f5f7fa;
}

.key-item.active {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.key-name {
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.key-id {
  font-size: 12px;
  color: #909399;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.json-editor {
  height: 100%;
  width: 100%;
  min-height: 400px;
}

.edit-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.key-label {
  width: 100px;
  margin-right: 10px;
  word-break: break-all;
  overflow: hidden;
}

.value-input {
  width: 60%;
  margin-right: 10px;
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>