<template> 
  <div class="home-chat-container"> 
    <!-- 用户输入框 --> 
    <div class="home-chat-box"> 
      <input 
        class="home-chat-input"
        v-model="inputText" 
        @keyup.enter="handleSubmit"  
        placeholder="请输入你要执行的命令..." 
      /> 
      <button @click="handleSubmit" :disabled="isStreaming">{{ !isStreaming? '🔍' :'' }}</button>
    </div> 
    <div class="home-chart-mask"></div>
    <!-- 气泡容器 --> 
    <div id="chat-container" ref="chatContainer" class="chat-bubble-container" :style="{ height: `${messages.length <= 2? 100:400}px` }"> 
      <div class="sayllm-center my-animation-slide-bottom" v-if="messages.length <= 2"> 
        <span class="sayllm-item-center">请输入内容....</span>
      </div>
    </div> 
 
  </div> 
</template> 
  
<script>
export default {
  name: "HomeChat",
  data() {
    return {
      inputText: "",
      currentLeftSpan: null, // 用于流式回答时的临时节点
      // 存储当前正在被拼接的JS代码和它的ID（若存在）
      isStreaming: false,
      currentQuestion: "",
      messages:[
      { role: "system", content: `只要执行代码都要使用function:run_js_code,执行tools时仔细检查JavaScript代码`  },
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
      ` },
    ]
    };
  },
  computed: {
    textContent() {
      return this.$refs.chatContainer?.textContent;
    },
  },
  methods: {
    handleSubmit() {
      if (!this.inputText.trim()) {
        this.$message.error("内容不能为空");
        return;
      }
      this.isStreaming = true;
      this.appendRightMessage(this.inputText);
      this.callLLMStream(this.inputText);
      this.inputText = "";
    },

    /**
     * 调用大模型的流式接口示例
     * 其中：
     *   后端路径是： /agent/llm/predict_stream （仅示例）
     *   请求体中额外带上 baseAPIHandler，模拟后端让智能体知道有哪些 JS 可调用
     */
     async callLLMStream(question) {
      this.currentQuestion = question;
      try {
        // 发起请求
        const response = await fetch("/agent/llm/predict_stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: question , messages: this.messages , baseAPIHandler : `{
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
}` })
        });

        if (!response.ok) {
          console.error("请求后端出错：", response.status, response.statusText);
          this.appendLeftMessage("（出错啦，请稍后再试）");
          return;
        }

        // 开始一个新的左侧气泡（流式回答）
        this.appendLeftStreamingStart();

        // 以流式方式（ReadableStream）读取 body
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let leftover = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            this.streamDone()
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
              if (lineData && lineData.content) {
                this.appendLeftStreamingStart(lineData.content);
              }
              // [B] 如果包含 tool_calls，就检查是否要执行JS
              if (lineData && lineData.tool_calls != null) {
                if(lineData.tool_calls[0] && lineData.tool_calls[0].id && lineData.tool_calls[0].id.length > 10 && lineData.tool_calls[0].function && lineData.tool_calls[0].function.name == "run_js_code") {
                  window.currentCodeId = lineData.tool_calls[0].id;
                  window.currentCode = "";
                } 
                
                if(lineData.tool_calls[0] && lineData.tool_calls[0].function && lineData.tool_calls[0].function.arguments) {
                  window.currentCode = (window.currentCode || "") + lineData.tool_calls[0].function.arguments;
                }
                
                try {
                  if(window.currentCode && window.currentCode.endsWith('}')) {
                    const parsedCode = JSON.parse(window.currentCode);
                    if(parsedCode && parsedCode.code) {
                      console.log("执行JS代码", parsedCode.code);
                      eval(parsedCode.code);
                    }
                  }
                } catch(e) {
                  console.error("解析或执行JS代码出错:", e);
                }
              }

            } catch (e) {
              console.warn("解析 JSON 行出错：", e, lines[i]);
            }
          }
          leftover = lines[lines.length - 1];
        }
      } catch (err) {
        console.error("流式请求异常：", err);
        this.appendLeftMessage("（请求异常，请检查后端/网络）");
      }
    },

    /**
     * 工具函数：判断字符串是否能被 JSON.parse
     */
    isValidJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (error) {
        return false;
      }
    },
    streamDone(){
      this.messages[2] = ({ role: "system", content: "用户上一次提问：" + this.currentQuestion });
      this.messages[3] = ({ role: "system", content: "系统上一次回答" + this.currentLeftSpan.textContent });
      this.isStreaming = false;
      if(this.currentLeftSpan.textContent.length <= 1) {
        this.currentLeftSpan.remove();
        this.currentLeftSpan = null;
        if(window.currentCode) {
          this.$message.success("智能体执行了JS代码：" + window.currentCodeId);
          this.appendCenterMessage("智能体执行了JS代码："+ window.currentCodeId)
        }
      }
      const container = this.$refs.chatContainer; 
      container.scrollTop = container.scrollHeight - container.clientHeight;
    },
    // [1] 开始一个新的左侧气泡，用于后续流式追加
    appendLeftStreamingStart(text) {
      if (this.currentLeftSpan && text) {
        this.currentLeftSpan.textContent += text;
        return;
      }
      const leftDiv = document.createElement("div");
      leftDiv.className = "sayllm-left my-animation-slide-bottom";
      const span = document.createElement("span");
      span.className = "sayllm-item-left";
      leftDiv.appendChild(span);
      document.getElementById("chat-container").appendChild(leftDiv);
      this.currentLeftSpan = span;
    },
    // 在左侧插入一条（非流式）消息
    appendLeftMessage(msg) {
      const leftDiv = document.createElement("div");
      leftDiv.className = "sayllm-left my-animation-slide-bottom";
      const span = document.createElement("span");
      span.className = "sayllm-item-left";
      span.textContent = msg;
      leftDiv.appendChild(span);
      document.getElementById("chat-container").appendChild(leftDiv);
    },

    // 在中间插入一条消息
    appendCenterMessage(msg) {
      const leftDiv = document.createElement("div");
      leftDiv.className = "sayllm-center my-animation-slide-bottom";
      const span = document.createElement("span");
      span.className = "sayllm-item-center";
      span.textContent = msg;
      leftDiv.appendChild(span);
      document.getElementById("chat-container").appendChild(leftDiv);
    },

    // 在右侧插入一条消息
    appendRightMessage(msg) {
      const rightDiv = document.createElement("div");
      rightDiv.className = "sayllm-right my-animation-slide-bottom";
      const span = document.createElement("span");
      span.className = "sayllm-item-right";
      span.textContent = msg;
      rightDiv.appendChild(span);
      document.getElementById("chat-container").appendChild(rightDiv);
    },
  }
};
</script>

<style> 
.home-chat-container { 
  width: 100%; 
  margin: 0 auto; 
  max-width: 700px; 
  position: relative; /* 使内部元素可以使用绝对定位 */ 
} 
 
.home-chat-box {
  position: absolute;
  background: #2f3640;
  height: 40px;
  z-index: 100;
  display: flex;
  border-radius: 40px;
  padding: 10px;
  width:40px;
  box-sizing: content-box;
  box-shadow: #2f3640 0 0 10px;
  transition: .3s;
}
.home-chart-mask {
  width: 0;
  height: 100px;
  position: absolute;
  opacity: 0;
  z-index: 0;
}
/* 同时响应 hover 和焦点状态 */
.home-chat-container:hover, 
.home-chat-container:focus-within {
  .home-chart-mask {
    width: 100%;
  }
  .home-chat-box {
    width: calc(100% - 20px);
  }
  .home-chat-input {
    padding: 0 6px;
    flex-grow: 1;
    transition: flex-grow 0.3s, padding 0.3s;
  }
 
  .chat-bubble-container {
    opacity: 1;
    width: 100%;
    height: 400px;
    transition: height 0.3s 0.3s, width 0.3s, opacity 0.3s 0.3s;
  }
}
.home-chat-input { 
  -webkit-tap-highlight-color: transparent;
  border:none;
  background: none;
  outline:none;
  float:left;
  padding: 0;
  color: white;
  font-size: 16px;
  transition: 0.4s;
  line-height: 40px;
  flex-grow: 0;
  width: 0;
}
/* 等待状态 */
.home-chat-box button[disabled] { 
  background: #535c68; 
  cursor: not-allowed;
}
 
.home-chat-box button[disabled]::after {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid #f5f6fa;
  color:inherit !important;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}
 
@keyframes spin {
  to { transform: rotate(360deg); }
}

.home-chat-box button { 
  color:#2f3640; 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  background-color: var(--lightGray);
  display: flex; 
  justify-content: center;
  font-size: large; 
  align-items: center; 
  transition: 0.4s; 
  border: none; 
  cursor: pointer; 
} 
 
.home-chat-container:hover button { 
  background-color: white;
  color: #2f3640 !important; 
} 
 
/* 气泡容器 */ 
.chat-bubble-container { 
  display: flex;
  position: absolute;
  top: 80px;
  flex-direction: column;
  overflow: hidden;
  width:0;
  opacity: 0;
  z-index: 100;
  height: 0; 
  background: #2f3640; /* 半透明背景 */ 
  border-radius: 10px; /* 圆角 */ 
  padding: 10px;
  color: var(--white);
  box-sizing: border-box;
  overflow-y: scroll;
} 
 
/* 示例气泡样式 */ 
.sayllm-left, 
.sayllm-right, 
.sayllm-center { 
  display: flex; 
  margin-bottom: 10px; 
} 
.sayllm-right {
  justify-content: right;
}
.sayllm-center {
  justify-content: center;
}
.sayllm-item-left, 
.sayllm-item-right, 
.sayllm-item-center { 
  display: inline-block; 
  padding: 8px 12px; 
  border-radius: 4px; 
  background-color: var(--translucent);
  max-width: 90%; 
  word-wrap: break-word; 
  line-height: 1.4; 
} 
/* 简单的动画示例 */ 
.my-animation-slide-bottom { 
  animation: slide-bottom 0.3s ease-in-out forwards; 
} 
 
@keyframes slide-bottom { 
  0% { 
    opacity: 0; 
    transform: translateY(30%); 
  } 
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  } 
} 
</style>