<template>
  <div>
    <div class="shuoshuo-card-noAccess" v-if="!access">
      <font class="noAccess-font">你没有访问权限，请尝试登录！</font>
      <input type="password" v-model="input_password" @input="access = Access()" placeholder="或许可以通过密码访问呢？" class="noAccess-password" >
    </div>
    <div class="shuoshuo-card" v-if="access">
      <div class="shuoshuo-topper">
        <img src="https://q1.qlogo.cn/g?b=qq&s=100&nk=983341575" alt="" class="shuoshuo-avatar">
        <div class="shuoshuo-toptitle">
          <span style="font-size:1.2em;color:var(--fontColor)">Janx</span>
          <div class="shuoshuo-meta" style="font-size:.8em;">
            <span>{{source.createTime}}</span>
            <span>
              {{source.articleEmotion}}
            </span>
            <span>
              <i class="fa fa-comments"></i> {{source.likeCount}} 条评论
            </span>
          </div>
        </div>
      </div>
      <div class="shuoshuo-container" v-html="source.articleContent">
      </div>
      <div class="shuoshuo-piclist"  ref="imgList"  :class="picClassname">
        <!-- v-viewer.rebuild="{inline: false,'url': 'data-source',images:picList[0]}" -->
        <a :href="item" target="_blank" v-for="item,index in picList[0]" v-show="(index<9)?true:false" :key="item"
        :overtip="`+ ${picList[0].length-9}`"
        :data-sub-html="picList[1][index]||'该图片没有图注呢'"
        data-fb-html='是否需要添加评论功能呢？'
        >
          <div class="imgbox">
              <img :click="clickPicture" target="_blank" :title="picList[1][index]" class="lazyload_images" :data-source="item.indexOf('qiniu.roginx.ink')!=-1?item+'-normal':item" :src="item.indexOf('qiniu.roginx.ink')!=-1?item+'-poster':item"  alt="">
          </div>
        </a>
      </div>
      <div class="shuoshuo-tailer">
        <span style="font-size:0.9em;line-height: 1.5em;">{{source.articleAddress}}</span>
        <span style="font-size:0.9em;line-height: 1.5em;">{{source.articleDevice}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { asyncComponent } from '../../utils/common';

import { useMainStore } from '../../store';

  // import graffiti from "./graffiti.vue";;
  import proPage from "../common/proPage.vue";;
  import MarkdownIt from 'markdown-it';
  // import 'lightgallery.js'
  // import 'lg-thumbnail.js'
  export default {
    components: {
    },
    props: {
      source: {
        type: Number
      },
      userId: {
        type: Number
      }
    },
    watch: {
      access: {
        handler(newValue, oldValue) {
          console.log(newValue,this.$refs.imgList);
          if (!newValue) return;
          this.$nextTick(() => {
            new lightGallery(this.$refs.imgList,{
            plugins: [lgThumbnail,lgHash,lgRotate,lgVideo,lgZoom,lgFullscreen,lgAutoplay,lgComment],
            mode: 'lg-slide',
            cssEasing: 'ease',
            commentBox: true,
            fbComments: true,
            galleryId:this.source.id,
            speed: 300
          });
          })
        },
        immediate: true // 立即执行一次handler
    }
    },
      setup() {
    const store = useMainStore();
    return { store };
  },
  
data() {
      return {
        isGraffiti: false,
        total: 0,
        replyDialogVisible: false,
        input_password:'',
        access:this.Access(),
        floorComment: {},
        replyComment: {},
        comments: [],
        picList:[],
        picClassname:"",
        pagination: {
          current: 1,
          size: 10,
          total: 0,
          source: this.source,
          floorCommentId: null
        }
      };
    },

    computed: {},

    created() {
      this.checkPicList();
    },
    mounted() {

    },
    methods: {
      toPage(page) {
        this.pagination.current = page;
        window.scrollTo({
          top: document.getElementById('comment-content').offsetTop
        });
        // this.getComments(this.pagination);
      },
      getTotal() {
        this.$http.get(this.$constant.baseURL + "/comment/getCommentCount", {source: this.source})
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.total = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      toChildPage(floorComment) {
        floorComment.childComments.current += 1;
        let pagination = {
          current: floorComment.childComments.current,
          size: 5,
          total: 0,
          source: this.source,
          floorCommentId: floorComment.id
        }
        // this.getComments(pagination, floorComment, true);
      },
      emoji(comments, flag) {
        comments.forEach(c => {
          c.commentContent = c.commentContent.replace(/\n/g, '<br/>');
          c.commentContent = this.$common.faceReg(c.commentContent);
          c.commentContent = this.$common.pictureReg(c.commentContent);
          if (flag) {
            if (!this.$common.isEmpty(c.childComments) && !this.$common.isEmpty(c.childComments.records)) {
              c.childComments.records.forEach(cc => {
                c.commentContent = c.commentContent.replace(/\n/g, '<br/>');
                cc.commentContent = this.$common.faceReg(cc.commentContent);
                cc.commentContent = this.$common.pictureReg(cc.commentContent);
              });
            }
          }
        });
      },
      // getComments(pagination, floorComment = {}, isToPage = false) {
      //   this.$http.post(this.$constant.baseURL + "/comment/listComment", pagination)
      //     .then((res) => {
      //       if (!this.$common.isEmpty(res.data) && !this.$common.isEmpty(res.data.records)) {
      //         if (this.$common.isEmpty(floorComment)) {
      //           this.comments = res.data.records;
      //           pagination.total = res.data.total;
      //           this.emoji(this.comments, true);
      //         } else {
      //           if (isToPage === false) {
      //             floorComment.childComments = res.data;
      //           } else {
      //             floorComment.childComments.total = res.data.total;
      //             floorComment.childComments.records = floorComment.childComments.records.concat(res.data.records);
      //           }
      //           this.emoji(floorComment.childComments.records, false);
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       this.$message({
      //         message: error.message,
      //         type: "error"
      //       });
      //     });
      // },
      addGraffitiComment(graffitiComment) {
        this.submitComment(graffitiComment);
      },
      submitComment(commentContent) {
        let comment = {
          source: this.source,
          commentContent: commentContent
        };

        this.$http.post(this.$constant.baseURL + "/comment/saveComment", comment)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.pagination = {
              current: 1,
              size: 10,
              total: 0,
              source: this.source,
              floorCommentId: null
            }
            // this.getComments(this.pagination);
            this.getTotal();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      submitReply(commentContent) {
        let comment = {
          source: this.source,
          floorCommentId: this.floorComment.id,
          commentContent: commentContent,
          parentCommentId: this.replyComment.id,
          parentUserId: this.replyComment.userId
        };

        let floorComment = this.floorComment;

        this.$http.post(this.$constant.baseURL + "/comment/saveComment", comment)
          .then((res) => {
            let pagination = {
              current: 1,
              size: 5,
              total: 0,
              source: this.source,
              floorCommentId: floorComment.id
            }
            // this.getComments(pagination, floorComment);
            this.getTotal();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.handleClose();
      },
      replyDialog(comment, floorComment) {
        this.replyComment = comment;
        this.floorComment = floorComment;
        this.replyDialogVisible = true;
      },
      handleClose() {
        this.replyDialogVisible = false;
        this.floorComment = {};
        this.replyComment = {};
      },
      checkPicList(){
        this.picList = JSON.parse(this.source.articleItems);
        let classname = ["","pic1","pic2","pic3"];
        if(this.picList[0].length<3)
          this.picClassname = classname[this.picList[0].length]
        else
          this.picClassname = classname[3]
          if(this.picList[0].length>9){ this.picClassname = classname[3] + " pic-overload"}
      },
      clickPicture(e){
        //获取viewer实例
        const viewer = this.$el.querySelector('.images').$viewer
        //调用show方法进行显示预览图
        viewer.show()
      },
      Access(){
        if(this.store.currentUser?.id == 1) return true;
        if(this.source.permission == 0 ) return true;
        if(this.input_password==this.source.password&&this.source.password) return true;
        if(this.source.permission == 1 && !this.$common.isEmpty(this.store.currentUser)) return true;
        if(this.source.permission == 2 && this.input_password==this.source.password) return true;
        return false;
      }
    }
  }
</script>

<style scoped>
.shuoshuo-card-noAccess{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 1px 1px 5px #66666655;
  max-width: 720px;
  height: 300px;
  animation-name: zoomIn;
  margin:20px auto 20px auto;
  border-radius: .5em;
  background-color: var(--themeBackground);
}
.noAccess-font{
  text-align: center;
  width: 200px;
  font-size: 16px;
  line-height: 24px;
  color:#FFF
}
.noAccess-password:placeholder-shown {
  letter-spacing: 2px;
  color: #FFF;
  font-size: 12px;
  font-family: SmileySans;
}
.noAccess-password:focus{
  border-bottom: solid 2px #FFF;
  transition: .3s;
}
.noAccess-password{
  transition: .3s;
  width: 200px;
  font-size: 16px;
  margin: 16px 0;
  padding: 8px 0;
  border:none;
  border-bottom: solid 1px #ffffffbe;
  letter-spacing: 8px;
  text-align: center;
  color: #FFF;
  outline: none;
  background: transparent;
  z-index: 1;
}
.shuoshuo-card{
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 1px 1px 5px #66666655;
  max-width: 720px;
  animation-name: zoomIn;
  margin:20px auto 20px auto;
  border-radius: .5em;
}
.permission-mask{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99999999999;
  background-color: #FFF;
}
.shuoshuo-topper{
  display: flex;
  flex-direction: row;
}
.shuoshuo-topper .shuoshuo-avatar{
  width:64px;
  height:64px;
}
.shuoshuo-container{
  margin-top: .6em;
  margin-bottom: .2em;
  letter-spacing: 1px;
  line-height: 1.5em;
}
.shuoshuo-toptitle{
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.shuoshuo-piclist{
  width: 100%;
  position: relative;
  user-select: none;
  margin:5px 0  5px 0;
}
.shuoshuo-piclist a {
  list-style: none;
  cursor: zoom-in;
}
.shuoshuo-piclist img{
  width:100%;
  margin: auto;
}

.pic1 a img{
  max-height: 520px;
  max-width: 100%;
  width: unset;
}
.pic2 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.pic2 a{
  flex:1;
  margin: 2px;
}
.pic3{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.pic3 a{
  width:33.33%;
  padding: 1px;
  position: relative;
}
.pic3 .imgbox{
  position: relative;
  overflow: hidden;
  padding-bottom: 75%;/*重要属性*/
}
:deep(p:has( > iframe:only-child)),
:deep(p:has( > video:only-child)) {
  margin: 0;
  padding: 0;
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

:deep(p:has( > iframe:only-child) iframe), 
:deep(p:has( > video:only-child) video) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pic3 .imgbox img{
  width: 100%;
  position: absolute;
  height: 100%;
  object-fit: cover;
}
.pic3.pic-overload a:nth-child(9)::after {
    content: attr(overtip);
    display: flex;
    font-size: 2.5em;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: #FFF;
    height: 100%;
    top: 0;
    pointer-events: none;
    background: #00000088;
}
.shuoshuo-meta{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.shuoshuo-meta span{
  margin-right: .8em;
}
.shuoshuo-topper span,.shuoshuo-tailer span{
  display:block;
  color:var(--greyFont);
}
@media screen and (max-width: 768px) {

  .pic3 .imgbox{
    position: relative;
    overflow: hidden;
    padding-bottom: 100%;/*重要属性*/
  } 
}
</style>
