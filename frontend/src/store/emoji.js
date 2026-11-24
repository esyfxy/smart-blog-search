import { defineStore } from 'pinia'

export const useEmojiStore = defineStore('emoji', {
  state: () => ({
    emojiList: []
  }),
  
  getters: {
    getEmojiList: (state) => state.emojiList
  },
  
  actions: {
    // 初始化表情数据
    initEmoji(defaultEmoji) {
      // 从localStorage获取表情数据
      const localEmoji = localStorage.getItem("emoji")
      
      if (localEmoji) {
        // 如果本地存储有数据，使用本地数据
        this.emojiList = JSON.parse(localEmoji)
      } else {
        // 否则使用默认数据
        this.emojiList = defaultEmoji
      }
    },
    
    // 添加新的表情数据
    addEmoji(newEmojis) {
      if (Array.isArray(newEmojis)) {
        // 合并表情数据 根据每一个元素的text去重 newEmojis.text是否存在 存在不合并 不存在合并
        const newEmojisArray = newEmojis.filter(emoji => !this.emojiList.some(e => e.text === emoji.text))
        this.emojiList = [...this.emojiList, ...newEmojisArray]
        localStorage.setItem("emoji", JSON.stringify(this.emojiList))
      }
    },
    
    // 更新表情数据
    updateEmoji(emojiList) {
      this.emojiList = emojiList
      localStorage.setItem("emoji", JSON.stringify(this.emojiList))
    }
  },
  
  persist: {
    storage: localStorage,
    key: 'emoji-storage'
  }
}) 