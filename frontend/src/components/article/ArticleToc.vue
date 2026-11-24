<template>
  <div id="toc" class="toc"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// Props
defineProps({
  articleRef: {
    type: Object,
    required: true
  }
});

// Refs
const tocbotScript = ref(null);
let scrollHandler = null;

// Initialize tocbot
function initTocbot() {
  // Load tocbot script dynamically
  tocbotScript.value = document.createElement('script');
  tocbotScript.value.type = 'text/javascript';
  tocbotScript.value.src = 'https://cos.roginx.ink/www/index/cdn/js/tocbot.min.js';
  document.getElementsByTagName('head')[0].appendChild(tocbotScript.value);

  // Initialize tocbot after script loads
  tocbotScript.value.onload = initializeTocbot;
}

function initializeTocbot() {
  if (!window.tocbot) return;
  
  tocbot.init({
    tocSelector: '#toc',
    contentSelector: '.entry-content',
    headingSelector: 'h1, h2, h3, h4, h5, h6',
    scrollSmooth: true,
    fixedSidebarOffset: 'auto',
    scrollSmoothOffset: -100,
    hasInnerContainers: false
  });
}

// Handle scroll position for TOC visibility
function handleScroll() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const articleLike = document.getElementById('article-like');
  const tocElement = document.querySelector('.toc');
  
  if (!tocElement || !articleLike) return;
  
  updateTocVisibility(tocElement, articleLike, scrollTop);
}

function updateTocVisibility(tocElement, articleLike, scrollTop) {
  const quarterHeight = window.innerHeight / 4;
  
  if (scrollTop < quarterHeight) {
    // Near top of page
    tocElement.style.top = window.innerHeight / 2 + 'px';
    tocElement.style.display = 'unset';
  } else if (scrollTop < (articleLike.offsetTop - window.innerHeight)) {
    // In middle of content
    tocElement.style.top = '100px';
    tocElement.style.display = 'unset';
  } else {
    // Near bottom of page
    tocElement.style.display = 'none';
  }
}

// Cleanup function
function cleanup() {
  // Remove scroll listener
  if (scrollHandler) {
    window.removeEventListener('scroll', handleScroll);
  }
  
  // Destroy tocbot
  if (window.tocbot) {
    window.tocbot.destroy();
  }
  
  // Remove script
  if (tocbotScript.value && tocbotScript.value.parentNode) {
    tocbotScript.value.parentNode.removeChild(tocbotScript.value);
  }
}

// Lifecycle hooks
onMounted(() => {
  initTocbot();
  scrollHandler = window.addEventListener('scroll', handleScroll);
});

onUnmounted(cleanup);
</script>

<style scoped>
/* TOC styles will be loaded from the external CSS */
</style> 