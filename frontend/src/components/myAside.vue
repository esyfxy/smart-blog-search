<template>
  <div>
    <!-- 搜索框 -->
    <div  class="card-content0">
      <form @submit.prevent="goSearch()" style="position: relative;">
        <input type="text" v-model="keywords"  placeholder="搜索从这里开始...">
        <button type="submit"></button>  
      </form>
    </div>
    <!-- 网站信息 -->
    <div class="card-content1 shadow-box background-opacity">
      <span @click="$router.push({ path: '/love'})">
        <el-avatar style="margin-top: 20px" class="user-avatar" :size="120" :src="webInfo.avatar" ></el-avatar>
      </span>
      <div class="web-name" @click="$router.push({ path: '/izone'})">{{webInfo.webName}}</div>
      <div class="web-info">
        <div class="blog-info-box">
          <span>文章</span>
          <span class="blog-info-num">{{ store.articleTotal }}</span>
        </div>
        <div class="blog-info-box">
          <span>分类</span>
          <span class="blog-info-num">{{ sortInfo.length }}</span>
        </div>
      </div>
      <div class="more-cannal">
        <a ks-text="Github" ks-tag="top" href="https://github.com/janxland" target="_blank" ><i class="fa fa-github" style="background-color: #000;" aria-hidden="true"></i></a>
        <a ks-text="Twitter" ks-tag="top" href="" target="_blank"><i class="fa fa-twitter" style="background-color: #1d9bf0;" aria-hidden="true"></i></a>
        <a ks-text="微信" ks-tag="top" href="https://qiniu.roginx.ink/im/groupMessage/janx11703486179793311" target="_blank"><i class="fa fa-wechat" style="background-color: #1aad19;" aria-hidden="true"></i></a>
        <a ks-text="不存在的爱情" ks-tag="top" href="/love" target="_blank"><svg t="1684803256273" style="background-color: #f25d64"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2413"><path d="M436.492516 162.206151c44.159431 35.26656 106.850987 35.26656 151.012693 0 110.437262-88.243769 260.100551-73.525476 343.442773-1.470009 104.741547 90.551182 104.741547 271.653547 0 452.753636-63.567644 117.766827-213.742933 235.531378-354.957084 323.7888a120.973084 120.973084 0 0 1-127.984071 0C306.792676 849.021156 156.615111 731.256604 93.047467 613.489778c-104.736996-181.100089-104.736996-362.202453 0-452.753636 83.344498-72.055467 233.007787-86.77376 343.445049 1.470009z" fill="#ffffff" p-id="2414" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg></a>
        <a ks-text="Bilibili" ks-tag="top" href="https://space.bilibili.com/11363292" target="_blank"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="background-color: #f25d8e"><path d="M777.514667 131.669333a53.333333 53.333333 0 0 1 0 75.434667L728.746667 255.829333h49.92A160 160 0 0 1 938.666667 415.872v320a160 160 0 0 1-160 160H245.333333A160 160 0 0 1 85.333333 735.872v-320a160 160 0 0 1 160-160h49.749334L246.4 207.146667a53.333333 53.333333 0 1 1 75.392-75.434667l113.152 113.152c3.370667 3.370667 6.186667 7.04 8.448 10.965333h137.088c2.261333-3.925333 5.12-7.68 8.490667-11.008l113.109333-113.152a53.333333 53.333333 0 0 1 75.434667 0z m1.152 231.253334H245.333333a53.333333 53.333333 0 0 0-53.205333 49.365333l-0.128 4.010667v320c0 28.117333 21.76 51.157333 49.365333 53.162666l3.968 0.170667h533.333334a53.333333 53.333333 0 0 0 53.205333-49.365333l0.128-3.968v-320c0-29.44-23.893333-53.333333-53.333333-53.333334z m-426.666667 106.666666c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z m320 0c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z" fill="#fff"></path></svg></a>
        <a ks-text="QQ联系" ks-tag="top" href="tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=983341575" target="_blank"><i class="fa fa-qq" style="background-color: #12b7f5;"></i></a>
        <a ks-text="RSS订阅" ks-tag="top" href="" target="_blank"><i class="fa fa-rss" style="background-color: #ff9800"></i></a>
      </div>
      <a class="collection-btn" @click="$router.push({path: '/izone'});">
        <i class="el-icon-star-off" style="margin-right: 2px"></i>个人空间
      </a>
      <a class="collection-btn" @click="$router.push({path: '/album',query:{type:'dynamic'}});">
        <i class="el-icon-star-off" style="margin-right: 2px"></i>动态相册
      </a>
      
    </div>    
    <!-- 分类 -->
    <div class="shadow-box background-opacity wow"
         style="padding: 25px 25px 5px;border-radius: 10px;animation: zoomIn 0.8s ease-in-out">
      <div class="card-content2-title">
        <i class="el-icon-folder-opened card-content2-icon"></i>
        <span>分类</span>
      </div>
      <div v-for="(sort, index) in sortInfo"
           :key="index"
           class="post-sort"
           @click="$router.push({path: '/sort', query: {sortId: sort.id}})">
        <div>
          <span v-for="(s, i) in sort.sortName.split('')" :key="i">{{ s }}</span>
        </div>
      </div>
    </div>
    <!-- 推荐文章 -->
    <div v-if="!$common.isEmpty(recommendArticles)"
         style="padding: 25px;border-radius: 10px;margin-top: 15px;animation: zoomIn 0.8s ease-in-out"
         class="shadow-box background-opacity wow">
      <div class="card-content2-title">
        <i class="el-icon-reading card-content2-icon"></i>
        <span>推荐文章</span>
      </div>
      <div v-for="(article, index) in recommendArticles"
           :key="index"
           @click="$router.push({path: '/article', query: {id: article.id}})">
        <div class="aside-post-detail">
          <div class="aside-post-image">
            <el-image class="my-el-image" :src="article.articleCover" fit="cover">
              <div slot="error" class="image-slot">
                <div class="error-aside-image">
                  {{article.username}}
                </div>
              </div>
            </el-image>
          </div>
          <div class="aside-post-title">
            {{ article.articleTitle }}
          </div>
        </div>
        <div class="aside-post-date">
          <i class="el-icon-date" style="color: var(--greyFont)"></i>{{ article.createTime }}
        </div>
      </div>
    </div>
    <!-- 速览 -->
    <!-- <div v-for="(sort, index) in sortInfo"
         @click="selectSort(sort)"
         :key="index"
         :style="{background: $constant.sortColor[index % $constant.sortColor.length]}"
         class="shadow-box-mini background-opacity wow"
         style="position: relative;padding: 10px 25px 15px;border-radius: 10px;animation: hideToShow 1s ease-in-out;margin-top: 30px;cursor: pointer;color: var(--white)">
      <div>速览</div>
      <div class="sort-name">
        {{sort.sortName}}
      </div>
      <div style="font-weight: bold;margin-top: 15px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
        {{sort.sortDescription}}
      </div>
    </div> -->

    <div style="margin-top: 15px;">
      <todos></todos>
    </div>
  </div>
  
</template>

<script>
import { useMainStore } from '../store';

import todos from './common/todos.vue';
import  {navigation} from '../utils/tools.js'
  export default {
    components: {
      todos,
    },
      setup() {
    const store = useMainStore();
    return { store };
  },
  
data() {
      return {
        pagination: {
          current: 1,
          size: 5,
          recommendStatus: true
        },
        recommendArticles: [],
        admires: [],
        showAdmireDialog: false,
        articleSearch: ""
      }
    },
    computed: {
      webInfo() {
        return this.store.webInfo;
      },
      sortInfo() {
        return this.store.sortInfo;
      }
    },
    created() {
      this.getRecommendArticles();
    },
    methods: {
      selectSort(sort) {
        this.$emit("selectSort", sort);
      },
      selectArticle() {
        this.$emit("selectArticle", this.articleSearch);
      },
      showAdmire() {
        if (this.$common.isEmpty(this.store.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        this.showAdmireDialog = true;
      },
      getAdmire() {
        this.$http.get(this.$constant.baseURL + "/webInfo/getAdmire")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.admires = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      getRecommendArticles() {
        this.$http.post(this.$constant.baseURL + "/article/listArticle", this.pagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.recommendArticles = res.data.records;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      showTip() {
        this.$router.push({path: '/weiYan'});
      },
      goSearch(){
        this.$router.push({query: {keywords:this.keywords}})
        this.$nextTick(()=>{
            this.navigation('.page-container-wrap');
          })
      },
      navigation(selector) {
        let pageId = document.querySelector(selector);
        window.scrollTo({
          top: pageId.offsetTop,
          behavior: "smooth"
        });
      },
    }
  }
</script>

<style scoped>
.card-content0{
}
.card-content0 {
  transition: .3s;
  background-color: var(--background);
}
.card-content0 input {
  transition: .3s;
  width: 100%;
  height: 64px;
  padding-left: 10px;
  background-color: var(--background);
  border: 2px solid #7BA7AB;
  border-radius: 5px;
  outline: none;
  color: var(--fontColor);
}
.card-content0 button {
  position: absolute; 
  top: 0;
  right: 0px;
  width: 64px;
  height: 64px;
  border: none;
  background: #7BA7AB;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}
.card-content0 button:before {
  transition: .3s;
  content: "\f002";
  font-family: FontAwesome;
  font-size: 16px;
  color: var(--fontColor);
} 
  .card-content1 {
    background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
    background-size: 400% 400%;
    animation: gradientBG 10s ease infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0;
    border-radius: 10px;
    position: relative;
    /*color: var(--white);*/
    overflow: hidden;
  }

  .card-content1 :not(:first-child) {
    z-index: 10;
  }

  .web-name {
    font-size: 30px;
    font-weight: bold;
    margin: 20px 0;
  }

  .web-info {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .blog-info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .blog-info-num {
    margin-top: 12px;
  }
  .more-cannal {
    justify-content: space-around;
    display: flex;
    width: 80%;
    margin-top:12px  ;
  }
  .more-cannal svg,  .more-cannal i{
    text-align: center;
    color: #FFF;
    width: 2em;
    padding: .5em;
    border-radius: 1em;
  }
  .collection-btn {
    position: relative;
    margin-top: 12px;
    background: var(--lightGreen);
    cursor: pointer;
    width: 65%;
    height: 35px;
    border-radius: 1rem;
    text-align: center;
    line-height: 35px;
    color: var(--white);
    overflow: hidden;
    z-index: 1;
  }
  .collection-btn:last-child{
    margin-bottom: 25px;
  }
  .collection-btn::before {
    background: var(--gradualRed);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    transform: scaleX(0);
    transform-origin: 0;
    transition: transform 0.5s ease-out;
    transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
    border-radius: 1rem;
    z-index: -1;
  }

  .collection-btn:hover::before {
    transform: scaleX(1);
  }

  .card-content2-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .card-content2-icon {
    color: var(--red);
    margin-right: 5px;
    animation: scale 1s ease-in-out infinite;
  }

  .aside-post-detail {
    display: flex;
    cursor: pointer;
  }

  .aside-post-image {
    width: 40%;
    border-radius: 0.2rem;
    margin-right: 8px;
    overflow: hidden;
  }

  .error-aside-image {
    background: var(--themeBackground);
    color: var(--white);
    padding: 10px;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .aside-post-title {
    width: 60%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .aside-post-date {
    margin-top: 8px;
    margin-bottom: 20px;
    color: var(--greyFont);
    font-size: 12px;
  }

  .post-sort {
    border-radius: 1rem;
    margin-bottom: 15px;
    line-height: 30px;
    transition: all 0.3s;
  }

  .post-sort:hover {
    background: var(--themeBackground);
    padding: 2px 15px;
    cursor: pointer;
    color: var(--white);
  }
</style>
