<template>
  <div>
    <el-input
      type="textarea"
      :rows="6"
      placeholder="输入JSON数据"
      v-model="localJsonData"
    ></el-input>  
    <el-button type="primary" @click="openEditor" class="mt-2">编辑</el-button>
    <el-dialog v-model="editorVisible" title="JSON编辑器" width="80%" destroy-on-close>
      <div v-for="(value, key) in editedJson" :key="key" class="mb-3">
        <div class="inline-block w-16">{{key}}</div>
        <template v-if="Array.isArray(value)">
          <div v-for="(item, index) in value" :key="index" class="flex items-center mt-2">
            <el-input
              v-model="editedJson[key][index]"
              placeholder="值"
              class="w-2/5"
            ></el-input>  
            <el-button type="danger" @click="removeArrayItem(key, index)" class="ml-2">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button type="primary" @click="addArrayItem(key)" class="mt-2">添加项目</el-button>
        </template>
        <template v-else>
          <el-input
            v-model="editedJson[key]"
            placeholder="值"
            class="w-2/5"
          ></el-input> 
          <el-button type="danger" @click="removeKeyValuePair(key)" class="ml-2">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </div>
      <div class="flex gap-3 mt-4">
        <el-button type="primary" @click="addKeyValuePair">添加键值对</el-button>
        <el-button type="primary" @click="saveChanges">保存修改</el-button>
        <el-button @click="closeEditor">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// 定义props
const props = defineProps({
  modelValue: {
    type: String,
    default: '{}'
  }
});

// 定义emit
const emit = defineEmits(['update:modelValue']);

// 响应式状态
const localJsonData = ref(props.modelValue);
const editorVisible = ref(false);
const editedJson = reactive({});

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  localJsonData.value = newValue;
}, { immediate: true });

// 监听本地数据变化，并向父组件发送更新
watch(localJsonData, (newValue) => {
  emit('update:modelValue', newValue);
});

// 方法
const isObject = (value) => {
  return typeof value === 'object' && value !== null;
};

const openEditor = () => {
  try {
    Object.assign(editedJson, JSON.parse(localJsonData.value));
    editorVisible.value = true;
  } catch (error) {
    console.error('Invalid JSON data', error);
    ElMessage.error('无效的JSON数据');
  }
};

const addKeyValuePair = () => {
  const newKey = `key${Object.keys(editedJson).length + 1}`;
  const newValue = `value${Object.keys(editedJson).length + 1}`;
  editedJson[newKey] = newValue;
};

const addArrayItem = (key) => {
  if (Array.isArray(editedJson[key])) {
    editedJson[key].push('');
  } else {
    editedJson[key] = [''];
  }
};

const removeKeyValuePair = (key) => {
  delete editedJson[key];
};

const removeArrayItem = (key, index) => {
  editedJson[key].splice(index, 1);
};

const saveChanges = () => {
  try {
    // 处理数组
    const processedJson = { ...editedJson };
    Object.keys(processedJson).forEach(key => {
      if (Array.isArray(processedJson[key])) {
        // 保留数组类型，不转换为字符串
        // 只处理空字符串或无效值
        processedJson[key] = processedJson[key].map(item => 
          item === '' ? null : item
        );
      }
    });

    localJsonData.value = JSON.stringify(processedJson, null, 2);
    editorVisible.value = false;
  } catch (error) {
    console.error('Error saving changes', error);
    ElMessage.error('保存修改时出错');
  }
};

const closeEditor = () => {
  editorVisible.value = false;
};
</script>