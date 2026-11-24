<template>
  <div class="article-container my-animation-slide-bottom">
    <!-- 文章内容 -->
    <div v-html="articleContentHtml" class="entry-content" ref="contentRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, inject } from 'vue';
import MarkdownIt from 'markdown-it';
import MarkdownItAttrs from 'markdown-it-attrs';

// 注入依赖
const $common = inject('$common');

// Props
const props = defineProps({
  articleContent: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['contentRendered']);

// Refs
const contentRef = ref(null);
const articleContentHtml = ref('');
let dynamicGallery = null;

// Convert markdown to HTML
function renderMarkdown() {
  const md = new MarkdownIt({
    breaks: true,
    html: true,
    linkify: true,
    typographer: true
  }).use(MarkdownItAttrs);
  
  articleContentHtml.value = md.render(props.articleContent);
}

// Apply code highlighting
function highlight() {
  if (!contentRef.value) return;

  const attributes = {
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: "false",
    contenteditable: "false"
  };

  applyCodeHighlighting(attributes);
  addCopyButtons();
  wrapTables();
}

function applyCodeHighlighting(attributes) {
  const preTags = $(contentRef.value).find("pre");
  
  preTags.each(function (i, item) {
    const preCode = $(item).children("code");
    const classNameStr = preCode[0].className;
    const classNameArr = classNameStr.split(" ");
    
    // Detect language
    let lang = detectLanguage(classNameArr);
    
    // Apply highlighting
    $(item).addClass("highlight-wrap").attr(attributes);
    preCode.attr("data-rel", lang.toUpperCase()).addClass(lang.toLowerCase());
    hljs.highlightBlock(preCode[0]);
    hljs.lineNumbersBlock(preCode[0]);
  });
}

function detectLanguage(classNameArr) {
  // Find language class
  let lang = "";
  classNameArr.some(function (className) {
    if (className.indexOf("language-") > -1) {
      lang = className.substring(className.indexOf("-") + 1, className.length);
      return true;
    }
  });

  // Auto-detect if needed
  const language = hljs.getLanguage(lang.toLowerCase());
  if (language === undefined) {
    return autoDetectLanguage(lang);
  }
  
  return language.name;
}

function autoDetectLanguage(currentLang) {
  const preCode = $(contentRef.value).find("pre code");
  const autoLanguage = hljs.highlightAuto(preCode.text());
  
  preCode.removeClass("language-" + currentLang);
  let lang = autoLanguage.language;
  
  if (lang === undefined) {
    lang = "java";
  }
  
  preCode.addClass("language-" + lang);
  return lang;
}

function addCopyButtons() {
  $(contentRef.value).find("pre code").each(function (i, block) {
    const id = "hljs-" + i;
    $(block).attr({ id });
    
    const copyButton = `<a class="copy-code" href="javascript:" data-clipboard-target="#${id}">
      <i class="fa fa-clipboard" aria-hidden="true"></i>
    </a>`;
    
    $(block).after(copyButton);
  });
  
  new ClipboardJS(".copy-code");
}

function wrapTables() {
  if ($(contentRef.value).children("table").length > 0) {
    $(contentRef.value).children("table").wrap("<div class='table-wrapper'></div>");
  }
}

// Process images for lightbox gallery
function setupImageGallery() {
  if (!contentRef.value) return;
  
  const images = $(contentRef.value).find("img").toArray();
  if (images.length === 0) return;
  
  // Clean up previous gallery if exists
  if (dynamicGallery) {
    dynamicGallery.destroy();
  }
  
  // Set up lightGallery
  dynamicGallery = createGallery(images);
  
  // Add click handlers to images
  images.forEach((element, index) => {
    element.onclick = () => dynamicGallery.openGallery(index);
  });
}

function createGallery(images) {
  return lightGallery(document.createElement("div"), {
    mobileSettings: { 
      controls: false, 
      showCloseIcon: true,
      download: false, 
    },
    dynamic: true,
    thumbnail: true,
    controls: false, 
    plugins: [lgZoom, lgThumbnail, lgRotate, lgAutoplay, lgFullscreen, lgVideo],
    dynamicEl: images.map(prepareImageForGallery)
  });
}

function prepareImageForGallery(img) {
  // Add alt as attribute to parent for styling
  if (img.parentNode) {
    img.parentNode.setAttribute("alt", img.alt);
  }
  
  return {
    src: img.src,
    thumb: img.thumb ? img.thumb : img.src,
    subHtml: `<h4>${img.alt}</h4>`,
  };
}

// Handle anchors in the article
function processAnchors() {
  if (!contentRef.value) return;
  
  $(contentRef.value).find("a").toArray().forEach(processAnchor);
}

function processAnchor(item) {
  const anchor = item.href;
  
  if (anchor.indexOf("#SECTION") !== -1) {
    // Internal anchor
    item.onclick = () => {
      window.navigation(anchor.substring(anchor.indexOf("#SECTION"), anchor.length));
    };
    item.href = "javascript:void(0);";
  } else {
    // External link
    item.target = "_blank";
  }
}

// Initialize content
async function initContent() {
  renderMarkdown();
  await nextTick();
  
  // Wait a bit to ensure DOM is fully updated
  setTimeout(() => {
    highlight();
    setupImageGallery();
    processAnchors();
    
    // Emit event that content is rendered
    emit('contentRendered');
  }, 100);
}

// Watch for content changes
watch(() => props.articleContent, initContent);

// Initialize on mount
onMounted(initContent);
</script>

<style scoped>
.article-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 14px;
}

:deep(.entry-content) img {
  cursor: zoom-in;
  margin: auto;
  display: block;
}

:deep(.entry-content) p:has(> img[alt]:only-child) {
  position: relative;
}

:deep(.entry-content) p:has(> img[alt]:only-child)::after {
  content: attr(alt);
  color: var(--articleGreyFontColor);
  font-size: 14px;
  text-align: center;
  line-height: 14px;
  white-space: nowrap;
  display: block;
  margin-top: 10px;
}

:deep(.entry-content) p:has(> iframe:only-child),
:deep(.entry-content) p:has(> video:only-child) {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

:deep(.entry-content) p:has(> iframe:only-child) iframe,
:deep(.entry-content) p:has(> video:only-child) video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: none;
  height: 100%;
}

:deep(.entry-content) iframe {
  width: 100%;
  display: block;
  margin: auto;
}
</style> 