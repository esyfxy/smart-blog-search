<template>
  <div>
    <loader :loading="loading">
      <!-- 加载页面 -->
      <template slot="loader">
        <div>
          <zombie></zombie>
        </div>
      </template>
      <!-- 内容页面 -->
      <template slot="body">
        <!-- 首页图片 -->
        <el-image style="animation: header-effect 2s"
                  class="background-image"
                  :src="albumPoster"
                  @click="albumItems = albumItemsASync"
                  fit="cover">
          <div slot="error" class="image-slot background-image-error"></div>
        </el-image>
        <!-- 首页文字 -->
        <div class="signature-wall myCenter my-animation-hideToShow">
          <h1 class="playful">
            <span v-for="(a, index) in albumTitle" :key="index">{{a}}</span>
          </h1>
          <div class="printer" @click="getGuShi()">
            <printer :printerInfo="printerInfo">
              <template slot="paper" slot-scope="scope">
                <h3>
                  {{ scope.content }}<span class="cursor">|</span>
                </h3>
              </template>
            </printer>
          </div>
          <input class="webUrlInput" v-if="$route.query.type === 'web'" v-model="webType.url" @keydown.13="getWeb">
          <div id="bannerWave1"></div>
          <div id="bannerWave2"></div>
          <i class="el-icon-arrow-down" @click="navigation('.page-container-wrap')"></i>
        </div>
        <div class="page-container-content"  v-show="albumContent">
            <div class="aurora-content" v-html="albumContent"></div>
        </div>
        <!-- Aurora首页内容 -->
        <div class="page-container-wrap" v-if="!$route.query.type">
          <div class="grid grid-album" ref="grid">
            <div  :key="item.picUrl"   @click="item?.click($event)" class="grid-item grid-item-album" v-for="(item, index) in albumItems" :href="item" target="_blank"
              :overtip="`+ ${albumItems.length-9}`"
              :data-sub-html="albumItems[index]?.note?`<a target=_blank href=/album?type=aurora&id=${articles[index].id}>${albumItems[index]?.note}</a>`:'NO NOTE'"
              data-fb-html='是否需要添加评论功能呢？'
              :data-src="item.picUrl" 
              >
                <div class="imgbox" style="position: relative;overflow: hidden;display: flex;border-radius: 14px;">
                  <div class="imgAlt">
                    {{albumItems[index]?.note}}
                  </div>
                  <img  target="_blank" :title="albumItems[index]?.note"  
                  onerror="this.src='https://cdn.seovx.com/d/?mom=302'" 
                  class="lazyload_images" :data-src="item.picUrl" 
                  v-lazy="checkImage(item,index)" alt="">
                </div>
                <span @click.stop="routerAurora(articles[index].id)">{{item?.note}}</span>
              </div>
            <div class="grid-sizer"></div>
          </div>
          <div class="pagination-wrap">
            <div @click="pageArticles()" class="pagination"  v-if="pagination.total !== articles.length">
              下一页
            </div>
            <div v-else style="user-select: none">
              ~~到底啦~~
            </div>
          </div>
        </div>
        <!-- 图片列表 -->
        <div class="page-container-wrap"  v-if="$route.query.type">
          <div class="grid" ref="grid">
            <a  class="grid-item" :key="item.picUrl" v-for="(item, index) in albumItems" 
              :href="checkImage(item,index)" target="_blank"
              :overtip="`+ ${albumItems.length-9}`"
              :data-sub-html="item?.note||item.picUrl"
              @click="item?.click && item.click($event);"
              @mouseenter="item?.mouseOn && item?.mouseOn()" 
              data-fb-html='是否需要添加评论功能呢？'
              >
                <div class="imgbox" style="position: relative;overflow: hidden;display: flex;border-radius: 14px;">
                  <div class="imgAlt">
                    {{item?.note}}
                  </div>
                  <img  target="_blank" :title="item?.note" 
                  onerror="this.src='https://agentestudio.com/uploads/post/image/69/main_how_to_design_404_page.png'" class="lazyload_images" 
                  v-lazy="checkImage(item,index)"   alt="">
                </div>
                
            </a>
            <div class="grid-sizer"></div>
        </div>
        <div class="pagination-wrap">
          <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
        </div>
        <!-- 页脚 -->
        <div style="background: var(--background)">
          <myFooter></myFooter>
        </div>
      </template>
    </loader>
  </div>
</template>
<script>
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import sourceHandle from '../utils/sourceHandle'
const loader = () => import( "./common/loader");
const zombie = () => import( "./common/zombie");
const printer = () => import( "./common/printer");
const myFooter = () => import( "./common/myFooter");
import jmcomic from '../assets/json/jmcomiccity.json' 
export default {
  components: {
    loader,
    zombie,
    printer,
    myFooter,
  },

  data() {
    return {
      loading: false,
      albumLoading:true,
      showAside: true,
      albumTitle:"动态相册",
      albumPoster:this.$constant.two_poem_image[0],
      printerInfo: "你看对面的青山多漂亮",
      pagination: {
        current: 1,
        size: 30,
        total: 0,
        keywords: ""
      },
      guShi: {
        "content": "",
        "origin": "",
        "author": "",
        "category": ""
      },
      options: {
        // Masonry 布局选项
        gutter: 10,
        columnWidth: '.grid-item',
        itemSelector: '.grid-item',
        percentPosition: true,
      },
      routerMap:{
        "aurora":this.getAurora,
        "acg":this.getRandom,
        "web":this.getWeb,
        "dynamic":this.getDynamic,
        "origin":this.getOrigin
      },
      webType:{
        url:this.$route.query.url || "https://www.roginx.ink/v/daily_picture.html" || "https://www.evacg.cc/"
      },
      articles: [],
      albumItems:[],
      albumItemsASync:[],
      albumContent:undefined,
      masonry: null,
      dynamicGallery: undefined
    };
  },

  watch: {
    '$route.query': {
      handler(newQuery, oldQuery) {
        this.albumItems.length = 0;
        this.getGuShi();
        this.pagination.size = this.$route.query.type?10:30;
        if(!this.$route.query.type){
          this.getArticles();
        } else {
          try {
            this.routerMap[this.$route.query.type]("");
          } catch (error) {
            this.$message({
              message: "错误的路由!",
              type: "error"
            });
          }
        }
      },
      immediate: true // 立即执行一次handler
    }
  },
  mounted() {
    // this.$common.loadAssets([{type:"js",src:"https://fastly.jsdelivr.net/npm/lightgallery@2.7/lightgallery.min.js"}]);
  },
  updated(){
    // this.albumLoading = true;
    // this.masonry = new Masonry(this.$refs.grid, this.options);
    // // 监听图片加载完成事件，重新布局
    // imagesLoaded(this.$refs.grid, () => {
    //   this.albumLoading = false;
    //   this.masonry.layout();
    //   this.$nextTick(()=>{
    //     try {
    //       top.dynamicGallery?.destroy();
    //     } catch (error) {
          
    //     }
    //     top.dynamicGallery = lightGallery(this.$refs.grid,{
    //       plugins: [lgHash,lgRotate,lgVideo,lgZoom,lgFullscreen,lgAutoplay,lgComment],
    //       mode: 'lg-slide',
    //       cssEasing: 'ease',
    //       commentBox: true,
    //       fbComments: true,
    //       galleryId:1,
    //       speed: 300
    //     });
    // })
    // })
  },

  methods: {
    checkImage:  function(item,index){
      let src = item.picUrl; let note = item.note;
      if(note?.slice(0, 4)=="NSFW"&&!this.$route.query.NSFW) 
        return 'https://gd-hbimg.huaban.com/9d4628a3c336c8c816366d7f8b6a7937cd2b3b74c9bd4-KYmhYR_fw658webp'
      else 
        return src?.indexOf('qiniu.roginx.ink')!=-1?src+'-album':src
    },
    reInitGallery(){
      this.$nextTick(()=>{
          try {
            top.dynamicGallery?.destroy();
          } catch (error) {
            
          }
          top.dynamicGallery = lightGallery(this.$refs.grid,{
            plugins: [lgHash,lgRotate,lgVideo,lgZoom,lgFullscreen,lgAutoplay,lgComment],
            mode: 'lg-slide',
            cssEasing: 'ease',
            commentBox: true,
            fbComments: true,
            galleryId:1,
            speed: 300
          });
      })
    },
    checkPicture(){
      let thi = this;
      this.albumLoading = true;
      let masonryInterval;
      this.masonry = new Masonry(this.$refs.grid, this.options);
      this.reInitGallery();
      masonryInterval = setInterval(() => {
        this.masonry.layout();
        this.masonry.getItemElements().forEach((item) => {
          const img = item.querySelector('img');
          if (img) {
            if (!img.complete) {
              // 如果图片还没有加载完成，则等待图片加载完成后再判断图片宽度
              img.onload = () => {
                console.log("图片已加载");
                if (img.naturalWidth < 160 || img.naturalHeight < 100) {
                  if(this.$route.query.type) this.masonry.remove(item);
                }
              };
            } else if (img.naturalWidth < 160 || img.naturalHeight < 100) {
              if(this.$route.query.type) this.masonry.remove(item);
            }
          }
        });
      }, 1250);
      // 监听图片加载完成事件，重新布局
      imagesLoaded(this.$refs.grid, () => {
        this.masonry = new Masonry(this.$refs.grid, this.options);
        this.albumLoading = false;
        this.reInitGallery();
      })
    },
    pageArticles() {
      this.pagination.current = this.pagination.current + 1;
      if(!this.$route.query.type){
        this.getArticles();
      } else {
        try {
          this.routerMap[this.$route.query.type]();
        } catch (error) {
          this.$message({
            message: "错误的路由!",
            type: "error"
          });
        }
      }
    },
    getOrigin(){
      let list = []
      let objList = []
      const newHost = new URL(jmcomic.bookSourceUrl).host;
      if(!this.$route.query.keywords) {
        setTimeout(() => {
          this.$message({
            message: "你知道嘛，你误入歧途了！我不打算给你返回任何内容~",
            type: "error"
          });
        }, 1000);
        return;
      }
      sourceHandle.ruleSearch(jmcomic,this.$route.query.keywords).then((res)=>{
        list = sourceHandle.selector(res,jmcomic.ruleSearch.bookList);
        list[0].toArray().forEach((item,index)=>{
          objList.push(sourceHandle.getBookPreview($(item),jmcomic.ruleSearch))
        });
        let obj = [{}]
        obj = objList.map((image) => {
          return {
            note:image.name,
            picUrl:image.coverUrl?.replace(window.location.host,newHost),
            click:(e)=>{
              let url = jmcomic.contentUrl?.replace("${id}",image.id);
              const newUrl = this.$router.resolve({
                path: '/album',
                query: {
                  type: 'web',
                  url: url,
                  selector: jmcomic.ruleContent.items,
                  decodeImage: true,
                }
              }).href;
              window.open(newUrl, '_blank');
            }
          };
        });
        this.albumItems = obj;
        setTimeout(() => {
          this.checkPicture();
        }, 1000);
        })
    },
    getWeb(){
      let thi = this;
      this.albumTitle = "网页图片加载中...";
      return fetch(`/api/scrape?url=${encodeURIComponent(this.webType.url)}`, {
        method: 'GET',
      })
        .then(response => response.text())
        .then(html => {
          this.albumItems = [];
          html = html?.replace(/<script.*?<\/script>/gs, '')// 替换所有的带有 class 属性的标签
            let doc = $(html);
            let obj = [{}]
            let images;
            const newHost = new URL(this.webType.url).host;
            if(this.$route.query.selector){
              let images = sourceHandle.attr(doc,this.$route.query.selector);
              obj = images.toArray().map((item,index) => {
                return {
                  note:item,
                  picUrl:item?.replace(window.location.host,newHost),
                  decodeImage:this.$route.query.decodeImage,
                  decode:function(isEnd){
                    if(thi.albumItems[index].decodeImage != "true") return;
                    sourceHandle.decodeImage(item,function(newImage){
                      thi.albumItems[index].decodeImage = false;
                      thi.albumItems[index].picUrl = newImage;
                      thi.albumItems[index+1].decode(thi.albumItems.length == index + 1);
                      thi.checkPicture()
                    })
                  }
                }
              });
            } else {
              images = doc.find("img").toArray();
              obj = images.map((image) => {
                let src = $(image)?.attr("data-original") || image.src
                return {
                  note:image.alt,
                  picUrl:src?.replace(window.location.host,newHost)
                }
              });
            }
            this.albumTitle = $(html).filter('title').text();
            this.albumPoster = obj[Math.floor(obj.length / 2)].picUrl;
            this.albumItems = obj;
            this.albumItems[0].decode?.();
            setTimeout(() => {
              this.checkPicture();
            }, 1000);
            return doc;
        })
        .catch(error => console.error(error));
    },
    getRandom(){
      this.albumTitle = "网页图片加载中...";
      let obj = [{}]
      obj =  new Array(this.$route.query.num??20);
      for(let index=0;index<obj.length;index++){
        obj[index] = {
          picUrl:this.$route.query.api??this.$constant.ACGAPI[this.$route.query.cannel??0]+"?id="+index, 
          note:"这是随机图片"
        }
      }
      this.albumTitle = "随机二次元图片";
      this.albumPoster = this.$route.query.api??this.$constant.ACGAPI[this.$route.query.cannel??0];
      this.albumItems = obj;
      setTimeout(() => {
        this.checkPicture();
      }, 1000);
    },
    getAurora(){
      this.albumTitle = "网页图片加载中...";
      this.$http.get(`/aurora/get/work/pt/${this.$route.query.id}`)
        .then((res) => {
          if (!this.$common.isEmpty(res)) {
            document.title = res.title;
            this.albumTitle = res.title;
            this.albumContent = res.content;
            let items = JSON.parse(res.picture);
            let obj = [];
            obj.push(...items[0].map((picUrl, index) => ({ picUrl: picUrl, note: items[1][index]})))
            this.albumItems = obj;
            this.albumPoster = res.poster;
            this.checkPicture();
            this.$store.commit("pushPlaylist",res.content?.match(/playlist=(\d+)/)[1]);
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    getArticles() {
      this.$http.get(`/aurora/search/works/pt?type=1&point=pt&start=${(this.pagination.current-1)*this.pagination.size}&num=${this.pagination.size}&keys=${this.pagination.keywords}`)
        .then((res) => {
          if (!this.$common.isEmpty(res)) {
            this.albumTitle = "图册集";
            this.articles = this.articles.concat(res[0].filter(item=>{ return item.adm === 0}));
            this.pagination.total = res[1].total;
            let obj = this.articles.map(article => {
              return {
                picUrl:article.poster,
                note:article.title
              }
            });
            this.albumItems = obj;
            this.checkPicture();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    getDynamic() {
      this.secret ? "": this.secret = prompt("请输入密码（可以猜一猜😀", "");
      if(this.secret!="3612") {
        this.$message({
          message: "密码错误啦!我将对你进行传送😆！",
          type: "error"
        });
        setTimeout(() => {
          window.location.href=`/album?type=aurora&id=196` 
          // window.location.href=`/album?type=aurora&id=${ Math.floor(Math.random() * 200) + 1}` 
        }, 3000);
        return;
      };
      this.$http.post(this.$constant.baseURL + "/diary/listArticle", this.pagination)
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.albumTitle = "动态相册";
            this.articles = this.articles.concat(res.data.records);
            this.pagination.total = res.data.total;
            let obj = [{}]
            this.articles.forEach(artcile => {
              let items = JSON.parse(artcile.articleItems)
              obj.push(...items[0].map((picUrl, index) => ({ picUrl: picUrl, note: items[1][index]})))
            });
            this.albumItems = obj;
            this.checkPicture();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    navigation(selector) {
      let pageId = document.querySelector(selector);
      window.scrollTo({
        top: pageId.offsetTop,
        behavior: "smooth"
      });
    },
    getGuShi() {
      let that = this;
      let xhr = new XMLHttpRequest();
      xhr.open('get', this.$constant.jinrishici);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          that.guShi = JSON.parse(xhr.responseText);
          that.printerInfo = that.guShi.content;
        }
      };
      xhr.send();
    },
    routerAurora(auroraId){
      this.$router.push({ path: '/album', query: { ...this.$route.query,id:auroraId,type:'aurora' } })
      // window.open(url)
    }
  }
}
</script>
<style>
.page-container-content{
  background: var(--background);
  padding: 25px 15px;
  margin-top: -3px;
}
.page-container-content .aurora-content{
  margin: auto;
  max-width: 800px;
}
.grid{
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  background-color: var(--background);
  animation: zoomIn 0.8s ease-in-out;
}
.webUrlInput{
  outline: none;
  border: none;
  color: #ffffffbf;
  text-align: center;
  background: none;
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  letter-spacing: 1px;
  width: 300px;
  padding: 20px 8px 8px 8px;
  transition: .3s;
  border-bottom: 3px solid transparent;
}

.webUrlInput:hover,.webUrlInput:focus{
  color: #FFF;
  left: 0;
  border-bottom: 3px solid #FFF;
}
.grid.loadding .grid-item{
  opacity: 0;
  animation: zoomIn 0.8s ease-in-out;
}
.grid-item{
  animation: zoomIn 0.8s ease-in-out;
  display: block;
  position: absolute;
  width: calc(20% - 10px);
  cursor: zoom-in;
  margin-bottom: 12px;
  min-width: 100px;
  min-height: 80px;
  overflow: hidden;
}
.grid-item-album{
  background: none !important;
}
.grid-item-album span:hover{
  color:var(--themeBackground);
  transition: .3s;
}
.grid-item-album span {
  transition: .3s;
  cursor: pointer;
  margin-top:6px;
  margin-bottom: 15px;
  line-height: 20px;
  display: block;
  color:var(--fontColor);
}
.grid-item .imgAlt{
  cursor: pointer;
  position: absolute;
  width:100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 0;
  background-color: var(--mask);
  color:white;
  pointer-events:none;
  transition: .3s;
}
.grid-item:hover .imgAlt{
  opacity: 1;
  transition: .3s;
}
.grid-item img{
  background-color: var(--lightGray);
  width: 100%;
  height: 100%;
}
.grid-sizer{
  width: 20%;
}
.grid-item--width2 { width: 160px; }
.grid-item--height2 { height: 140px; }


.signature-wall {
    /* 向下排列 */
    display: flex;
    flex-direction: column;
    position: relative;
    user-select: none;
    height: 100vh;
    overflow: hidden;
  }

  .playful {
    color: var(--white);
    font-size: 40px;
  }
  .printer {
    cursor: pointer;
    color: var(--white);
    background: var(--translucent);
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  #bannerWave1 {
    height: 84px;
    background: var(--bannerWave1);
    position: absolute;
    width: 200%;
    bottom: 0;
    z-index: 10;
    animation: gradientBG 120s linear infinite;
  }

  #bannerWave2 {
    height: 100px;
    background: var(--bannerWave2);
    position: absolute;
    width: 400%;
    bottom: 0;
    z-index: 5;
    animation: gradientBG 120s linear infinite;
  }

  /* 光标 */
  .cursor {
    margin-left: 1px;
    animation: hideToShow 0.7s infinite;
    font-weight: 200;
  }

  .el-icon-arrow-down {
    font-size: 40px;
    font-weight: bold;
    color: var(--white);
    position: absolute;
    bottom: 60px;
    animation: my-shake 1.5s ease-out infinite;
    z-index: 15;
    cursor: pointer;
  }

  .page-container-wrap {
    background: var(--background);
    position: relative;
    transition: .5s;
  }

  .page-container {
    display: flex;
    justify-content: center;
    width: 90%;
    padding: 0 20px 40px 20px;
    margin: 0 auto;
    flex-direction: row;
  }

  .recent-posts {
    width: 70%;
  }

  .announcement {
    padding: 22px;
    border: 1px dashed var(--lightGray);
    color: var(--greyFont);
    border-radius: 10px;
    display: flex;
    max-width: 780px;
    margin: 40px auto 40px;
  }

  .announcement i {
    color: var(--themeBackground);
    font-size: 22px;
    margin: auto 0;
    animation: scale 0.8s ease-in-out infinite;
  }

  .announcement div div {
    margin-left: 20px;
    line-height: 30px;
  }

  .aside-content {
    width: calc(30% - 40px);
    user-select: none;
    margin-top: 40px;
    margin-right: 40px;
    max-width: 300px;
    float: right;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }
  .aside-content-myAside{
    position: sticky;
    top: 10px;
  }
  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }

  @media screen and (max-width: 1100px) {
    .recent-posts {
      width: 100%;
    }

    .page-container {
      width: 100%;
    }
  }

  @media screen and (max-width: 1000px) {

    .page-container {
      /* 文章栏与侧标栏垂直排列 */
      flex-direction: column;
    }

    .aside-content {
      width: 100%;
      max-width: unset;
      float: unset;
      margin: 40px auto 0;
    }
  }

  @media screen and (max-width: 768px) {
    .grid-item{
      width: calc(50% - 10px);
    }
    .grid-sizer{
      width: 50%;
    }
    h1 {
      font-size: 35px;
    }
  }
  
  </style>