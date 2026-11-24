<template>
  <div v-if="hasTreeHoles" class="process-wrap">
    <el-collapse accordion value="1">
      <el-collapse-item title="最新进展" name="1">
        <process :treeHoleList="treeHoleList" @deleteTreeHole="handleDeleteTreeHole"></process>
      </el-collapse-item>
    </el-collapse>
    <hr>
  </div>
</template>

<script setup>
import process from "../common/process.vue";
import { inject, computed } from 'vue';

// 注入依赖
const $common = inject('$common');

// Props
const props = defineProps({
  treeHoleList: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['deleteTreeHole']);

// Computed
const hasTreeHoles = computed(() => !$common.isEmpty(props.treeHoleList));

// Methods
function handleDeleteTreeHole(id) {
  emit('deleteTreeHole', id);
}
</script>

<style scoped>
.process-wrap {
  margin: 0 0 40px;
}

.process-wrap hr {
  position: relative;
  margin: 10px auto 60px;
  border: 2px dashed var(--lightGreen);
  overflow: visible;
}

.process-wrap hr:before {
  position: absolute;
  top: -14px;
  left: 5%;
  color: var(--lightGreen);
  content: '❄';
  font-size: 30px;
  line-height: 1;
  transition: all 1s ease-in-out;
}

.process-wrap hr:hover:before {
  left: calc(95% - 20px);
}

.process-wrap :deep(.el-collapse-item__header) {
  border-bottom: unset;
  font-size: 20px;
  background-color: var(--background);
  color: var(--lightGreen);
}

.process-wrap :deep(.el-collapse-item__wrap) {
  background-color: var(--background);
}

.process-wrap .el-collapse {
  border-top: unset;
  border-bottom: unset;
}

.process-wrap :deep(.el-collapse-item__wrap) {
  border-bottom: unset;
}
</style> 