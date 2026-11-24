<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="toolbar.visible"
           @mouseenter="hoverEnter = true"
           @mouseleave="hoverEnter = false"
           :class="[{ enter: toolbar.enter }, { hoverEnter: (hoverEnter || route.path === '/favorite') && !toolbar.enter }]"
           class="toolbar-content">
        <div class="ml-7.5 cursor-pointer">
          <h2 @click="router.push({path: '/'})">{{store.webInfo.webName}}</h2>
        </div>
        <div v-if="common.mobile() || mobile"
             class="text-3xl mr-3.75 cursor-pointer"
             @click="toolbarDrawer = !toolbarDrawer"
             :class="{ enter: toolbar.enter }">
             <Operation class="h-[22px]" />
        </div>
        <div v-else>
          <ul class="scroll-menu">
            <li @click="router.push({path: '/'})">
              <div class="my-menu">
                <span>🏡 首页</span>
              </div>
            </li>
            <li @click="router.push({path: '/favorite'})">
              <div class="my-menu">
                <span>🧰 百宝箱</span>
              </div>
            </li>
            <li v-for="(menu, index) in navigationBar"
                @click="router.push({path: '/sort', query: {sortId: menu.id, labelId: menu.labels[0].id}})"
                :key="index">
              <div class="my-menu">
                <span>📒 {{ menu.sortName }}</span>
              </div>
            </li>
            <li @click="goIm()">
              <div class="my-menu">
                <span>🎠 生活</span>
              </div>
            </li>
            <li @click="router.push({path: '/message'})">
              <div class="my-menu">
                <span>📪 留言</span>
              </div>
            </li>
            <!-- 相册 -->
            <li>
              <div class="my-menu">
                <div class="dropdown">
                  <span class="dropbtn" @click.stop="router.push({path: '/album'})">🖼️ 相册</span>
                  <div class="dropdown-content">
                    <router-link target="_blank" to="/album?type=dynamic" class="button" ks-tag="left" ks-text="说说发图集合">动态相册</router-link>
                    <router-link target="_blank" to="/album?type=acg" class="button" ks-tag="left" ks-text="调用随机图片API">随机图册</router-link>
                    <router-link target="_blank" to="/album?type=web" class="button" ks-tag="left" ks-text="我给你爬取给定页面图片">爬虫相册</router-link>
                    <router-link target="_blank" to="/album?type=origin" class="button" ks-tag="left" ks-text="具体服务在：关于->喵频道">源相册</router-link>
                  </div>
                </div>
              </div>
            </li>
            <!-- 友人帐 -->
            <li @click="router.push({path: '/friend'})">
              <div class="my-menu">
                <span>💃 友人帐</span>
              </div>
            </li>
            <!-- 追番 -->
            <li @click="router.push({path: '/bangumi'})">
              <div class="my-menu">
                <span>🔮 追番</span>
              </div>
            </li>
            <!-- 关于 -->
            <li>
              <div class="my-menu">
                <div class="dropdown">
                  <span class="dropbtn" @click.stop="router.push({path: '/about'})">🐟 关于</span>
                  <div class="dropdown-content">
                    <router-link target="_blank" to="/calendar" ks-tag="left" ks-text="博主待办" class="button">Todos</router-link>
                    <router-link target="_blank" to="//assis.roginx.ink" ks-tag="left" ks-text="智能语音助手" class="button">AssIstant</router-link>
                    <router-link target="_blank" to="//music.roginx.ink" ks-tag="left" ks-text="解灰音跃台" class="button">音乐台</router-link>
                    <router-link target="_blank" to="//alist.roginx.ink" ks-tag="left" ks-text="Alist云盘" class="button">万能云盘</router-link>
                    <router-link target="_blank" to="/album?type=aurora&id=194" ks-tag="left" ks-text="分享好看图片" class="button">相册集</router-link>
                    <router-link target="_blank" to="//miru.roginx.ink/" ks-tag="left" ks-text="订阅式爽看" class="button">喵频道</router-link>
                    <router-link target="_blank" to="//wazzii.roginx.ink" ks-tag="left"  ks-text="WebChat" class="button">畅所欲言</router-link>
                  </div>
                </div>
              </div>
            </li>
            <!-- 个人中心 -->
            <li>
              <el-dropdown placement="bottom" trigger="click">
                <el-avatar class="user-avatar cursor-pointer hover:scale-110 transition-transform duration-300" :size="36"
                           style="margin-top: 12px"
                           :src="!common.isEmpty(store.currentUser) ? store.currentUser.avatar : DEFAULT_AVATAR">
                </el-avatar>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="smallMenu({path: '/user'})"
                                      v-if="!common.isEmpty(store.currentUser)">
                      <i class="fa fa-user-circle" aria-hidden="true"></i> <span>个人中心</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="smallMenu({path: '/admin'})"
                                      v-if="!common.isEmpty(store.currentUser)">
                      <i class="fa fa-user-circle" aria-hidden="true"></i> <span>后台管理</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="logout()" v-if="!common.isEmpty(store.currentUser)">
                      <i class="fa fa-sign-out" aria-hidden="true"></i> <span>退出</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="smallMenu({path: '/user'})"
                                      v-if="common.isEmpty(store.currentUser)">
                      <i class="fa fa-sign-in" aria-hidden="true"></i> <span>登录</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="goToSSOLogin"
                                      v-if="common.isEmpty(store.currentUser)">
                      <i class="fa fa-sign-in" aria-hidden="true"></i> <span>单点登录</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="smallMenu({path: '/admin'})"
                                      v-if="common.isEmpty(store.currentUser)">
                      <i class="fa fa-sign-in" aria-hidden="true"></i> <span>登录后台</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <div id="main-container">
      <router-view></router-view>
    </div>
    
    <div id="music-platform">
      <MusicBar id="appMusic" v-if="isMusic" ref="appMusic" name="MUSIC" 
      frameborder="no" scrolling="no" border="0" marginwidth="0" marginheight="0"
      customClass="fullLyric,bottomStyle,leaveLeft=72,shakeHight=300px"></MusicBar>
    </div>
    
    <!-- 回到顶部按钮 -->
    <div href="#" class="cd-top" v-if="!common.mobile()" @click="toTop"></div>

    <!-- 移动端回到顶部按钮 -->
    <div class="toolButton" v-show="scrollTop > window.innerHeight">
      <div class="backTop" v-if="common.mobile()" @click="toTop">
        <svg viewBox="0 0 1024 1024" width="50" height="50">
          <path
            d="M696.741825 447.714002c2.717387-214.485615-173.757803-312.227566-187.33574-320.371729-10.857551 5.430775-190.050127 103.168727-187.33274 320.371729-35.297037 24.435488-73.306463 65.1623-67.875688 135.752376 5.430775 70.589076 76.018851 119.460051 103.168726 116.745664 27.152875-2.716387 19.004713-21.7221 19.004713-21.7221l8.148162-38.011425s40.721814 59.732525 51.583363 59.732525h146.609927c13.574938 0 51.585363-59.732525 51.585363-59.732525l8.147162 38.011425s-8.147162 19.005713 19.004713 21.7221c27.148876 2.714388 97.738951-46.156588 103.168727-116.745664s-32.57965-111.316888-67.876688-135.752376z m-187.33574-2.713388c-5.426776 0-70.589076-2.717387-78.733239-78.737238 2.713388-73.306463 73.306463-78.733239 78.733239-81.450626 5.430775 0 76.02385 8.144163 78.736238 81.450626-8.143163 76.019851-73.305463 78.737238-78.736238 78.737238z m0 0"
            fill="#000000"></path>
          <path
            d="M423.602441 746.060699c6.47054-6.297579 12.823107-7.017417 21.629121-2.784372 34.520213 16.582259 70.232157 19.645568 107.031855 9.116944 8.118169-2.323476 15.974396-5.475765 23.598677-9.22392 13.712907-6.73648 26.003134 0.8878 26.080116 16.13936 0.109975 22.574907-0.024994 45.142816 0.080982 67.709725 0.031993 7.464316-2.277486 13.322995-9.44387 16.608254-7.277358 3.333248-13.765895 1.961558-19.526595-3.264264-3.653176-3.313253-7.063407-6.897444-10.634601-10.304675-6.563519-6.259588-6.676494-6.25259-10.625603 1.603638-8.437097 16.80121-16.821205 33.623415-25.257302 50.423625-2.489438 4.953882-5.706713 9.196925-11.411426 10.775569-8.355115 2.315478-15.772442-1.070758-20.272427-9.867774-8.774021-17.15313-17.269104-34.453228-25.918153-51.669344-3.750154-7.469315-3.9891-7.479313-10.141712-1.514658-3.715162 3.602187-7.31435 7.326347-11.142486 10.800563-5.571743 5.060858-11.934308 6.269586-18.936728 3.207277-6.82746-2.984327-9.869774-8.483086-9.892769-15.685462-0.070984-23.506697-0.041991-47.018393-0.020995-70.532089 0.007998-4.679944 1.46467-8.785018 4.803916-11.538397z"
            fill="#000000"></path>
        </svg>
      </div>
      
      <el-popover
        placement="left"
        :close-delay="100"
        trigger="click"
      >
        <template #reference>
          <i class="fa fa-cog iconRotate" aria-hidden="true"></i>
        </template>
        <div class="flex flex-row w-full justify-around text-[20px]">
          <div class="cursor-pointer hover:scale-110 hover:color-[var(--themeBackground)] transition-all duration-300">
            <!-- 音乐按钮 -->
            <i class="fa fa-music" title="关闭音乐节省资源" @click="changeAppMusic()" :class="isMusic ? 'choosed' : ''"></i>
          </div>
          <div class="cursor-pointer hover:scale-110 hover:color-[var(--themeBackground)] transition-all duration-300">
            <!-- 太阳按钮 -->
            <i v-if="isDark" class="fa fa-sun-o iconRotate" @click="changeColor()"></i>
            <!-- 月亮按钮 -->
            <i v-else class="fa fa-moon-o" aria-hidden="true" @click="changeColor()"></i>
          </div>
          <div class="cursor-pointer hover:scale-110 hover:color-[var(--themeBackground)] transition-all duration-300">
            <i class="fa fa-snowflake-o" :class="mouseAnimation ? 'iconRotate choosed' : ''" aria-hidden="true" @click="changeMouseAnimation()"></i>
          </div>
        </div>
      </el-popover>
    </div>

    <!-- 聊天按钮 -->
    <div id="agent-chat-trigger" @click="toggleAgentDialog">
      <i class="fa fa-comments-o" aria-hidden="true"></i>
    </div>
    
    <!-- 聊天弹窗 -->
    <div id="agent-chat-modal" v-show="showAgentDialog">
      <div class="agent-chat-header">
        <span>智能助手</span>
        <i class="fa fa-times" @click="showAgentDialog = false"></i>
      </div>
      <div class="agent-chat-body">
        <agent-dialog />
      </div>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer v-model="toolbarDrawer"
      :show-close="false"
      size="80%"
      :with-header="false"
      body-class="toolbarDrawer"
      direction="ltr">
      <div>
        <ul class="small-menu">
          <li @click="smallMenu({path: '/'})">
            <div>
              🏡 <span>首页</span>
            </div>
          </li>
          <li v-for="(menu, index) in navigationBar"
              @click="smallMenu({path: '/sort', query: {sortId: menu.id, labelId: menu.labels[0].id}})"
              :key="index">
            <div>
              <span>📒 {{ menu.sortName }}</span>
            </div>
          </li>
          <!-- 聊天室 -->
          <li @click="goIm()">
            <div>
              <span>🎠 生活</span>
            </div>
          </li>
          <!-- 百宝箱 -->
          <li @click="smallMenu({path: '/favorite'})">
            <div>
              <span>🧰 百宝箱</span>
            </div>
          </li>
          <!-- 留言 -->
          <li @click="smallMenu({path: '/message'})">
            <div>
              <span>📪 留言</span>
            </div>
          </li>
          <li @click="smallMenu({path: '/bangumi'})">
            <div>
              <span>🔮 追番</span>
            </div>
          </li>
          <!-- 友人帐 -->
          <li @click="smallMenu({path: '/friend'})">
            <div>
              <span>🎅 友人帐</span>
            </div>
          </li>
          <li>
              <div class="my-menu">
                <div class="dropdown">
                  <span class="dropbtn" @click.stop="smallMenu({path: '/album'})">🖼️ 相册</span>
                  <div class="dropdown-content">
                    <router-link target="_blank" to="/album?type=dynamic" class="button">动态相册</router-link>
                    <router-link target="_blank" to="/album?type=acg" class="button">随机图册</router-link>
                    <router-link target="_blank" to="/album?type=web" class="button">爬虫相册</router-link>
                    <router-link target="_blank" to="/album?type=origin" class="button">源相册</router-link>
                  </div>
                </div>
              </div>
            </li>
          <!-- 关于 -->
          <li>
            <div>
              <div class="dropdown">
                <span class="dropbtn"><span @click.stop="smallMenu({path: '/about'})">🐟 关于</span></span>
                  <div class="dropdown-content">
                    <router-link target="_blank" to="/calendar" class="button">Todos</router-link>
                    <router-link target="_blank" to="//assis.roginx.ink" class="button">AssIstant</router-link>
                    <router-link target="_blank" to="//music.roginx.ink" class="button">音乐台</router-link>
                    <router-link target="_blank" to="//alist.roginx.ink" class="button">万能云盘</router-link>
                    <router-link target="_blank" to="/album?type=aurora&id=194" class="button">相册集</router-link>
                    <router-link target="_blank" to="//miru.roginx.ink/" class="button">喵频道</router-link>
                    <router-link target="_blank" to="//chat.roginx.ink" class="button">畅所欲言</router-link>
                  </div>
                </div>
            </div>
          </li>

          <template v-if="common.isEmpty(store.currentUser)">
            <li @click="smallMenu({path: '/user'})">
              <div>
                <i class="fa fa-sign-in" aria-hidden="true"></i>
                <span>登录</span>
              </div>
            </li>
          </template>
          <template v-else>
            <li @click="smallMenu({path: '/user'})">
              <div>
                <i class="fa fa-user-circle" aria-hidden="true"></i>
                <span> 个人中心</span>
              </div>
            </li>
            <li @click="smallMenu({path: '/admin'})">
              <div>
                <i class="fa fa-user-circle" aria-hidden="true"></i>
                <span> 后台管理 </span>
              </div>
            </li>
            <li @click="smallMenuLogout()">
              <div>
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span> 退出</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import MusicBar from './common/musicBar.vue';
import AgentDialog from './common/agentLLM.vue';
import { useMainStore } from '../store';
import { Operation } from '@element-plus/icons-vue';
import mousedown from '../utils/mousedown';

// 注入全局依赖
const common = inject('$common');
const http = inject('$http');
const constant = inject('$constant');
const router = useRouter();
const route = useRoute();

// 创建store实例
const store = useMainStore();

// 响应式状态
const hoverEnter = ref(false);
const isMusic = ref(true);
const toolbarDrawer = ref(false);
const mobile = ref(false);
const scrollTop = ref(0);
const showAgentDialog = ref(false);
const window = globalThis.window; // 添加window全局对象

// 计算属性
const toolbar = computed(() => store.toolbar);

const DEFAULT_AVATAR = computed(() => {
  if (localStorage.getItem("DEFAULT_WALLPAPER")) {
    let DEFAULT_WALLPAPER = JSON.parse(localStorage.getItem("DEFAULT_WALLPAPER"));
    return DEFAULT_WALLPAPER.avatar;
  } else {
    return "//i1.hdslb.com/bfs/face/2b83aa1ae288fc6083a5ab513e467316bcf5242d.jpg@96w_96h_1c_1s_!web-avatar.webp";
  }
});

const navigationBar = computed(() => {
  if (store.sortInfo !== null && store.sortInfo.length !== 0) {
    return store.sortInfo
      .filter(f => f.sortType === 0)
      .sort((s1, s2) => s1.priority - s2.priority);
  } else {
    return [];
  }
});

const goToSSOLogin = () => {
  document.location.href = `https://edu.roginx.ink/login?redirect=${window.location.href}`;
};

// 方法
const isDark = ref(false);

const changeAppMusic = () => {
  isMusic.value = !isMusic.value;
};

const changeColor = () => {
  isDark.value = !isDark.value;
  let root = document.querySelector(":root");
  if (isDark.value) {
    document.documentElement.setAttribute("theme", "dark");
    root.style.setProperty("--background", "#272727");
    root.style.setProperty("--fontColor", "white");
    root.style.setProperty("--borderColor", "#4F4F4F");
    root.style.setProperty("--borderHoverColor", "black");
    root.style.setProperty("--articleFontColor", "#E4E4E4");
    root.style.setProperty("--articleGreyFontColor", "#D4D4D4");
    root.style.setProperty("--commentContent", "#D4D4D4");
  } else {
    document.documentElement.setAttribute("theme", "");
    root.style.setProperty("--background", "white");
    root.style.setProperty("--fontColor", "black");
    root.style.setProperty("--borderColor", "rgba(0, 0, 0, 0.5)");
    root.style.setProperty("--borderHoverColor", "rgba(110, 110, 110, 0.4)");
    root.style.setProperty("--articleFontColor", "#1F1F1F");
    root.style.setProperty("--articleGreyFontColor", "#616161");
    root.style.setProperty("--commentContent", "#F7F9FE");
  }
};

const mouseAnimation = ref(false);
const changeMouseAnimation = () => {
  mouseAnimation.value = !mouseAnimation.value;
  if (mouseAnimation.value) {
      mousedown();
  }
};

const smallMenu = (item) => {
  if (item.path === '/admin') {
    // 使用history API导航到admin路径，触发qiankun加载子应用
    window.history.pushState({}, '', '/admin');
    // 手动触发路由更新
    window.dispatchEvent(new PopStateEvent('popstate'));
  } else {
    router.push(item);
  }
  toolbarDrawer.value = false;
};

const smallMenuLogout = () => {
  logout();
  toolbarDrawer.value = false;
};

const goIm = () => {
  if (common.isEmpty(store.currentUser)) {
    router.push({ path: "/izone" });
  } else {
    router.push({ path: "/izone" });
  }
};

const logout = async () => {
  try {
    // 并行执行两个登出请求
    await Promise.allSettled([
      // 本地应用登出
      http.get(constant.baseURL + "/user/logout"),
      // SSO登出
      fetch('https://edu.roginx.ink/api/auth-center/sso-logout', {
        method: 'POST',
        credentials: 'include'
      })
    ]);
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    });
  }
  
  // 清理本地状态
  store.loadCurrentUser({});
  localStorage.removeItem("userToken");
  localStorage.removeItem("freshToken");
  router.push({ path: "/" });
};

const getWebInfo = () => {
  http.get(constant.baseURL + "/webInfo/getWebInfo")
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        store.loadWebInfo(res.data);
      }
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
};

const getSortInfo = () => {
  http.get(constant.baseURL + "/webInfo/getSortInfo")
    .then((res) => {
      if (!common.isEmpty(res.data)) {
        store.loadSortInfo(res.data);
      }
    })
    .catch((error) => {
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
};

// 监听滚动事件
const onScrollPage = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop;
};

// 监听滚动位置变化
watch(scrollTop, (newScrollTop, oldScrollTop) => {
  // 如果滑动距离超过屏幕高度三分之一视为进入页面，背景改为白色
  const enter = newScrollTop > window.innerHeight / 2;
  const top = newScrollTop - oldScrollTop < 0;
  const isVisible = newScrollTop - window.innerHeight > 30;
  
  // 显示回到顶部按钮
  if (!common.mobile()) {
    const cdTop = document.querySelector(".cd-top");
    if (cdTop) {
      if (isVisible) {
        if (window.innerHeight > 950) {
          cdTop.style.top = "0";
        } else {
          cdTop.style.top = window.innerHeight - 950 + "px";
        }
      } else {
        cdTop.style.top = "-900px";
      }
    }
  }
  
  // 导航栏显示与颜色
  store.changeToolbarStatus({
    enter: enter,
    visible: top
  });
});

// 初始化操作 - 在setup顶层执行，相当于created
// 初始化工具栏状态
store.changeToolbarStatus({
  enter: false,
  visible: true
});

// 获取网站信息
getWebInfo();
getSortInfo();

// 生命周期钩子
onMounted(() => {
  console.log(store.webInfo);
  
  // 添加滚动监听
  window.addEventListener("scroll", onScrollPage);

  // 检测移动设备
  mobile.value = document.body.clientWidth < 920;
  
  // 监听窗口大小变化
  window.addEventListener("resize", () => {
    mobile.value = document.body.clientWidth < 920;
  });
  
});

// 组件卸载时清除事件监听
onUnmounted(() => {
  window.removeEventListener("scroll", onScrollPage);
});

const toTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleAgentDialog = () => {
  showAgentDialog.value = !showAgentDialog.value;
};
</script>

<style>
.toolbarDrawer {
  padding: 0;
  background-color: #000 !important;
}
/* 隐藏抽屉滚动条 */
:deep(.toolbarDrawer section.el-drawer__body::-webkit-scrollbar) {
  display: none;
}

/* 下拉菜单样式 */
.dropbtn::after {
  content: "\25BE";
  display: inline-block;
  position: relative;
  left: 0.2em;
}

.dropdown {
  @apply z-[5555] relative inline-block box-border;
}

.dropdown-content {
  @apply text-base opacity-0 invisible absolute z-[55555] w-30 p-2.5 right-0 rounded-md;
  background-color: var(--background);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  transition: opacity .5s, visibility 0s .5s;
  pointer-events: none;
}

.dropdown-content .button {
  @apply cursor-pointer text-center block no-underline font-semibold text-sm p-2 rounded-lg transition-all duration-500;
  line-height: 14px;
  color: var(--fontColor);
}

.dropdown-content .button:hover {
  @apply transform scale-110 transition-all duration-500;
  color: var(--themeBackground);
  background: var(--themeBackground-bg);
}

.dropdown:hover .dropdown-content {
  @apply opacity-100 visible;
  transition: opacity 0.5s, visibility 0s;
  pointer-events: auto;
}

/* 音乐播放器 */
#appMusic {
  @apply w-full max-w-125 h-20 fixed pointer-events-none bottom-0 z-[101];
  animation: hideToShow 0.6s ease-in-out;
}

/* 工具栏样式 */
.toolbar-content {
  @apply w-full h-15 text-white fixed z-[100] select-none transition-all duration-300 flex justify-between items-center;
}

.toolbar-content.enter {
  @apply shadow-sm;
  background: var(--background);
  color: var(--font);
}

.toolbar-content.hoverEnter {
  @apply shadow-sm;
  background: var(--translucent);
}

/* 菜单样式 */
.scroll-menu {
  @apply m-0 mr-6.25 flex justify-end p-0;
}

.scroll-menu > li {
  @apply list-none mx-2.25 text-base h-15 leading-15 relative cursor-pointer;
}

.scroll-menu > li:hover .my-menu span {
  color: var(--themeBackground);
}

.scroll-menu > li:hover .my-menu i {
  @apply animate-scale;
  color: var(--themeBackground);
}

.scroll-menu > li .my-menu:after {
  @apply content-[""] block absolute bottom-0 h-1.5 w-full transition-all duration-250;
  background-color: var(--themeBackground);
  max-width: 0;
}

.scroll-menu > li:hover .my-menu:after {
  max-width: 100%;
}

/* Element UI 样式覆盖 */
.el-dropdown {
  font-size: unset;
  color: unset;
}

.el-popper[x-placement^=bottom] {
  margin-top: -8px;
}

.el-dropdown-menu {
  padding: 5px 0;
}

.el-dropdown-menu__item {
  font-size: unset;
}

.el-dropdown-menu__item:hover {
  background-color: var(--white);
  color: var(--themeBackground);
}

@keyframes scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 移动端样式 */
@media screen and (max-width: 576px) {
  .dropdown-content {
    @apply left-full top-0;
  }
  
  #agent-chat-modal {
    width: 90%;
    height: 70%;
    right: 5%;
    bottom: 15%;
  }
  
  #agent-chat-trigger {
    right: 10px;
  }
}

/* 动画 */
@keyframes slide-bottom {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 回到顶部按钮样式 */
.cd-top {
  background: var(--toTop) no-repeat center;
  position: fixed;
  right: 5vh;
  top: -900px;
  z-index: 99;
  width: 70px;
  height: 900px;
  background-size: contain;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}

.backTop {
  transition: all 0.3s ease-in;
  position: relative;
  top: 0;
  left: -13px;
}

.backTop:hover {
  top: -10px;
}

/* 工具按钮样式 */
.toolButton {
  position: fixed;
  right: 3vh;
  bottom: 3vh;
  animation: slide-bottom 0.5s ease-in-out both;
  z-index: 100;
  cursor: pointer;
  font-size: 25px;
}

/* 聊天按钮样式 */
#agent-chat-trigger {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--themeBackground);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  font-size: 24px;
  transition: all 0.3s;
}

#agent-chat-trigger:hover {
  transform: scale(1.1);
}

#agent-chat-modal {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 350px;
  height: 500px;
  background-color: var(--background);
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
}

.agent-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: var(--themeBackground);
  color: white;
}

.agent-chat-header i {
  cursor: pointer;
}

.agent-chat-body {
  flex: 1;
  overflow: hidden;
}
</style>
