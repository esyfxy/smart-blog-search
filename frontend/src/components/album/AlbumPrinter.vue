<template>
  <div>
    <slot name="paper" :content="content"></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  printerInfo: {
    type: String,
    default: ""
  },
  duration: {
    type: Number,
    default: 100
  },
  delay: {
    type: Number,
    default: 3000
  },
  working: {
    type: Boolean,
    default: true
  },
  once: {
    type: Boolean,
    default: false
  }
});

const content = ref("");
const cursor = ref(0);
const timer = ref(null);
const timeout = ref(null);
const print = ref(true);

// 监听属性变化
watch(() => props.working, () => {
  toBegin();
});

watch(() => props.printerInfo, () => {
  toBegin();
});

watch(cursor, (newCursor) => {
  content.value = props.printerInfo.slice(0, newCursor);
});

// 生命周期钩子
onMounted(() => {
  if (props.working) {
    start(work);
  } else {
    content.value = props.printerInfo;
  }
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
  clearTimeout(timeout.value);
});

// 方法
function start(work) {
  // 延迟
  timeout.value = setTimeout(() => {
    // 速度
    timer.value = setInterval(() => {
      work();
      if (cursor.value === 0 || (cursor.value === props.printerInfo.length && !props.once)) {
        // 此处为了延迟
        clearInterval(timer.value);
        start(work);
      } else if (cursor.value === props.printerInfo.length && props.once) {
        clearInterval(timer.value);
      }
    }, props.duration);
  }, props.delay);
}

function work() {
  let currentCursor = cursor.value;
  currentCursor += print.value ? 1 : -1;
  
  if (print.value) {
    if (currentCursor === props.printerInfo.length + 1) {
      currentCursor -= 2;
      print.value = !print.value;
    }
  } else {
    if (currentCursor === -1) {
      currentCursor += 2;
      print.value = !print.value;
    }
  }
  
  cursor.value = currentCursor;
}

function toBegin() {
  cursor.value = 0;
  
  if (timeout.value !== null) {
    clearTimeout(timeout.value);
    if (timer.value !== null) {
      clearInterval(timer.value);
    }
  }
  
  if (props.working) {
    start(work);
  } else {
    content.value = props.printerInfo;
  }
}
</script> 