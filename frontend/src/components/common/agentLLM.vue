<template> 
  <div class="agent-chat-container"> 
    <!-- 聊天消息区域 -->
    <div id="chat-container" ref="chatContainer" class="chat-bubble-container">
      <div class="chat-welcome" v-if="messages.length <= 2">
        <div class="chat-welcome-title">智能助手</div>
        <div class="chat-welcome-subtitle">有什么可以帮助您？</div>
      </div>
    </div>
    
    <!-- 快速回复胶囊 -->
    <div class="quick-reply-wrapper">
      <div class="quick-reply-container">
        <div 
          v-for="(reply, index) in quickReplies" 
          :key="index"
          class="quick-reply-capsule"
          @click="handleQuickReply(reply.query)"
        >
          {{ reply.label }}
        </div>
      </div>
    </div>
    
    <!-- 用户输入框 --> 
    <div class="chat-input-box"> 
      <input 
        class="chat-input"
        v-model="inputText" 
        @keyup.enter="handleSubmit"
        placeholder="请输入您的问题..." 
      /> 
      <button @click="handleSubmit" :disabled="isStreaming" class="chat-send-btn">
        <i class="fa" :class="isStreaming ? 'fa-circle-o-notch fa-spin' : 'fa-paper-plane'"></i>
      </button>
    </div> 
  </div> 
</template> 
  
<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "AgentChat",
  setup() {
    const router = useRouter();
    const inputText = ref("");
    const currentLeftSpan = ref(null);
    const isStreaming = ref(false);
    const currentQuestion = ref("");
    
    // 快速回复配置Map - 可动态修改
    const quickReplies = ref([
      { label: "点歌", query: "播放 爱的供养", type: "播放歌曲" },
      { label: "点歌单", query: "播放[歌单] VIP精选歌单", type: "播放歌曲" },
      { label: "搜索", query: "搜索网站内容 前端", type: "播放歌曲" },
      { label: "缓慢滚动", query: "帮我缓慢滚动浏览器浏览页面（所有内容需要30s内滚动完成，完成后失效作废事件），注意用上动画效果", type: "缓慢滚动" }
    
    ]);
    
    // 快速回复查询映射 - 用于匹配用户输入
    const quickReplyMap = new Map([
      ["播放歌曲", "播放 爱的供养"],
      ["缓慢滚动", "帮我以1秒50px滚动滚动条流畅自动浏览页面"]
    ]);
    
    const messages = ref([
      { role: "system", content: `只要执行代码都要使用function:run_js_code,执行tools时仔细检查JavaScript代码` },
      { role: "system", content: `这是本站所有你可以通过读取用户需求进行路由转跳或者新窗口打开路由：默认使用无刷新打开路由使用eval()执行转跳this.$router.push()
      "/?keywords=":【搜索】功能首页，展示博客主页内容,填写keywords可以搜索文章
"/sort":分类页，展示文章分类
"/article?id=number":文章页，浏览详细文章内容 
"/weiYan":微言页，发布或查看短语或心情
"/message":留言板页，用户留言交流
"/friend":友链页，展示友情链接
"/bangumi":番剧页，记录或展示追番内容
"/izone":个人空间页，粉丝专属内容 
"/album":相册页，展示图集照片
"/about":关于页，可以和我的智能体聊天
"/user":用户中心页，管理用户信息
"/letter":私信页，与其他用户通讯
"/calendar":日历页，查看日程或活动
"/favorite":收藏页，展示用户收藏内容
"/love":爱情墙页，记录心动瞬间
"/admin":后台主页，跳转至 /main
"/FlexiSite":后台FlexiSite配置页，灵活配置站点内容
"/main":后台首页，后台系统的主页面
"/webEdit":网站编辑页，编辑站点外观或内容
"/userList":用户列表页，查看所有用户信息
"/postList":文章管理页，管理博客文章
"/postShuoshuo":说说管理页，管理短内容或微言
"/postEdit":文章编辑页，编辑或发布新文章
"/sortList":分类管理页，维护文章分类
"/commentList":评论管理页，管理文章评论
"/treeHoleList":树洞管理页，匿名留言或秘密
"/resourceList":资源列表页，展示或管理资源信息
"/resourcePathList":资源路径页，管理资源路径结构
"/verify":验证页，登录后台时的验证页面
      ` }
    ]);

    // 初始化聊天容器
    onMounted(() => {
      initChatContainer();
    });

    const initChatContainer = () => {
      // 创建聊天容器如果不存在
      if (!document.getElementById("chat-container")) {
        const container = document.createElement("div");
        container.id = "chat-container";
        container.className = "chat-bubble-container";
        document.querySelector(".agent-chat-container")?.appendChild(container);
      }
    };
    
    // 检测是否为模型相关问题
    const isModelQuestion = (question) => {
      const modelKeywords = ['什么模型', '你是谁', '你是什么', '你是谁开发的', '你的名字', '你的身份', 'claude', 'gpt', 'ai模型', '什么ai'];
      const lowerQuestion = question.toLowerCase();
      return modelKeywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()));
    };
    
    // 处理模型相关问题
    const handleModelQuestion = (question) => {
      const answer = `您好，我是claude-3.7-sonnet的AI模型，是Cursor IDE内置的AI助手，致力于提升您的开发效率。你问的是："${question}"`;
      appendAssistantMessage(answer);
      return true;
    };
    
    // 处理快速回复
    const handleQuickReply = (query) => {
      inputText.value = query;
      handleSubmit();
    };
    
    const handleSubmit = () => {
      if (!inputText.value.trim()) {
        window.$message?.error("请输入您的问题");
        return;
      }
      
      const question = inputText.value.trim();
      
      // 检测并处理模型相关问题
      if (isModelQuestion(question)) {
        appendUserMessage(question);
        handleModelQuestion(question);
        inputText.value = "";
        return;
      }
      
      isStreaming.value = true;
      appendUserMessage(question);
      callLLMStream(question);
      inputText.value = "";
    };

    const callLLMStream = async (question) => {
      currentQuestion.value = question;
      try {
        // 发起请求
        const response = await fetch("/agent/llm/predict_stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            input_text: question, 
            messages: messages.value, 
            baseAPIHandler: `{
              "correctSong": {
                "call": "baseAPIhandle.correctSong.handle('left')",
                "arguments": "data",
                "desc": "操作歌曲播放顺序。data可以是(left意思是上一首歌)；(right 意思是下一首歌)；(n意思是第n首歌)。调用例子baseAPIhandle.correctSong.handle(1)"
              },
              "searchSong": {
                "call": "baseAPIhandle.searchSong.handle(data)",
                "arguments": "data",
                "desc": "点歌、搜索歌曲、播放歌曲,参数：data = {key=\"歌曲名\"}。调用：baseAPIhandle.searchSong.handle({key:\"歌曲名\"})"
              },
              "seachSongList": {
                "call": "baseAPIhandle.seachSongList.handle()",
                "arguments": "",
                "desc": "搜索歌单，加载歌单，获取歌单,data = {key=\"歌单名\"},调用：baseAPIhandle.seachSongList.handle({key:\"歌单名\"})"
              }
            }`
          })
        });

        if (!response.ok) {
          console.error("请求失败：", response.status, response.statusText);
          appendAssistantMessage("请求失败，请稍后再试");
          isStreaming.value = false;
          return;
        }

        // 开始流式回答
        startAssistantResponse();

        // 读取流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let leftover = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            finishAssistantResponse();
            break;
          }
          
          const chunkStr = decoder.decode(value, { stream: true });
          leftover += chunkStr;
          
          // 按换行符拆分
          const lines = leftover.split("\n");
          for (let i = 0; i < lines.length - 1; i++) {
            try {
              console.log("解析到一行：", lines[i]);
              const lineData = JSON.parse(lines[i]);
              
              // 处理内容
              if (lineData && lineData.content) {
                appendAssistantStreamContent(lineData.content);
              }
              
              // 处理工具调用
              if (lineData && lineData.tool_calls != null) {
                const toolCall = lineData.tool_calls[0];
                
                // 检测新的工具调用开始（有完整的 id 和 name）
                if(toolCall && toolCall.id && toolCall.id.length > 10 && 
                   toolCall.function && toolCall.function.name === "run_js_code") {
                  window.currentCodeId = toolCall.id;
                  window.currentCode = "";
                } 
                
                // 收集代码片段（arguments 可能是分块的）
                if(toolCall && toolCall.function && toolCall.function.arguments !== undefined) {
                  window.currentCode = (window.currentCode || "") + toolCall.function.arguments;
                }
              }
            } catch (e) {
              console.warn("解析JSON行出错:", e, lines[i]);
            }
          }
          leftover = lines[lines.length - 1];
        }
      } catch (err) {
        console.error("请求异常:", err);
        appendAssistantMessage("请求异常，请检查网络连接");
        isStreaming.value = false;
      }
    };
    
    // 开始助手响应
    const startAssistantResponse = () => {
      currentLeftSpan.value = null;
    };
    
    // 结束助手响应
    const finishAssistantResponse = () => {
      // 更新消息历史
      if (currentLeftSpan.value) {
        messages.value[2] = { role: "system", content: "用户上一次提问：" + currentQuestion.value };
        messages.value[3] = { role: "system", content: "系统上一次回答" + currentLeftSpan.value.textContent };
      }
      
      isStreaming.value = false;
      
      // 流结束时，尝试执行剩余的代码
      if (window.currentCode && window.currentCode.trim()) {
        try {
          // 清理代码字符串，移除可能的空白字符
          const cleanedCode = window.currentCode.trim();
          const parsedCode = JSON.parse(cleanedCode);
          
          if(parsedCode && parsedCode.code) {
            console.log("执行JS代码", parsedCode.code);
            try {
              // 将 router 挂载到 window 上，以便代码可以访问
              window.$router = router;
              
              // 将代码中的 this.$router 替换为 window.$router
              // 将 this.$message 替换为 window.$message
              let processedCode = parsedCode.code
                .replace(/this\.\$router/g, 'window.$router')
                .replace(/this\.\$message/g, 'window.$message');
              
              // 执行代码
              const executeFunction = new Function(processedCode);
              executeFunction();
              
              window.$message?.success("智能体执行了JS代码");
              appendCenterMessage("智能体执行了JS代码：" + (window.currentCodeId || "未知"));
            } catch(execError) {
              console.error("执行JS代码失败:", execError);
              window.$message?.error("执行JS代码失败：" + execError.message);
              appendCenterMessage("执行JS代码失败：" + execError.message);
            }
          }
        } catch(parseError) {
          console.warn("解析代码JSON失败:", parseError, "代码内容:", window.currentCode);
          // 如果解析失败，可能是代码还不完整，不显示错误
        } finally {
          // 清空代码，避免重复执行
          window.currentCode = "";
          window.currentCodeId = null;
        }
      }
      
      // 检查是否需要移除空消息
      if (currentLeftSpan.value && currentLeftSpan.value.textContent.length <= 1) {
        currentLeftSpan.value.remove();
        currentLeftSpan.value = null;
      }
      
      scrollToBottom();
    };
    
    // 添加用户消息
    const appendUserMessage = (message) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = "chat-message user-message";
      
      const contentSpan = document.createElement("div");
      contentSpan.className = "message-content";
      contentSpan.textContent = message;
      
      messageDiv.appendChild(contentSpan);
      document.getElementById("chat-container")?.appendChild(messageDiv);
      scrollToBottom();
    };
    
    // 添加助手消息
    const appendAssistantMessage = (message) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = "chat-message assistant-message";
      
      const contentSpan = document.createElement("div");
      contentSpan.className = "message-content";
      contentSpan.textContent = message;
      
      messageDiv.appendChild(contentSpan);
      document.getElementById("chat-container")?.appendChild(messageDiv);
      scrollToBottom();
    };
    
    // 在中间插入一条消息（保留原始功能）
    const appendCenterMessage = (msg) => {
      const centerDiv = document.createElement("div");
      centerDiv.className = "chat-message center-message";
      
      const contentSpan = document.createElement("div");
      contentSpan.className = "message-content center-content";
      contentSpan.textContent = msg;
      
      centerDiv.appendChild(contentSpan);
      document.getElementById("chat-container")?.appendChild(centerDiv);
      scrollToBottom();
    };
    
    // 流式添加助手消息内容
    const appendAssistantStreamContent = (content) => {
      if (!currentLeftSpan.value) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "chat-message assistant-message";
        
        const contentSpan = document.createElement("div");
        contentSpan.className = "message-content";
        messageDiv.appendChild(contentSpan);
        
        document.getElementById("chat-container")?.appendChild(messageDiv);
        currentLeftSpan.value = contentSpan;
      }
      
      if (currentLeftSpan.value) {
        currentLeftSpan.value.textContent += content;
      }
      scrollToBottom();
    };
    
    // 滚动到底部
    const scrollToBottom = () => {
      const container = document.getElementById("chat-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    return {
      inputText,
      isStreaming,
      messages,
      handleSubmit,
      quickReplies,
      handleQuickReply
    };
  }
});
</script>

<style>
.agent-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--background);
  color: var(--fontColor);
}

.chat-bubble-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.chat-welcome {
  text-align: center;
  margin: auto;
}

.chat-welcome-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chat-welcome-subtitle {
  font-size: 16px;
  color: #888;
}

.chat-input-box {
  display: flex;
  padding: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.chat-input {
  flex: 1;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--fontColor);
  outline: none;
}

.chat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--themeBackground);
  color: white;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.chat-send-btn:hover {
  transform: scale(1.05);
}

.chat-send-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.chat-message {
  margin-bottom: 15px;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

.user-message {
  align-self: flex-end;
  margin-left: auto;
}

.assistant-message {
  align-self: flex-start;
  margin-right: auto;
}

.center-message {
  align-self: center;
  margin: 10px auto;
}

.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  word-break: break-word;
  line-height: 1.5;
}

.user-message .message-content {
  background-color: var(--themeBackground);
  color: white;
  border-bottom-right-radius: 5px;
}

.assistant-message .message-content {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--fontColor);
  border-bottom-left-radius: 5px;
}

.center-content {
  background-color: rgba(255, 193, 7, 0.2);
  color: var(--fontColor);
  text-align: center;
  border-radius: 18px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 快速回复胶囊样式 */
.quick-reply-wrapper {
  padding: 6px 6px;
  background: var(--background);
  position: relative;
  opacity: 0.95;
}

.quick-reply-container {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  padding-left: 2px;
  padding-right: 2px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: var(--themeBackground) transparent;
}

.quick-reply-container::-webkit-scrollbar {
  height: 6px;
}

.quick-reply-container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.quick-reply-container::-webkit-scrollbar-thumb {
  background: var(--themeBackground);
  border-radius: 3px;
  transition: background 0.3s;
  opacity: 0.4;
}

.quick-reply-container::-webkit-scrollbar-thumb:hover {
  opacity: 0.7;
}

.quick-reply-capsule {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  min-width: fit-content;
  background: var(--background);
  border: 1.5px solid var(--borderColor);
  border-radius: 24px;
  color: var(--fontColor);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.quick-reply-capsule::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--themeBackground);
  opacity: 0.1;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.quick-reply-capsule:hover {
  border-color: var(--themeBackground);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.quick-reply-capsule:hover::before {
  opacity: 0.2;
}

.quick-reply-capsule:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.1s;
}

/* 响应式设计 */
@media screen and (max-width: 480px) {
  .quick-reply-wrapper {
    padding: 10px 12px;
  }
  
  .quick-reply-container {
    gap: 8px;
  }
  
  .quick-reply-capsule {
    padding: 8px 14px;
    font-size: 12px;
    border-radius: 20px;
  }
}
</style>