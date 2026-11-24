export default {
  baseURL: `//${window.location.host}/api`,
  imBaseURL: "http://localhost:81",
  webURL: `//${window.location.host}/api`,

  // baseURL: "//127.0.0.1:8080/",
  // imBaseURL: "https://poetize.cn/im",
  // webURL: "https://poetize.cn",

  live2d_path: "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
  cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/",
  waifuPath: "/webInfo/getWaifuJson",
  hitokoto: "https://v1.hitokoto.cn",
  tocbot: "https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.11.1/tocbot.min.js",
  jinrishici: "https://v1.jinrishici.com/all.json",
  random_backImage_miaomc:"//api.miaomc.cn/image/get",
  random_image: "https://api.miaomc.cn/image/other/360pic",
  random_avatar:function(name){
    return `https://api.multiavatar.com/${name}.svg`
  },
  //前后端定义的密钥，AES使用16位
  cryptojs_key: "aoligeimeimaobin",
  qiniuUrl: "//upload-z2.qiniup.com",
  qiniuDownload: "//qiniu.roginx.ink/",
  favoriteVideo:["http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/hutao.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Pela_Honkai_Star_Rail_2560x1440.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Ganyu_Genshin.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Arlecchino_Genshin.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Kamisato_Ayaka_and_Yae_Miko.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Cycling_Home.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Nilou.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/YELAN_wallpaper_4k.x264.aac.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Lonesome_Dream.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Plenilune_Gaze.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/魈空.mp4"
    ,"http://alist.roginx.ink/d/OneAlbum/dynamicWallpaper/Gods_Genshin.mp4"
    ,"https://alist.roginx.ink/d/百度网盘/alist/Ningguang.mp4"
    ,"https://alist.roginx.ink/d/百度网盘/alist/温蒂隐世樱.mp4"
    ,"https://alist.roginx.ink/d/百度网盘/alist/Ayaka/Ayaka 4K.mp4"
    ,"https://alist.roginx.ink/d/百度网盘/alist/Ayaka/Genshin%20Impact%20-%20Kamisato%20Ayaka%20Cybust%20-%20PC.mp4"
    ,"https://alist.roginx.ink/d/百度网盘/alist/%E9%9B%B7%E7%94%B5%E5%B0%86%E5%86%9B/%E9%9B%B7%E7%A5%9E.mp4"
  ],
  friendBG: "//api.ixiaowai.cn/api/api.php",
  friendLetterTop: "https://cdn.cbd.int/hexo-butterfly-envelope/lib/before.png",
  friendLetterBottom: "https://cdn.cbd.int/hexo-butterfly-envelope/lib/after.png",
  friendLetterBiLi: "https://cdn.cbd.int/hexo-butterfly-envelope/lib/line.png",
  friendLetterMiddle: "https://cdn.cbd.int//hexo-butterfly-envelope/lib/violet.jpg",

  before_color_list: ["#ff4b2b", "#EF794F", "#67C23A", "orange", "rgb(131, 123, 199)", "#23d5ab"],

  tree_hole_color: ["#ee7752", "#e73c7e", "#23a6d5", "#23d5ab", "rgb(131, 123, 199)", "#23d5ab"],

  two_poem_image: ["https://kanokano.cn/wp-content/uploads/topimg/banner.webp",
    "https://s1.ax1x.com/2022/12/04/zsKh5V.jpg"],
  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b, #ec008c)",
  before_color_2: "rgb(131, 123, 199)",
  after_color_2: "linear-gradient(45deg, #f43f3b, #ec008c)",
  sortColor: ["linear-gradient(to right, #358bff, #15c6ff)",
    "linear-gradient(to right, #18e7ae, #1eebeb)",
    "linear-gradient(to right, #ff6655, #ffbf37)",
    "linear-gradient(120deg, rgba(255, 39, 232, 1) 0%, rgba(255, 128, 0, 1) 100%)",
    "linear-gradient(120deg, rgba(91, 39, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)"
  ],
  playlists:[3094197205],
  ACGAPI:[
    "https://img.paulzzh.com/touhou/random",
    "https://api.ucany.net/acg-pc.php",
    "https://api.yimian.xyz/img",
    "https://cdn.seovx.com/d/?mom=302",
    "https://imgapi.cn/api.php?fl=dongman&gs=images",
  ],
  PICAPI:[
    "https://imgapi.cn/api.php?zd=mobile&fl=meizi&gs=images",
    "https://api.btstu.cn/sjbz/api.php",
    "https://api.ddkjt.com/api/img_1.php",
    "https://api.ddkjt.com/api/img_2.php",
    "https://api.ucany.net/wallpaper-pc.php",
    "https://cdn.seovx.com/?mom=302",
    "https://cdn.seovx.com/ha/?mom=302",
    "https://source.unsplash.com/random",
    "https://source.unsplash.com/user/erondu/1600x900",
    "https://source.unsplash.com/user/tkirkgoz/1600x900"
  ],
  background:{
    bangumi:"//cos.roginx.ink/upload/2022/8/29/166176340045213.jpg",
    izone:"//cos.roginx.ink/blog/3c5356cb1303.jpg",
    day_random:"//api.dujin.org/bing/1920.php",
    view_random:"//api.ixiaowai.cn/gqapi/gqapi.php",
    bing_random:"//api.miaomc.cn/image/other/bing"
  },
  pageColor: "#ee7752",
  commentPageColor: "#23d5ab",
  userId: 1,
  source: 0,
}