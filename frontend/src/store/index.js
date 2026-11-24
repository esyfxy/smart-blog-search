import { defineStore } from 'pinia'
import { getCurrentUserInfo } from '../utils/api'

export const useMainStore = defineStore('main', {
  state: () => ({
    toolbar: {
      visible: false,
      enter: true
    },
    sortInfo: [],
    currentUser: {},
    currentAdmin: {},
    webInfo: {
      webName: "",
      webTitle: [],
      notices: [],
      footer: "",
      backgroundImage: "",
      avatar: ""
    },
    dynamicWallpapers: [],
    playlist: 526887854,
    fonts: [],
    EMOJI: [],
    currentWallpaper: undefined,
    showPosterVideo: false,
    isMuted: true
  }),
  
  getters: {
    articleTotal: (state) => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        if (state.sortInfo.length === 1) {
          return state.sortInfo[0].countOfSort;
        } else {
          return state.sortInfo.reduce((prev, curr) => {
            if (typeof prev === "number") {
              return prev + curr.countOfSort;
            } else {
              return prev.countOfSort + curr.countOfSort;
            }
          });
        }
      } else {
        return 0;
      }
    },
    
    navigationBar: (state) => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        return state.sortInfo.filter(f => {
          return f.sortType === 0;
        }).sort((s1, s2) => {
          return s1.priority - s2.priority;
        })
      } else {
        return [];
      }
    }
  },
  
  actions: {
    setShowPosterVideo(value) {
      this.showPosterVideo = value;
    },
    
    setIsMuted(value) {
      this.isMuted = value;
    },
    
    changeCurrentWallpaper(wallpaper) {
      console.log(wallpaper);
      this.currentWallpaper = wallpaper;
    },
    
    pushPlaylist(playlist) {
      this.playlist = playlist;
    },
    
    changePlaylist(playlist) {
      this.playlist = playlist;
    },
    
    changeToolbarStatus(toolbarState) {
      this.toolbar = toolbarState;
    },
    
    loadSortInfo(sortInfo) {
      this.sortInfo = sortInfo;
    },
    
    loadCurrentUser(user) {
      this.currentUser = user;
    },
    
    loadCurrentAdmin(user) {
      this.currentAdmin = user;
    },
    
    loadWebInfo(webInfo) {
      webInfo.webTitle = webInfo.webTitle.split('');
      webInfo.notices = JSON.parse(webInfo.notices);
      this.webInfo = webInfo;
    },
    
    // 自动获取用户信息
    async autoFetchUserInfo() {
      const userToken = localStorage.getItem('userToken');
      if (!userToken || Object.keys(this.currentUser).length > 0) return;
      
      try {
        const res = await getCurrentUserInfo();
        if (res?.code === 200 && res.data) {
          this.loadCurrentUser(res.data);
        }
      } catch (e) {
        // if (e.message?.includes('401')) {
        //   localStorage.removeItem('userToken');
        //   localStorage.removeItem('freshToken');
        //   this.loadCurrentUser({});
        // }
      }
    },
    
    // 初始化
    async initStore() {
      await this.autoFetchUserInfo();
      window.addEventListener('ssoTokenUpdated', () => this.autoFetchUserInfo());
    }
  },
  
  persist: {
    storage: localStorage
  }
})
