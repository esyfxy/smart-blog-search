<template>
    <div>
      <div class="sidebar" :class="{show:visible}">
        <div @click="toggleSidebar" class="over-icon">
          <svg t="1693493948213" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4186">
            <path d="M937.386667 488.106667L772.266667 372.48c-12.8-9.386667-30.293333-6.826667-40.106667 5.546667-3.84 4.693333-5.546667 10.666667-5.546667 17.066666v233.813334c0 22.613333 25.6 36.693333 45.653334 22.613333l165.546666-115.626667c14.08-14.08 14.08-36.693333-0.426666-47.786666zM914.346667 213.333333h-785.066667c-18.773333 0-34.133333-15.36-34.133333-34.133333s15.36-34.133333 34.133333-34.133333h785.066667c18.773333 0 34.133333 15.36 34.133333 34.133333s-14.933333 34.133333-34.133333 34.133333zM624.213333 435.2h-494.933333c-18.773333 0-34.133333-15.36-34.133333-34.133333s15.36-34.133333 34.133333-34.133334h494.933333c18.773333 0 34.133333 15.36 34.133334 34.133334s-14.933333 34.133333-34.133334 34.133333zM624.64 657.066667H129.28c-18.773333 0-34.133333-15.36-34.133333-34.133334s15.36-34.133333 34.133333-34.133333h495.36c18.773333 0 34.133333 15.36 34.133333 34.133333v0.426667c-0.426667 18.346667-15.36 33.706667-34.133333 33.706667z" fill="#4C4C4C" p-id="4187"></path>
          </svg>
        </div>
        <h3>目录</h3>
        <template v-if="treeData && treeData.length">
          <RecursiveListItem :item="treeData[0]" class="anchor-list" />
        </template>
        <div v-else class="empty-toc">暂无目录</div>
      </div>
    </div>
</template>
  
<script>
import { asyncComponent } from '../../utils/common';

import RecursiveListItem from "./RecursiveListItem.vue";;
export default {
  components: {
    RecursiveListItem
  },
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: true,
      items: []
    }
  },
  methods: {
    toggleSidebar() {
      this.visible = !this.visible;
      // 保存状态到本地存储，使得用户偏好能够保持
      localStorage.setItem('toc_sidebar_visible', this.visible);
    }
  },
  mounted() {
    // 从本地存储中恢复侧边栏状态
    const savedState = localStorage.getItem('toc_sidebar_visible');
    if (savedState !== null) {
      this.visible = savedState === 'true';
    } else {
      setTimeout(() => {
        this.visible = false;
      }, 2000);
    }
    
    // 移除滚动监听，避免在滚动时自动显示目录
    // 这样只有当用户点击按钮时才会显示/隐藏目录
    setTimeout(() => {
      this.visible = false;
    }, 2000);
  }
};
</script>
  
  <style>
  .sidebar {
    display: flex;
    flex-direction: column;
    transition: .3s;
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100%;
    background-color: var(--background);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16);
    padding: 1em;
    transform: translateX(-92%);
  }
  .sidebar.show{
    transform: translateX(-0);
  }
  .sidebar h3 {
    text-align: center;
    margin-bottom: 15px;
    color: var(--themeBackground);
    font-size: 1.6em;
    border-bottom: 1px dashed var(--lightGray);
    padding-bottom: 10px;
  }
  .sidebar ul {
    margin: 0;
    width: 100%;
    padding: 0 5px;
    list-style: none;
  }
  .sidebar .anchor-list{
    list-style: none;
    text-align: left;
    overflow-y: auto;
    max-height: calc(100vh - 80px);
    scrollbar-width: thin;
    scrollbar-color: var(--lightGray) transparent;
  }
  .sidebar .anchor-list::-webkit-scrollbar {
    width: 4px;
  }
  .sidebar .anchor-list::-webkit-scrollbar-thumb {
    background-color: var(--lightGray);
    border-radius: 4px;
  }
  .anchor-list span{
    font-family:'Fira Code';
    cursor: pointer;
    font-size: 0.9em;
    line-height: 1.4em;
    display: block;
    color: var(--fontColor);
    text-decoration: none;
    padding: 4px 0;
    transition: all 0.2s ease;
    border-left: 2px solid transparent;
    padding-left: 5px;
  }
  .anchor-list span:hover {
    color: var(--themeBackground);
    border-left: 2px solid var(--themeBackground);
    padding-left: 8px;
  }
  .anchor-list span.active {
    color: var(--themeBackground);
    border-left: 2px solid var(--themeBackground);
    padding-left: 8px;
    font-weight: 500;
  }
  .sidebar .content {
    margin-left: 220px;
    padding: 20px;
  }
  .over-icon{
    position: absolute;
    width: 36px;
    height: 36px;
    top: 64px;
    right: -36px;
    cursor: pointer;
    padding: 5px;
    border-radius: 0 5px 5px 0;
    background: var(--background);
    box-shadow: 3px 0px 5px 0 rgba(0, 0, 0, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  .over-icon:hover {
    background: var(--themeBackground-bg);
  }
  .over-icon:hover svg{
    fill: var(--themeBackground);
  }
  .sidebar span[level="0"]{
    line-height: 1.4em;
    font-size: 1.2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  .sidebar span[level="2"] {
    line-height: 1.2em;
    font-size: 1em;
    font-weight: 600;
  }
  .sidebar span[level="3"] {
    line-height: 1.2em;
    font-size: 1em;
    font-weight: 500;
  }
  .sidebar span[level="4"] {
    line-height: 1.2em;
    font-size: .9em;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sidebar span[level="4"]:hover{
    color: var(--themeBackground);
    border-left: 2px solid var(--themeBackground);
    padding-left: 8px;
  }
  
  /* 添加展开/收缩相关样式 */
  .sidebar span.can-toggle {
    position: relative;
    cursor: pointer;
  }
  
  .sidebar ul {
    transition: max-height 0.3s ease;
  }
  
  @media screen and (max-width: 500px) {
    .sidebar{
      width: 75% !important;
      transform: translateX(-100%);
    }
  }
  </style>