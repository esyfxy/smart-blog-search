<template>
  <div id="viewMusicBar" class="viewMusicBar" ref="viewMusicBar" :class="{bottomStyle:attr.bottomStyle?true:false}">
    <div id="viewMusic" ref="viewMusic">
      <div id="JMusic" ref="JMusic" class="showclass">
      <audio id="JAudio" crossorigin="anonymous" ref="audio" :src="nowplay.song.url" :autoplay="isplay"></audio>
      <img class="jpicture" :src="nowplay.song.poster"/>
      <div class="jshow">
        <div class="jpart1">
          <p class="p1Title">{{nowplay.song.title}}</p>
          <p class="p1Author"><font :key="aindex" v-for="(author,aindex) of nowplay.song.author">{{author.name}}/</font></p>
        </div>
        <div class="jpart2">
          <div class="p2Gun"></div>
          <div class="p2Stick" ref="p2Stick">
            <div class="stick_cover" ref="stick_cover"></div>
            <div class="stick_point" ref="stick_point"></div>
          </div>
          <a class="p2Time" ref="p2Time" @click="download()" title="点击可下载">{{showObject.curr}}</a>
          <div class="jpart3">
            <div class="p3Before" @click="correctSong('left')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"/></svg>
            </div>
            <div class="p3Play" @click="play()" ref="p3Play">
              <svg t="1557033482333" class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1095"><path d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z" fill p-id="1096" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"/></svg>
            </div>
            <div class="p3Next" @click="correctSong('right')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"/></svg>
            </div>
            <div class="jvolume" ref="jvolume">
              <svg  @click="JMusicObject.audio.muted = false;vif.muted=false" v-if="vif.muted" t="1626430140328" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9051"><path d="M512 691.2c6.4-99.2 89.6-179.2 192-179.2h6.4V134.4l-246.4 246.4H249.6v265.6h214.4l48 44.8z" fill="#707070" p-id="9052"></path><path d="M627.2 585.6l-22.4 22.4-22.4 22.4 73.6 73.6-73.6 73.6 22.4 22.4 22.4 22.4 73.6-73.6 76.8 73.6 22.4-22.4 22.4-22.4-73.6-73.6 73.6-73.6-22.4-22.4-22.4-22.4-76.8 73.6z" fill="#707070" p-id="9053"></path></svg>
              <svg @click="JMusicObject.audio.muted = true;vif.muted=true" v-if="!vif.muted" t="1626427775189" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2885" ><path d="M537.6 145.066667L554.666667 128v768l-85.333334-85.333333-298.666666-298.666667 64-64 302.933333-302.933333zM469.333333 341.333333l-166.4 170.666667 166.4 170.666667V341.333333z m170.666667-123.733333c145.066667 21.333333 256 145.066667 256 294.4s-110.933333 273.066667-256 294.4v-85.333333c98.133333-21.333333 170.666667-106.666667 170.666667-209.066667s-72.533333-187.733333-170.666667-209.066667v-85.333333z m0 128c72.533333 17.066667 128 85.333333 128 166.4s-55.466667 145.066667-128 166.4v-89.6c25.6-12.8 42.666667-42.666667 42.666667-72.533333s-17.066667-59.733333-42.666667-72.533334V345.6z" fill="#444444" p-id="2886"></path></svg>
              <input type="range" value=1 min=0 max=1 step=0.1  v-model="JMusicObject.audio.volume"  class="input_volume" />
            </div>
            <div class="p3List" @click="selectList()" @click.right.prevent="vif.cplaylist=true">
              <svg  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 22 32"><path d="M20.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM1.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM20.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z" /></svg>
            </div>
          </div>
        </div>
      </div>
      <div class="jhide" ref="jhide" @click.right.prevent="vif.vsetAttr=true">
        <svg  xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z" /></svg>
      </div>
      <div class="jdialog dialog-clist" v-if="vif.cplaylist" @click="vif.cplaylist=false">
        <input type="text" class="dialog-line" placeholder="更换歌单" v-model="attr.playlist" @click.stop="" @keydown.enter="unshiftPlaylist()"/>
      </div>
      <div class="jdialog dialog-slist" v-if="vif.vsetAttr" @click="vif.vsetAttr=false">
        <input type="checkbox" class="dialog-line"  v-model="attr.bottomStyle" @click.stop=""  /> 底部
        <input type="checkbox" class="dialog-line"  v-model="attr.shakeMusic" @click.stop=""  /> 音乐可视化
      </div>
    </div>
        <div class="jlists" ref="JLists">
          <div :class="[(song==nowplay.song)?'jlists-playing':'','jlists_item']" :key="song.id" v-for="(song,index) in list.songs" @click="correctSong(index);">
            <font>{{ index + 1 }}</font> -
            <font>{{ song.title }}</font> -
            <font :key="aindex" v-for="(author,aindex) of song.author">{{author.name}}/</font>
          </div>
        </div>
        <canvas id="CANVAS" ref="canvas" v-show="attr.shakeMusic" :style="{'height': attr.shakeHeight}"></canvas>
        <div class="jlyric" :class="{fullLyric: customClass && customClass.fullLyric}" ref="JLyric">
          <div>
            <font :style="[{'height':attr.lyricheight+'px','line-height':attr.lyricheight+'px'}]" 
            :key="index" v-for="(item,index) of showObject.Lyrics" :class="item.classname">{{item.text}}
            </font>
          </div>
        </div> 
    </div>
    <div class="JBg" ref="JBg"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { useMainStore } from '../../store';

import { getPlayList, searchMusic } from '../../utils/api';


export default {
  components: {},
    setup() {
    const store = useMainStore();
    return { store };
  },
  
data() {
    return {
      JMusicObject:{audio:{volume:{},muted:false},JMshake:null},
      showObject:{curr:"00:00 / 00:00",Lyrics:new Array()},
      nowplay:{song:{},currentTime:0,duration:0},
      list:{songs:[],lyrics:[]},
      vif:{cplaylist:false,ischange:false,muted:false,vsetAttr:false},
      isplay:false,
      //可变属性
      attr:{playlist: null,bottomStyle:true,shakeHeight:"25vh",shakeMusic:false,lyricheight:26},
      attr_init:{playlist:null,bottomStyle:true,shakeHeight:"25vh",shakeMusic:false,lyricheight:26},
      customClass:{} // 不可变
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  mounted() {
    let that = this;
    this.JMusicObject.canvas = this.$refs.canvas;
    this.JMusicObject.audio = this.$refs.audio;
    this.setAttr();
    if(this.attr.shakeMusic){this.creCanvas();}
    this.creInterval();
    this.creEvent();
    window.baseAPIhandle.correctSong = {
      call: "baseAPIhandle.correctSong.handle('left')",
      arguments: 'data',
      desc: '操作歌曲播放顺序。data可以是left: 上一首歌；right: 下一首歌；index[number]: 指定播放索引。调用例子baseAPIhandle.correctSong.handle(1)',
      handle: function (data) {
        that.correctSong(data);
      }
    };
    window.baseAPIhandle.searchSong = {
      call: 'baseAPIhandle.searchSong.handle(data)',
      arguments: 'data',
      desc: `点歌、搜索播放歌曲,参数：data = {key="歌曲名"}。调用：baseAPIhandle.searchSong.handle({key:"歌曲名"})`,
      handle: function (data) {
        that.searchSong(data);
      }
    };
    window.baseAPIhandle.seachSongList = {
      call: 'baseAPIhandle.seachSongList.handle()',
      arguments: '',
      desc: `搜索歌单,data = {key="歌单名"},调用：baseAPIhandle.seachSongList.handle({key:"歌单名"})`,
      handle: function (data) {
        that.seachSongList(data);
      }
    };
    this.$nextTick(()=>{
      this.attr.playlist = localStorage.getItem("playlist")?.match(/^\d+$/)[0] || this.store.playlist;
      this.unshiftPlaylist();
      setTimeout(() => {   
        $(that.$refs.JMusic).toggleClass("showclass")
        $(that.$refs.JMusic).toggleClass("hideclass")
      }, 1000);
    })
  },
  watch: {
    "store.pushPlaylist": { //头插歌单
      immediate: true,
        handler(newValue, oldValue) {
          if (oldValue !== undefined) { 
            this.attr.playlist = this.store.pushPlaylist
            this.replayList(false)
          }
        },
    },
    "store.playlist": { // 尾插歌单
      immediate: true,
        handler(newValue, oldValue) {
          if (oldValue !== undefined) { 
            this.attr.playlist = this.store.playlist
            this.replayList(true)
          }
        },
    },
    'nowplay.song.lyrics'(to,from){
      this.standardLyric(this.nowplay.song.lyrics);
    },
    'list.songs'(to,from){
      if(!this.isplay) this.correctSong(0);
    },
    'attr.shakeMusic'(to,from){
      if(this.attr.shakeMusic&&!this.JMusicObject.JMshake){
        this.creCanvas();
      }
    },
    'isplay'(to,from){
      if(this.isplay){
        this.$refs.p3Play.innerHTML = '<svg t="1557034022257" class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1932" data-spm-anchor-id="a313x.7781069.0.i5"><path d="M597.333333 816.64 768 816.64 768 219.306667 597.333333 219.306667M256 816.64 426.666667 816.64 426.666667 219.306667 256 219.306667 256 816.64Z" p-id="1933" data-spm-anchor-id="a313x.7781069.0.i3"></path></svg>';
      } else {
        this.$refs.p3Play.innerHTML = '<svg t="1557033482333" class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1095"><path d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z" fill="" p-id="1096" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg>';
      }
    }
  },

  methods: {
    setJMusic(){
      $(this.$refs.viewMusic).css(css);
    },
    //适合load
    setAttrFromDocument(){
      if(!window.top.document){return false;} //无法获取父级窗口
      let father = $(window.top.document).find("[name='MUSIC']");
      const classList = $(father).attr("customClass").split(',');
      for (const classItem of classList) {
        const [key, value] = classItem.split('=');
        if (value) {
          this.customClass[key.trim()] = value.trim();
          this.attr[key.trim()] = value.trim(); 
        } else {
          this.customClass[key] = true;
          this.attr[key.trim()] = true;
        }
      }
      console.log(this.customClass);
      if(father.attr("playlist")){this.attr.playlist=$(father).attr("playlist")}
      return true;
    },
    setAttr(){
      if(this.setAttrFromDocument()){ return };//父元素name=MUSIC中找属性
      for(let key in top.JMusicAttr){ //顶级配置中找属性(可调式)
        this.attr[key] = top.JMusicObject[key];
        console.log(`配置 ${key} 成功"`);
      }
    },
    creCanvas(){
      try{	
        this.JMusicObject.JMshake = new JMshake(this.JMusicObject.canvas,this.JMusicObject.audio);
      } catch(e){console.log(e,"音乐可视化加载失败！");}
    },
    creInterval(){
        let that = this;
      	this.gunVal = setInterval(function(){//进度条
          if(!that.vif.ischange){
            that.nowplay.duration = that.JMusicObject.audio.duration || 59;
            that.nowplay.currentTime =  that.JMusicObject.audio.currentTime  || 0;
            let width = parseFloat($(that.$refs.p2Stick).eq(0).css("width"));
            let left = (that.nowplay.currentTime / that.nowplay.duration) *width;
            $(that.$refs.stick_point).css({"left":left+"px"});
            $(that.$refs.stick_cover).css({"width":left+"px"});
            $(that.$refs.p2Time).text(that.getTimeText(that.nowplay.currentTime) +" / "+ that.getTimeText(that.nowplay.duration));
          }
        },500);
        
        this.gunLyric = setInterval(function(){
          let now = $(".lyricgun" + Math.round(that.nowplay.currentTime) );
          if(now.length==0){} else {
            $(that.$refs.JLyric).find("div font").removeClass("lyricshow");
            now.addClass("lyricshow");
            let index =  $(that.$refs.JLyric).find("div font").toArray().indexOf(now[0]);
            $(that.$refs.JLyric).find("div").css("margin-top",-((index-1) * that.attr.lyricheight)+"px");
          }
        },500);
    },
    creEvent(){
      let that = this;
      this.JMusicObject.audio.onended = function(){
        that.correctSong("right");
      }
       this.$refs.p2Stick.onmousedown = function(e){
        that.vif.ischange = true;
        let sp = this;
        let jbg = that.$refs.JBg;
        jbg.style.display = "block";
        let l;
        let move = jbg.onmousemove = function(e){
          let offset = $(sp).offset();
          l = e.offsetX - offset.left;
          if(l<0) l = 0;
          if(l>sp.offsetWidth) return;
          that.$refs.stick_point.style.left = l+"px";
          that.$refs.stick_cover.style.width = l+"px";
        }
        let up = jbg.onmouseup = function(e){
          that.vif.ischange = false;
          jbg.style.display = "none";
          l = e.offsetX - $(sp).offset().left;
          that.$refs.stick_point.style.left = l+"px";
          that.$refs.stick_cover.style.width = l+"px";
          that.JMusicObject.audio.currentTime = that.JMusicObject.audio.duration*(l/sp.offsetWidth);
        }
      }
      this.$refs.jhide.onclick = function(e){
          $(that.$refs.JMusic).toggleClass("showclass")
          $(that.$refs.JMusic).toggleClass("hideclass")
          that.$refs.JLists.classList.remove("jlists_show");
      }
    },
    getTimeText(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.round(time % 60);
      return `${minutes}:${seconds}`;
    },
    correctSong(command){
        // 如果 command 是数字，直接使用该索引
        if (typeof command === 'number') {
          const targetIndex = command;
          if (targetIndex >= 0 && targetIndex < this.list.songs.length) {
            this.nowplay.song = this.list.songs[targetIndex];
          } else {
            console.warn(`索引 ${targetIndex} 超出范围，歌单长度为 ${this.list.songs.length}`);
            return;
          }
        } else {
          // 对于 "left" 和 "right"，需要找到当前歌曲的索引
          let index = this.list.songs.indexOf(this.nowplay.song);
          // 如果当前歌曲不在列表中，默认使用索引 0
          if (index === -1) {
            index = 0;
          }
          
          switch (command) {
            case "right":
              this.nowplay.song = (index==this.list.songs.length-1)?this.list.songs[0]:this.list.songs[index+1];
              break;
            case "left":
              this.nowplay.song = (index==0)?this.list.songs[this.list.songs.length-1]:this.list.songs[index-1];
              break;
            default:
              console.warn(`未知的 command: ${command}`);
              return;
          }
        }
        
        // 确保歌曲对象存在
        if (!this.nowplay.song) {
          console.error("无法设置播放歌曲：歌曲对象不存在");
          return;
        }
        
        if(this.nowplay.song.url==null){JMusicjsoup.getMp3Url(this.nowplay.song.id,this.nowplay.song);}
        if(this.nowplay.song.lyrics==null){JMusicjsoup.getLyric(this.nowplay.song.id,this.nowplay.song);}
    },
    play() {
      const audio = this.JMusicObject.audio;
      audio.paused ? 
      (audio.play(), this.isplay = true, this.attr.shakeMusic && this.JMusicObject.JMshake?.loadMusic()) 
      : (audio.pause(), this.isplay = false);
    },
    selectList(){
      $(this.$refs.JLists).toggleClass("jlists_show");
    },
    unshiftPlaylist(){
      this.replayList(false);
      localStorage.setItem("playlist",this.attr.playlist);
    },
    seachSongList(data) {
      data.type = 1000;
      let that = this;
      searchMusic(data).then((res) => {
        if (res.code == 200 && res.result && res.result.playlists && res.result.playlists.length > 0) {
          this.attr.playlist = res.result.playlists[0].id;
          return that.replayList(false);
        } else {
          console.error("搜索歌单失败:", res?.message || "未找到歌单");
          return Promise.reject(new Error("未找到歌单"));
        }
      }).then(() => {
        console.log("纠正指针");
        
        // 使用 $nextTick 确保 Vue 响应式更新完成
        that.$nextTick(() => {
          // 确保歌单已加载完成
          if (that.list.songs && that.list.songs.length > 0) {
            // 重置当前播放歌曲，避免索引错误
            that.nowplay.song = {};
            // 在 this.replayList 完成后执行，由于是头插(false)，索引0应该是新歌单的第一首歌
            that.correctSong(0);
            // 确保歌曲 URL 加载后再播放
            setTimeout(() => {
              if (!that.isplay) {
                that.play();
              }
            }, 100);
          } else {
            console.warn("歌单加载完成但歌曲列表为空");
          }
        });
      }).catch((error) => {
        console.error("播放歌单出错:", error);
      });
    },
    searchSong(data) {
      searchMusic(data).then((res) => {
        if (res.code == 200) {
          if (res.result.songs.length > 0) {
            const firstSong = res.result.songs[0];
            const newSong = {
              title: firstSong.name,
              id: firstSong.id,
              author: firstSong?.artists,
              poster: 'http://p1.music.126.net/QOIFWJbPPYeq2vMfxPs9Kg==/109951168065197411.jpg?param=180y180',
              url: null,
              lyrics: null,
              _unblockUrl: function (id, data) {
                this.url = data.url;
              },
              _setMp3Url: function (id, data) {
                if (data.data[0].freeTrialPrivilege.cannotListenReason || data.data[0].freeTrialInfo) {
                  JMusicjsoup.unblockUrl(id, this);
                } else {
                  this.url = data.data[0].url;
                }
              },
              _setLyric: function (id, data) {
                data.lrc ? (this.lyrics = data.lrc.lyric) : (this.lyrics = "[00:00.000] nothing...");
              },
            };
            let index = this.list.songs.indexOf(this.nowplay.song);
            // 如果当前歌曲不在列表中，默认插入到索引 0
            if (index === -1) {
              index = -1; // 这样 index + 1 = 0
            }
            const insertIndex = index + 1;
            this.list.songs.splice(insertIndex, 0, newSong);
            this.correctSong(insertIndex);
            if(!this.isplay) this.play();
          }
        }
      });
    },
    async replayList(axios = true) {
      try {
        const res = await getPlayList(this.attr.playlist);
        if (res && res.code == 200) {
          this._setPlayList(res, axios);
          console.log("填充完毕");
          return Promise.resolve();
        } else {
          console.error("获取歌单失败:", res?.message || "未知错误");
          return Promise.reject(new Error(res?.message || "获取歌单失败"));
        }
      } catch (error) {
        console.error("获取歌单出错:", error);
        return Promise.reject(error);
      }
    },
    standardLyric(lyric) {
      if(!lyric) return;
      const lyrics = lyric.split("\n");
      const timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/;
      const ended = [];
      const arrLyric = [];
      for (let i = 0; i < lyrics.length; i++) {
        const timeRegExpArr = lyrics[i].match(timeReg);
        if (!timeRegExpArr) continue;
        const clause = lyrics[i].replace(timeReg, '');
        const t = timeRegExpArr[0];
        const min = Number(t.match(/\[\d*/)[0].slice(1));
        const sec = Number(t.match(/\:\d*/)[0].slice(1));
        const time = min * 60 + sec;
        ended[time] = clause;
        arrLyric.push({
          text: clause || '  ',
          classname: `lyricgun${time}`
        });
      }
      this.showObject.Lyrics = arrLyric;
      return ended;
    },
    download() {
      const song = this.nowplay.song;
      if (!song || !song.url) {
        console.warn('无法下载：歌曲或URL不存在');
        return;
      }
      
      const title = song.title || '未知歌曲';
      const authorName = song.author && song.author.length > 0 ? song.author[0].name : '未知歌手';
      const fileName = `${title}-${authorName}.mp3`;
      
      // 处理URL，移除可能的协议前缀（如果存在）
      const mp3Url = song.url.startsWith('http://') || song.url.startsWith('https://') 
        ? song.url 
        : song.url.split(':').slice(-1)[0];
      
      fetch(mp3Url)
        .then(response => {
          if (!response.ok) throw new Error('下载失败');
          return response.blob();
        })
        .then(blob => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
          console.error('下载失败:', error);
          window.open(mp3Url, '_blank');
        });
    },
    _setPlayList(data, axios = true) {
      console.log("设置playlist", data, "axios:", axios);
      
      let res = data.playlist?.tracks;
      if (!res || res.length === 0) {
        console.warn("歌单数据为空");
        return;
      }
      
      let songs = new Array();
      for (let d = 0; d < res.length; d++) {
        let song = new Object();
        song.title = res[d].name;
        song.id = res[d].id;
        song.author = res[d].ar;
        song.poster = res[d].al.picUrl;
        song.url = null;
        song.lyrics = null;
        song._unblockUrl = function (id, data) {
          this.url = data.url;
        };
        song._setMp3Url = function (id, data) {
          if (data.data[0].freeTrialPrivilege.cannotListenReason || data.data[0].freeTrialInfo) {
            JMusicjsoup.unblockUrl(id, song);
          } else {
            this.url = data.data[0].url;
          }
        };
        song._setLyric = function (id, data) {
          data.lrc ? (this.lyrics = data.lrc.lyric) : (this.lyrics = "[00:00.000] nothing...");
        };
        songs.push(song);
      }

      let map = new Map();
      let new2;
      if (axios) {
        // 尾插：新歌单追加到旧歌单后面
        new2 = [...this.list.songs, ...songs].filter((item) => !map.has(item.id) && map.set(item.id, 1));
      } else {
        // 头插：新歌单插入到旧歌单前面
        new2 = [...songs, ...this.list.songs].filter((item) => !map.has(item.id) && map.set(item.id, 1));
      }
      this.list.songs = new2;
    },
  }
};
</script>

<style>
.viewMusicBar{
  height:100%;
  width:100%;
  min-height:80px;
  cursor:default;
}
#viewMusic{
	position : absolute;
  width:100%;
  height: 100%;
  top:0;left:0;
  min-height:64px;
}
#viewMusic p{
	margin: 0;
}
#JMusic{
	z-index:2;
	position : absolute;
	display : flex;
  width : 100%;
  height:100%;
  overflow:hidden;
	background:#fff;
  pointer-events: auto;
}
 #JAudio{
  display:none;
}
 .JBg{
  display: none;
	position:absolute;
  pointer-events: auto;
	z-index:999;
	left:0;
	top:0;
	height:100%;
	width:100%;
}
 .jpicture{
  min-width: 80px;
	height:100%;
}
 .jshow{
	padding: 0px 10px 0 10px;
	display:flex;
	flex:1;
  width: calc(100% - 80px - 20px);
	flex-direction:column;
}
 .jpart1{
	flex-direction:column;
	flex:1;
	width:100%;
}
 .p1Title{
	font-size:16px;
	color:#444;
}
 .p1Author{
	font-size:14px;
	color:#666;
}
 .p1Title,.p1Author{
	text-indent:.2rem;
  line-height: 1.5em;
	overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: .4s  ease-in-out;
}
 .jpart1 font:hover,.p1Title:hover,.p2Time:hover{
   color:#ff4777;
   transition: .4s  ease-in-out;
 }
 .jpart2{
	position:relative;
	display:flex;
	flex-wrap: nowrap;
  height: 50%;
	justify-content:space-around;
	align-items:center;
}
 .jpart3{
	display:flex;
}
 .p2Time{
	overflow:hidden;
	font-size:14px;
  text-align: center;
	min-width:80px;
	color:#666;
  cursor: pointer;
}
 .p2Stick{
	width:100%;
	height:5px;
	background-color:#666;
	position:relative;
}
 .stick_point{
	border: 1px solid #ccc;
	position:absolute;
	border-radius:50%;
	height:12px;
	width:12px;
	background:#eee;
	top:50%;
	transform:translate(0, -50%);
}
 .stick_point:hover{
	border: 1px solid #fe8e8e;
	transition:all 0.4s  ease-in-out ;
  cursor: pointer;
}
 .stick_cover{
	position:absolute;
	height:100%;
	background:#eee;
}
.p3Next, .p3Play, .p3Before, .p3List, .jvolume {
  display: flex;
	margin:auto;
	height:20px;
	width:20px;
	text-align:center;
}
 .p3Next svg,.p3Play svg,.p3Before svg,.jhide svg,.p3List svg{
	height:100% !important;
	width:100% !important;
}
 .p3Next{
	transform-origin: 50% 50% 0px;
	transform:rotateY(180deg);
}
.viewMusicBar .icon{
 width:20px !important;
}
.viewMusicBar svg {
  cursor:pointer;
}
.viewMusicBar svg path{
	transition:0.4s  ease-in-out ;
	fill:#888;
}
 .p3Before:hover svg path{
	fill:#db5a6b;
}
 .p3Play:hover svg path{
	fill:#a1afc9;
}
 .p3Next:hover svg path{
	fill:#60281e;
}
 .p3List:hover svg path{
	fill:#425066;
}
 .jhide:hover svg path{
	fill:#2e4e7e;
}
 .jvolume:hover svg path{
	fill:#2e7e71;
}
.jvolume:hover .input_volume{
  display: inline-block;
  height:10px;
}
.jvolume{
  position: relative;
}
.viewMusicBar .input_volume{
    position: absolute;
    display: none;
    height: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 80px;
    bottom: 100%;
    transform-origin: center center;
}
 .jhide{
	display:inline-block;
	width:20px;
	line-height:50px;
	height:100%;
	text-align:center;
	background:rgba(255,255,255,0.5);
}
 .hideclass{
	left:20px;
	transform: translate(-100%,0);
	transition:all 0.4s  ease-in-out ;
}
 .showclass{
	left:0;
	transform: translate(0,0);
	transition:all 0.4s  ease-in-out ;
}
 .showclass .jhide svg{
	transform-origin: 50% 50% 0px;
	transform:rotateY(180deg);
	transition:all 0.4s  ease-in-out ;
}
.jlyric{
    position: absolute;
    z-index: 1;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events:none;
}
.jlyric.fullLyric{
  width: 100vw;
}
 .lyricshow{
	font-size:1.2em !important;
	opacity:1 !important;
}
 .jlyric > div{
    text-align: center;
    transition: all 0.4s  ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top:0px;
}
 .jlyric font{
	width:100%;
	color:#fff;
	text-shadow: 0 1px 5px #000;
	overflow:hidden;
	font-size:1em;
	opacity:.5;
}
 .jlists{
  z-index:1;
	opacity:0;
	width:100%;
	position:absolute;
	left:0px;top:100%;
	background:#fff;
	max-height: 0px;
	overflow:hidden;
	overflow-y:scroll;
  transition: .4s  ease-in-out ;
}
 .jlists_item{
	height:28px;
	width:100%;
	font-size:14px;
	line-height:28px;
	text-indent:1em;
	color:#444;
	cursor:pointer;
	transition:all 0.4s  ease-in-out ;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
 .jlists_item:hover{
  background:rgb(214, 214, 214);
	transition:all 0.4s  ease-in-out ;
}
 .jlists-playing::before{
   width:6px;
   height:100%;
   position: absolute;
   content:"";
   left:0;
   transition: .4s  ease-in-out;
   background: #8ea9a7;
 }
 .jlists-playing{
  position: relative;
	background:rgb(214, 214, 214);
	transition:all 0.4s  ease-in-out ;
}
 .jlists_show{
	opacity:1;
	max-height:200px;
	pointer-events: auto;
}
.viewMusicBar.bottomStyle #viewMusic{
	bottom:0;top:unset;
}
.viewMusicBar.bottomStyle .jlists{
	top:0 !important;
  transform: translate(0,100%);
  transition: .4s  ease-in-out;
}
.viewMusicBar.bottomStyle .jlists.jlists_show{
  transform: translate(0,-100%) !important;
  transition: .4s  ease-in-out;
}
.viewMusicBar.bottomStyle  #CANVAS{
	bottom:0;
  left:0;
  top:unset;
	transform: none !important;
}
 .jlists::-webkit-scrollbar{
	width: 4px;
}
 .jlists::-webkit-scrollbar-thumb{
	border-radius: 10px;
	box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	background: rgba(0,0,0,0.2);
}
.jlists::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0,0,0,0.0);
}
#CANVAS{
  z-index: 0;
	position: absolute;
	top:0;left:0;
  width:100%;
  transform: rotate(180deg);
  pointer-events: none;
}
.jdialog input{
  outline: none;
  border: none;
}
.dialog-clist,.dialog-slist{
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width:100%;
  height:100%;
  z-index: 50;
  color:#FFF;
  background: rgba(0, 0, 0, 0.3);;
}
.dialog-clist .dialog-line{
  width:300px;
  height:28px;
  line-height: 28px;
  text-indent: 1.2rem;
}
@media screen and (max-width: 600px) {
}
</style>
