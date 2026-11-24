<template>
  <li>
    <span 
      :level="item.level" 
      :class="{ active: isActive, 'can-toggle': item.children && item.children.length }" 
      @click="scrollToElement(item.id)">
      <i v-if="item.children && item.children.length" class="toggle-icon" @click.stop="toggleChildren">
        {{ isCollapsed ? '+' : '-' }}
      </i>
      {{ item.label }}
    </span>
    <ul v-if="item.children && item.children.length" v-show="!isCollapsed">
      <RecursiveListItem 
        v-for="(child, index) in item.children" 
        :key="index" 
        :item="child" />
    </ul>
  </li>
</template>

<script>
import {navigation} from '../../utils/tools.js'

export default {
  name: 'RecursiveListItem',
  components: {
    RecursiveListItem: () => import("@/components/common/RecursiveListItem.vue")
  },
  props: {
    item: Object
  },
  data() {
    return {
      isActive: false,
      visible: true,
      isCollapsed: false,
      items: []
    }
  },
  methods: {
    scrollToElement(selector) {
      if (!selector) return;
      
      // 移除所有active类
      document.querySelectorAll('.anchor-list span').forEach(el => {
        el.classList.remove('active');
      });
      
      // 设置当前项为active
      this.isActive = true;
      
      // 滚动到目标元素
      const element = document.querySelector(selector);
      if (element) {
        // 添加偏移量，避免被导航栏遮挡
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    },
    toggleChildren(event) {
      this.isCollapsed = !this.isCollapsed;
      event.stopPropagation();
    },
    handleClick(id) {
      navigation(id)
    }
  },
  mounted() {
    // 监听滚动事件，高亮当前可见的标题
    window.addEventListener('scroll', () => {
      if (this.item.id && document.querySelector(this.item.id)) {
        const rect = document.querySelector(this.item.id).getBoundingClientRect();
        this.isActive = (rect.top >= 0 && rect.top <= 200);
      }
    });
    
    // 移除不需要的代码
    // console.log(this.treeData);
    // setTimeout(() => {
    //   this.visible = false
    // }, 1000);
  }
}
</script>

<style>
.toggle-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  margin-right: 5px;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  color: var(--themeBackground);
  border: 1px solid var(--lightGray);
  border-radius: 2px;
}
</style>