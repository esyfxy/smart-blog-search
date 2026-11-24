## 网站示例
[寻国记：poetize.cn](https://poetize.cn) （master

[ROGINSHIN - 兴 ](https://www.roginx.ink/) 

## 技术栈
前端技术：Vue2（博客系统），Vue3（聊天室系统），Element UI（Vue2），Element-Plus UI（Vue3），Naive UI（Vue3）

后端技术：Java，Spring Boot，spring-boot-starter-mail，Mysql，Mybatis-Plus，t-io，qiniu-java-sdk

## 网站简介
这是一个 Spring Boot + Vue2 + Vue3 的产物。

网站分两个模块：
- 博客系统：具有文章，留言，友链，时间线，后台管理等功能。
- 聊天室系统：具有朋友圈（时间线），好友，群等功能。

本网站搭建于阿里云，采用前后端分离进行实现，两个前端项目通过Nginx代理。

### 首页
![首页](首页.jpg)

### 推荐
![推荐](推荐.jpg)

### 留言
![留言](留言.jpg)

### 树洞
![树洞](树洞.jpg)

### 朋友圈（时间线）
![朋友圈（时间线）](朋友圈（时间线）.jpg)

### 友链
![友链](友链.jpg)

### 聊天室
![聊天室](聊天室.jpg)

## 安装
```
npm install
```

## 启动
```
npm run serve
```

## 编译
```
npm run build
```

## 配置
全局搜索：$$$$

替换成自己自定义的内容，因为Https无法跨域，这些内容需要用自己的。

- 博客：https://gitee.com/littledokey/poetize-vue2.git
- 聊天室：https://gitee.com/littledokey/poetize-im-vue3.git
- 后端：https://gitee.com/littledokey/poetize.git

## 欢迎进群
1. 交流（摸鱼）
2. 安装部署：互相帮助，争取每个人都零基础拥有自己的个人网站
3. 博客答疑：每段代码都是我自己写的，爱学习的小伙伴可以在这里提问，互相学习，互相进步
4. 隐藏功能介绍：博客隐藏了很多功能，除了最重要的文章浏览，聊天室，还有朋友圈，网站后台基本信息管理，用户管理，评论管理，留言管理，友链管理，建群，加群，加好友等等等等
5. 漏洞反馈：欢迎提交BUG
6. 迭代升级：呼声高的功能可能会采纳，能力有限，时间有限，欢迎创作。

群名片七天有效，如果需要请加作者好友，然后拉进交流群

![个人名片](Sara.jpg)

## 欢迎关注作者B站
B站搜索用户【寻国记】，博客介绍与搭建教程。

【挑战最美博客！个人博客网站食用教程。这是一个 SpringBoot 与 Vue 的产物，在此公开，一起学习，共同成长。】
https://www.bilibili.com/video/BV1eM41167Ks/?share_source=copy_web

# Poetry UI

## 项目设置
```
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

## 技术栈
- Vue 2.7
- Vite 5
- Vue Router
- Vuex
- Element UI
- 其他依赖...

## 注意事项
- 本项目需要Node.js 16.0.0或更高版本
- 已从Vue CLI迁移到Vite构建工具
- 所有API代理配置已迁移到vite.config.js文件中

# Ablaze Frontend - 博客前端主应用

这是一个基于Vue 3和Vite构建的博客前端主应用，使用qiankun微前端框架集成子应用。

## 项目设置

```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 构建生产版本
npm run build
```

## 部署指南

### CDN部署步骤

1. **构建项目**

```bash
npm run build
```

构建完成后，`dist`目录中会生成所有静态资源文件。

2. **上传到CDN**

将`dist`目录下的所有文件上传到您的CDN服务（如腾讯云COS、阿里云OSS等）。

```
# 目录结构示例
/www/blog/           # 主应用根目录
  ├── index.html     # 入口HTML
  ├── assets/        # 静态资源
  │   ├── js/        # JS文件
  │   ├── css/       # CSS文件
  │   ├── img/       # 图片资源
  │   └── fonts/     # 字体文件
  └── ...
```

3. **配置CDN**

- 确保CDN开启了CORS（跨域资源共享）
- 设置正确的MIME类型
- 对于SPA应用，配置所有路由都指向index.html

4. **子应用配置**

确保`src/micro/apps.js`中正确配置了子应用的CDN地址：

```js
const microApps = [
  {
    name: 'ablaze-admin',
    entry: 'https://cos.roginx.ink/www/admin/', // 子应用CDN地址
    container: '#subapp-container',
    activeRule: '/admin',
    props: {
      // 传递给子应用的数据
      mainAppData: {
        authToken: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
      }
    },
    timeoutThreshold: 10000 // 10秒超时
  }
];
```

### Nginx配置示例

如果使用Nginx作为静态资源服务器或CDN前的代理，可参考以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 主应用
    location / {
        root /path/to/ablaze-frontend-vite/dist;
        try_files $uri $uri/ /index.html;
        
        # 允许跨域
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }

    # 子应用 - 管理系统
    location /admin/ {
        # 如果子应用也部署在同一服务器
        alias /path/to/ablaze-admin/dist/;
        try_files $uri $uri/ /admin/index.html;
        
        # 或者代理到CDN
        # proxy_pass https://cos.roginx.ink/www/admin/;
        
        # 允许跨域
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }
}
```

## 常见问题

### 子应用加载失败

1. 检查子应用的CDN地址是否正确
2. 确认子应用的生命周期函数是否被正确导出
3. 检查浏览器控制台是否有跨域错误
4. 验证子应用的qiankun-entry.js文件是否可以正常访问

### 资源加载失败

1. 检查CDN的CORS配置
2. 确认资源URL是否正确
3. 检查浏览器控制台是否有404错误
4. 验证CDN的缓存设置是否正确

### 路由问题

1. 确保主应用和子应用的路由配置不冲突
2. 验证主应用的activeRule配置是否正确
3. 检查子应用的路由是否考虑了主应用的路径前缀

## 技术栈

- Vue 3
- Vite
- Element Plus
- Vue Router
- Pinia
- qiankun (微前端框架)

## 注意事项

- 主应用负责加载和管理子应用
- 子应用的路由配置需要考虑在主应用中的路径前缀
- 资源路径需要正确配置，特别是在微前端环境下