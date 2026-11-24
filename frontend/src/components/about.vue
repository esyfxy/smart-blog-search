<template>
  <div>
    <!-- 两句诗 -->
    <div v-if="isPoem" class="my-animation-slide-top">
      <twoPoem :isHitokoto="false"></twoPoem>
    </div>

    <div style="background: var(--background)" class="my-animation-slide-bottom">
      <div class="about-wrap">
        <h1 v-if="isPoem" style="font-size: 40px; font-weight: 500; letter-spacing: 5px;">
          关于博主
        </h1>

        <!-- 对话框 -->
        <div class="about-box">
          <h4>与 来自{{store.webInfo.webName}} 的智能体对话中...</h4>
          <div v-if="sayShow" id="say-container"></div>
        </div>

        <!-- 用户可在此输入问题 -->
        <commentBox
          :disableGraffiti="true"
          @submitComment="submitReply"
        ></commentBox>
      </div>

      <!-- 页脚 -->
      <myFooter v-if="isFooter"></myFooter>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useMainStore } from '../store';

/**
 * 按需动态引入你的子组件
 */
import twoPoem from "./common/twoPoem.vue";
import myFooter from "./common/myFooter.vue";
import commentBox from "./comment/commentBox.vue";

export default defineComponent({
  name: "AboutVue",
  components: {
    twoPoem,
    myFooter,
    commentBox
  },
  props: {
    isPoem: {
      type: Boolean,
      default: true
    },
    isFooter: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    // 使用Pinia store
    const store = useMainStore();
    
    // 用于显示"关于博主"那几段自动对话
    const sayShow = ref(true);
    const sayIndex = ref(0);
    const currentLeftSpan = ref(null);
    
    const sayContent = ref([
      {
        talk: [
          "😘",
          "本站仅用于交流和学习新知识",
          "如涉及侵权请联系站长删除对应资源，谢谢！！！"
        ],
        reply: ["关于博主"]
      },
      {
        talk: [
          "博主目前是一位热爱技术的普通学生",
          "主要学习方向是大数据与人工智能",
          "当然嵌入式和单片机等硬件工程师方向也有在学啦，希望多多指教~"
        ],
        reply: ["联系方式📞"]
      },
      {
        talk: [
          "💌Mail：janxland@gmail（janxland@qq.com）",
          "QQ：983341575",
          "微信号：janxland"
        ],
        reply: ["了解完毕~"]
      }
    ]);

    // 在左侧插入一条（非流式）消息
    const appendLeftMessage = (msg) => {
      const leftDiv = document.createElement("div");
      leftDiv.className = "say-left my-animation-slide-bottom";

      const span = document.createElement("span");
      span.className = "say-item-left";
      span.textContent = msg;

      leftDiv.appendChild(span);
      const container = document.getElementById("say-container");
      if (container) container.appendChild(leftDiv);
    };

    // 在中间插入一条消息
    const appendCenterMessage = (msg) => {
      const leftDiv = document.createElement("div");
      leftDiv.className = "say-center my-animation-slide-bottom";

      const span = document.createElement("span");
      span.className = "say-item-center";
      span.textContent = msg;

      leftDiv.appendChild(span);
      const container = document.getElementById("say-container");
      if (container) container.appendChild(leftDiv);
    };

    // 在右侧插入一条消息
    const appendRightMessage = (msg) => {
      const rightDiv = document.createElement("div");
      rightDiv.className = "say-right my-animation-slide-bottom";

      const span = document.createElement("span");
      span.className = "say-item-right";
      span.textContent = msg;

      rightDiv.appendChild(span);
      const container = document.getElementById("say-container");
      if (container) container.appendChild(rightDiv);
    };

    // 开始一个新的左侧气泡，用于后续流式追加
    const appendLeftStreamingStart = () => {
      const leftDiv = document.createElement("div");
      leftDiv.className = "say-left my-animation-slide-bottom";
      
      const span = document.createElement("span");
      span.className = "say-item-left";
      
      leftDiv.appendChild(span);
      const container = document.getElementById("say-container");
      if (container) container.appendChild(leftDiv);
      currentLeftSpan.value = span;
    };

    // 追加文本到当前左侧气泡（同一个 span）
    const appendLeftStreamingText = (text) => {
      if (currentLeftSpan.value) {
        // 不断往同一个 span 里追加文本
        currentLeftSpan.value.textContent += text;
      }
    };

    // 结束本次回答气泡
    const appendLeftStreamingEnd = () => {
      currentLeftSpan.value = null;
    };

    // 处理回答
    const answer = (index, value) => {
      const selects = document.getElementsByClassName("say-select");
      while (selects.length > 0) {
        selects[0].remove();
      }
      
      let htmlStr = `
        <div class="say-right my-animation-slide-bottom">
          <span class="say-item-right">${value}</span>
        </div>
      `;
      let frag = document.createRange().createContextualFragment(htmlStr);
      const container = document.getElementById("say-container");
      if (container) container.appendChild(frag);

      if (index === 0) {
        setTimeout(() => {
          say();
        }, 500);
      }
      else {
        let htmlStr = `
          <div class="say-left my-animation-slide-bottom">
            <span class="say-item-left">👋 👋 👋</span>
          </div>
        `;
        let frag = document.createRange().createContextualFragment(htmlStr);
        const container = document.getElementById("say-container");
        if (container) container.appendChild(frag);
      }
    };

    // "关于博主" 预置的自动对话逻辑
    const say = () => {
      // 如果该段对话存在
      if (
        sayContent.value[sayIndex.value] &&
        sayContent.value[sayIndex.value].talk &&
        sayContent.value[sayIndex.value].talk.length > 0
      ) {
        // 依次显示 talk 里的每一句
        sayContent.value[sayIndex.value].talk.forEach((value, index, talk) => {
          setTimeout(() => {
            // 左侧插入
            let htmlStr = `
              <div class="say-left my-animation-slide-bottom">
                <span class="say-item-left">${value}</span>
              </div>
            `;
            let frag = document.createRange().createContextualFragment(htmlStr);
            const container = document.getElementById("say-container");
            if (container) container.appendChild(frag);

            // 如果是talk最后一句
            if (index === talk.length - 1) {
              // 并且有可选的 reply
              if (
                sayContent.value[sayIndex.value].reply &&
                sayContent.value[sayIndex.value].reply.length > 0
              ) {
                setTimeout(() => {
                  // 如果 reply 有2个选项
                  if (sayContent.value[sayIndex.value].reply.length === 2) {
                    let reply0 = sayContent.value[sayIndex.value].reply[0];
                    let reply1 = sayContent.value[sayIndex.value].reply[1];
                    let htmlStr = `
                      <div class="say-left my-animation-slide-bottom">
                        <span class="say-select">${reply0}</span>
                        <span class="say-select">${reply1}</span>
                      </div>
                    `;
                    let frag = document
                      .createRange()
                      .createContextualFragment(htmlStr);
                    const container = document.getElementById("say-container");
                    if (container) container.appendChild(frag);

                    const selectElements = document.getElementsByClassName("say-select");
                    if (selectElements[0]) {
                      selectElements[0].addEventListener("click", () => {
                        answer(0, reply0);
                      });
                    }
                    if (selectElements[1]) {
                      selectElements[1].addEventListener("click", () => {
                        answer(1, reply1);
                      });
                    }
                  }
                  // 如果 reply 只有1个选项
                  else if (sayContent.value[sayIndex.value].reply.length === 1) {
                    let reply0 = sayContent.value[sayIndex.value].reply[0];
                    let htmlStr = `
                      <div class="say-left my-animation-slide-bottom">
                        <span class="say-select">${reply0}</span>
                      </div>
                    `;
                    let frag = document
                      .createRange()
                      .createContextualFragment(htmlStr);
                    const container = document.getElementById("say-container");
                    if (container) container.appendChild(frag);

                    const selectElement = document.getElementsByClassName("say-select")[0];
                    if (selectElement) {
                      selectElement.addEventListener("click", () => {
                        answer(0, reply0);
                      });
                    }
                  }
                  // 对话索引 +1
                  sayIndex.value += 1;
                }, 500);
              }
            }
          }, index * 500);
        });
      }
    };

    // 提交回复
    const submitReply = (content) => {
      if (content && content.trim() !== "") {
        appendRightMessage(content);
        callLLMStream(content);
      } else {
        // 使用全局Vue实例上的$message
        window.$message && window.$message.error("内容不能为空");
      }
    };

    // 调用大模型的流式接口
    const callLLMStream = async (question) => {
      try {
        // 发起请求
        const response = await fetch("/agent/llm/predict_stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: question , baseAPIHandler : `{
    "correctSong": {
        "call": "baseAPIhandle.correctSong.handle('left')",
        "arguments": "data",
        "desc": "操作歌曲播放顺序。data可以是left: 上一首歌；right: 下一首歌；index[number]: 指定播放索引。调用例子baseAPIhandle.correctSong.handle(1)"
    },
    "searchSong": {
        "call": "baseAPIhandle.searchSong.handle(data)",
        "arguments": "data",
        "desc": "点歌、搜索播放歌曲,参数：data = {key=\"歌曲名\"}。调用：baseAPIhandle.searchSong.handle({key:\"歌曲名\"})"
    },
    "seachSongList": {
        "call": "baseAPIhandle.seachSongList.handle()",
        "arguments": "",
        "desc": "搜索歌单,data = {key=\"歌单名\"},调用：baseAPIhandle.seachSongList.handle({key:\"歌单名\"})"
    }
}` })
        });

        if (!response.ok) {
          console.error("请求后端出错：", response.status, response.statusText);
          appendLeftMessage("（出错啦，请稍后再试）");
          return;
        }

        // 开始一个新的左侧气泡（流式回答）
        appendLeftStreamingStart();

        // 以流式方式（ReadableStream）读取 body
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let leftover = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if(currentLeftSpan.value && currentLeftSpan.value.textContent.length <= 1) {
              // 删除currentLeftSpan
              currentLeftSpan.value.remove();
              if(window.currentCode) {
                appendCenterMessage("智能体执行了JS代码："+ window.currentCodeId);
              }
            }
            appendLeftStreamingEnd();
            break;
          }
          const chunkStr = decoder.decode(value, { stream: true });
          leftover += chunkStr;
          // 按换行符拆分
          const lines = leftover.split("\n");
          for (let i = 0; i < lines.length - 1; i++) {
            try {
              const lineData = JSON.parse(lines[i]);
              if (lineData && lineData.content) {
                appendLeftStreamingText(lineData.content);
              }
              // [B] 如果包含 tool_calls，就检查是否要执行JS
              if (lineData && lineData.tool_calls != null) {
                const toolCall = lineData.tool_calls[0];
                if(toolCall && toolCall.id && toolCall.id.length > 10 && toolCall.function.name === "run_js_code") {
                  window.currentCodeId = toolCall.id;
                  window.currentCode = "";
                } else if (toolCall && toolCall.function) {
                  window.currentCode = (window.currentCode || "") + toolCall.function.arguments;
                }
                
                if(window.currentCode && window.currentCode.endsWith('}')) {
                  try {
                    const parsedCode = JSON.parse(window.currentCode);
                    if(parsedCode && parsedCode.code) {
                      console.log("执行JS代码", parsedCode.code);
                      // 使用Function构造函数替代eval
                      const executeFunction = new Function(parsedCode.code);
                      executeFunction();
                    }
                  } catch(execError) {
                    console.error("解析或执行JS代码失败:", execError);
                  }
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
        appendLeftMessage("（请求异常，请检查后端/网络）");
      }
    };

    // 生命周期钩子
    onMounted(() => {
      say();
    });

    return {
      sayShow,
      submitReply,
      store
    };
  }
});
</script>


<style>
/* 容器整体 */
.about-wrap {
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
}

.about-box {
  min-height: 500px;
  padding: 5px;
  background-color: var(--maxMaxLightGray);
  border-radius: 10px;
  margin-bottom: 20px;
}

/* 左侧气泡 */
.say-left {
  display: flex;
  justify-content: left;
  margin: 15px;
}

.say-item-left {
  padding: 5px 12px;
  border-radius: 1rem;
  color: var(--maxGreyFont);
  background-color: var(--lightGray);
  text-align: left;
  /* 让长文本自动换行 */
  display: inline-block;
  max-width: 70%;
  word-break: break-word;
}
.say-center {
  display: flex;
  justify-content: center;
  margin: 15px;
}
.say-item-center {
  padding: 5px 12px;
  border-radius: 1rem;
  color: var(--white);
  background-color: var(--maxGreyFont);
  text-align: center;
  display: inline-block;
  max-width: 70%;
  word-break: break-word;
}
/* 右侧气泡 */
.say-right {
  display: flex;
  justify-content: right;
  margin: 15px;
}

.say-item-right {
  padding: 5px 12px;
  border-radius: 1rem;
  color: var(--white);
  background-color: var(--translucent);
  text-align: left;
  /* 让长文本自动换行 */
  display: inline-block;
  max-width: 70%;
  word-break: break-word;
}

/* 可选项按钮 */
.say-select {
  cursor: pointer;
  background: var(--black);
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 12px;
  margin-top: 20px;
  color: var(--white);
  border: 1px solid var(--black);
}

.say-select:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}
</style>


