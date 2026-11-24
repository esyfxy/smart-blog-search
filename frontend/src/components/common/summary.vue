<template>
	<div class="summary-card" data-table="SUMMARY">
		<div>{{ fitem?.subject?.short_summary || "无简介内容" }}</div>
		<hr />
		<div>{{ fitem?.comment || "无个人点评" }}</div>
	</div>
</template>

<script setup>
import { formatDate } from '../../utils/tools.js'
import { computed } from 'vue'

const props = defineProps({
  fitem: {
    type: Object,
    required: true,
    default: () => ({ subject: {} }) // 提供默认值，确保subject对象存在
  }
})

// time 计算属性，兼容原有逻辑
const time = computed(() => {
  // 兼容 fitem.time 可能不存在的情况
  return props.fitem && props.fitem.time ? formatDate(props.fitem.time) : ''
})

// 保留原有方法
function getEventBus() {
  // 预留
}

function intoAnime() {
  if (props.fitem?.subject?.id) {
    window.open("https://bgm.tv/subject/" + props.fitem.subject.id)
  }
}
</script>

<style scoped>
.summary-card {
  @apply w-[240px] fixed opacity-0 z-[-1] text-[14px] leading-[20px] box-border p-2 shadow-[5px_0px_10px_#00000055] bg-[var(--background)] text-[var(--fontColor)] backdrop-saturate-200 backdrop-blur-[10px] rounded-[10px] text-left transition-all duration-500;
}
.summary-card.show {
  @apply opacity-100 z-[5] transition-all duration-500;
}
.summary-card:hover {
  @apply opacity-100 z-[5] transition-all duration-500 !important;
}
</style>
