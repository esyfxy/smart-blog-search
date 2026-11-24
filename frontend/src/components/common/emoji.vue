<template>
  <div>
    <transition name="el-fade-in-linear">
      <div :class="{'show':showEmoji}" class="emoji-container">
        <div class="emoji-list-container">
          <span class="emoji-item"
              v-for="(item, index) in emojiData"
              :key="item.url"
              @click="emojiIndex = index">
            <img class="emoji" :src="item.url" :title="item.text" width="36px" height="36px"/>
          </span>
        </div>
        <div class="emoji-item-container">
          <span class="emoji-item"
                v-for="(item, index) in currentEmotes"
                :key="currentCategory + index"
                @click="addEmoji(item.text)">
            <div v-if="item.url.indexOf('http') === -1" class="emoji">{{item.text}}</div>
            <img v-else class="emoji" :src="item.url" :title="item.text" width="36px" height="36px"/>
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEmojiStore } from '../../store/emoji'

const props = defineProps({
  showEmoji: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['addEmoji'])

// 使用pinia store
const emojiStore = useEmojiStore()
const emojiIndex = ref(0)
const emojiData = computed(() => emojiStore.getEmojiList)

// 计算当前选中的表情类别
const currentCategory = computed(() => emojiData.value[emojiIndex.value]?.text || '')
const currentEmotes = computed(() => emojiData.value[emojiIndex.value]?.emote || [])

// 添加表情的方法
const addEmoji = (text) => {
  emit('addEmoji', text)
}
</script>

<style scoped>
  .emoji-container{
    user-select: none;
    width: 100%;
    max-height: 0;
    display: block;
    overflow: hidden;
    opacity: 0;
    transition: .3s;
    background: var(--background);
    box-shadow: 1px 1px 5px var(--themeBackground);
  }
  .emoji-container.show {
    height: unset;
    max-height: 380px;
    opacity: 1;
  }
  .emoji-item-container{
    width: 100%;
    max-height: 160px;
    overflow-y: scroll;
  }
  .emoji-item {
    cursor: pointer;
    display: inline-block;
  }
  .emoji-list-container{
    background: var(--maxLightGray);
  }
  .emoji-item:hover {
    transition: all 0.2s;
    border-radius: 0.25rem;
    background: var(--lightGray);
  }
  .emoji {
    margin: 0.25rem;
    /* 把此元素放置在父元素的中部 */
    vertical-align: middle;
  }
  div.emoji{
    font-size: 16px;
    font-weight: 100;
    margin: 8px;
  }
  .body-enter-active, .body-leave-active {
    transition: all 0.3s;
  }

  .body-enter, .body-leave-to {
    opacity: 0;
  }
</style>
