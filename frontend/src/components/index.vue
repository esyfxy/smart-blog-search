<template>
  <div>
    <wallwindow ref="wallwindow"></wallwindow>
    <!-- 首页文字 -->
    <div class="signature-wall flex flex-col items-center justify-center relative user-select-none h-screen overflow-hidden">
      <h1 class="playful transition-all duration-1000 opacity-0 hover:opacity-100">
        <span v-for="(a, index) in store.webInfo.webTitle" :key="index">{{a}}</span>
      </h1>
      <div class="printer hoverOpa cursor-pointer bg-translucent text-white rounded-10px px-2.5" @click="getGuShi()">
        <printer :printerInfo="printerInfo">
          <template #paper="scope">
            <h3>
              {{ scope.content }}<span class="cursor">|</span>
            </h3>
          </template>
        </printer>
      </div>
      <div id="bannerWave1"></div>
      <div id="bannerWave2"></div>
      <i class="el-icon-arrow-down text-4xl font-bold text-white absolute bottom-15 z-15 cursor-pointer animate-my-shake" @click="navigation('.page-container-wrap')"></i>
    </div>
    <!-- 首页内容 -->
    <div class="page-container-wrap bg-background relative transition-all duration-500">
      <div class="page-container flex justify-center w-90% px-3.5 pb-10 mx-auto flex-row">
        <div class="aside-content w-30% -mr-10 user-select-none mt-10 max-w-300px float-right" v-if="showAside">
          <myAside class="aside-content-myAside top-2.5"></myAside>
        </div>
        <div class="recent-posts w-70%">
          <div class="announcement p-5 border border-dashed border-lightGray text-greyFont rounded-10px flex max-w-780px mx-auto my-5">
            <i class="fa fa-volume-up text-themeBackground text-22px my-auto animate-scale"></i>
            <div>
              <div v-for="(notice, index) in store.webInfo.notices" :key="index" class="ml-5 leading-30px">
                {{ notice }}
              </div>
            </div>
          </div>
          <articleList :articleList="articles"></articleList>
          <div class="flex justify-center mt-10">
            <div @click="pageArticles()" class="pagination py-3.25 px-3.75 border border-solid border-lightGray rounded-3rem text-greyFont w-25 user-select-none cursor-pointer text-center hover:border-themeBackground hover:text-themeBackground hover:shadow-themeBackground" v-if="pagination.total !== articles.length">
              下一页
            </div>
            <div v-else class="user-select-none">
              ~~到底啦~~
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <div class="bg-background">
      <myFooter></myFooter>
    </div>
  </div>
</template>
<script>
import { useMainStore } from '../store';

  import zombie from "./common/zombie.vue";;
  import printer from "./common/printer.vue";;
  import wallwindow from "./common/wallwindow.vue";;
  import articleList from "./articleList.vue";;
  import myFooter from "./common/myFooter.vue";;
  import myAside from "./myAside.vue";;
  import {getAlistContent} from '../utils/api' 
  export default {
    components: {
      zombie,
      printer,
      articleList,
      myFooter,
      myAside,
      wallwindow
    },

      setup() {
    const store = useMainStore();
    return { store };
  },
  
data() {
      return {
        showAside: true,
        printerInfo: "你看对面的青山多漂亮",
        pagination: {
          current: 1,
          size: 12,
          total: 0,
          keywords: "面试"
        },
        guShi: {
          "content": "",
          "origin": "",
          "author": "",
          "category": ""
        },
        articles: []
      };
    },

    created() {
      this.getGuShi();
      // 移除这里的getArticles调用，因为watch中已经处理了
    },

    mounted() {

    },
    watch: {
    // 监视搜索词变化
    "$route.query.keywords": {
      immediate: true,
      handler() {
        this.articles = [];
        this.pagination.current = 1; // 重置为第一页
        this.pagination.keywords = this.$route.query.keywords;
        this.getArticles();
      },
      }
    },
    methods: {
      pageArticles() {
        this.pagination.current = this.pagination.current + 1;
        this.getArticles();
      },

      getArticles() {
        this.$http.post(this.$constant.baseURL + "/article/listArticle", this.pagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.articles = this.articles.concat(res.data.records);
              this.pagination.total = res.data.total;
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
      }
    }
  }
</script>

<style scoped>

  .signature-wall {
    /* 向下排列 */
    display: flex;
    flex-direction: column;
    position: relative;
    user-select: none;
    height: 100vh;
    overflow: hidden;
  }
.signature-wall .playful{
  transition: 1s;
  opacity: 0;
}
.signature-wall .playful:hover{
  transition: 1s;
  opacity: 1;
}
.playful {
  transition: 1s;
  font-size: 40px;
  color: var(--white);
  -webkit-background-clip: text;
  background-image: linear-gradient(119.39deg, rgb(255, 31, 115) 6.43%, rgb(143, 31, 255) 49.87%, rgb(31, 200, 255) 91.42%);
}
.playful span {
  color: #5362f6;
  position: relative;
  text-shadow: 0.25px 0.25px #e485f8, 0.5px 0.5px #e485f8, 0.75px 0.75px #e485f8,
  1px 1px #e485f8, 1.25px 1.25px #e485f8, 1.5px 1.5px #e485f8, 1.75px 1.75px #e485f8,
  2px 2px #e485f8, 2.25px 2.25px #e485f8, 2.5px 2.5px #e485f8, 2.75px 2.75px #e485f8,
  3px 3px #e485f8, 3.25px 3.25px #e485f8, 3.5px 3.5px #e485f8, 3.75px 3.75px #e485f8,
  4px 4px #e485f8, 4.25px 4.25px #e485f8, 4.5px 4.5px #e485f8, 4.75px 4.75px #e485f8,
  5px 5px #e485f8, 5.25px 5.25px #e485f8, 5.5px 5.5px #e485f8, 5.75px 5.75px #e485f8,
  6px 6px #e485f8;
  animation: scatter 3s infinite;
  font-weight: normal;
}

  .playful span:nth-child(2n) {
   color: #ed625c;
   text-shadow: 0.25px 0.25px #f2a063, 0.5px 0.5px #f2a063, 0.75px 0.75px #f2a063,
   1px 1px #f2a063, 1.25px 1.25px #f2a063, 1.5px 1.5px #f2a063, 1.75px 1.75px #f2a063,
   2px 2px #f2a063, 2.25px 2.25px #f2a063, 2.5px 2.5px #f2a063, 2.75px 2.75px #f2a063,
   3px 3px #f2a063, 3.25px 3.25px #f2a063, 3.5px 3.5px #f2a063, 3.75px 3.75px #f2a063,
   4px 4px #f2a063, 4.25px 4.25px #f2a063, 4.5px 4.5px #f2a063, 4.75px 4.75px #f2a063,
   5px 5px #f2a063, 5.25px 5.25px #f2a063, 5.5px 5.5px #f2a063, 5.75px 5.75px #f2a063,
   6px 6px #f2a063;
   animation-delay: 0.3s;
  }

  .playful span:nth-child(3n) {
    color: #ffd913;
    text-shadow: 0.25px 0.25px #6ec0a9, 0.5px 0.5px #6ec0a9, 0.75px 0.75px #6ec0a9,
    1px 1px #6ec0a9, 1.25px 1.25px #6ec0a9, 1.5px 1.5px #6ec0a9, 1.75px 1.75px #6ec0a9,
    2px 2px #6ec0a9, 2.25px 2.25px #6ec0a9, 2.5px 2.5px #6ec0a9, 2.75px 2.75px #6ec0a9,
    3px 3px #6ec0a9, 3.25px 3.25px #6ec0a9, 3.5px 3.5px #6ec0a9, 3.75px 3.75px #6ec0a9,
    4px 4px #6ec0a9, 4.25px 4.25px #6ec0a9, 4.5px 4.5px #6ec0a9, 4.75px 4.75px #6ec0a9,
    5px 5px #6ec0a9, 5.25px 5.25px #6ec0a9, 5.5px 5.5px #6ec0a9, 5.75px 5.75px #6ec0a9,
    6px 6px #6ec0a9;
    animation-delay: 0.15s;
   }

  .playful span:nth-child(5n) {
   color: #555bff;
   text-shadow: 0.25px 0.25px #e485f8, 0.5px 0.5px #e485f8, 0.75px 0.75px #e485f8,
   1px 1px #e485f8, 1.25px 1.25px #e485f8, 1.5px 1.5px #e485f8, 1.75px 1.75px #e485f8,
   2px 2px #e485f8, 2.25px 2.25px #e485f8, 2.5px 2.5px #e485f8, 2.75px 2.75px #e485f8,
   3px 3px #e485f8, 3.25px 3.25px #e485f8, 3.5px 3.5px #e485f8, 3.75px 3.75px #e485f8,
   4px 4px #e485f8, 4.25px 4.25px #e485f8, 4.5px 4.5px #e485f8, 4.75px 4.75px #e485f8,
   5px 5px #e485f8, 5.25px 5.25px #e485f8, 5.5px 5.5px #e485f8, 5.75px 5.75px #e485f8,
   6px 6px #e485f8;
   animation-delay: 0.4s;
  }

  .playful span:nth-child(7n) {
   color: #ff9c55;
   text-shadow: 0.25px 0.25px #ff5555, 0.5px 0.5px #ff5555, 0.75px 0.75px #ff5555,
   1px 1px #ff5555, 1.25px 1.25px #ff5555, 1.5px 1.5px #ff5555, 1.75px 1.75px #ff5555,
   2px 2px #ff5555, 2.25px 2.25px #ff5555, 2.5px 2.5px #ff5555, 2.75px 2.75px #ff5555,
   3px 3px #ff5555, 3.25px 3.25px #ff5555, 3.5px 3.5px #ff5555, 3.75px 3.75px #ff5555,
   4px 4px #ff5555, 4.25px 4.25px #ff5555, 4.5px 4.5px #ff5555, 4.75px 4.75px #ff5555,
   5px 5px #ff5555, 5.25px 5.25px #ff5555, 5.5px 5.5px #ff5555, 5.75px 5.75px #ff5555,
   6px 6px #ff5555;
   animation-delay: 0.25s;
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
    padding: 0 14px 40px 14px;
    margin: 0 auto;
    flex-direction: row;
  }

  .recent-posts {
    width: 70%;
  }

  .announcement {
    border: 1px dashed var(--lightGray);
    color: var(--greyFont);
    border-radius: 10px;
    display: flex;
    max-width: 100%;
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

    h1 {
      font-size: 35px;
    }
  }
</style>
