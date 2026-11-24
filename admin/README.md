# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# Ablaze Admin - 博客管理系统

这是一个基于Vue 3和Vite构建的博客管理系统子应用，使用qiankun微前端框架集成。

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
/www/admin/           # 子应用根目录
  ├── index.html      # 入口HTML
  ├── lifecycle.js    # 生命周期文件
  ├── assets/         # 静态资源
  │   ├── js/         # JS文件
  │   │   ├── qiankun-entry.js  # 微前端入口文件（重要）
  │   │   └── ...
  │   ├── css/        # CSS文件
  │   ├── img/        # 图片资源
  │   └── fonts/      # 字体文件
  └── ...
```

3. **配置CDN**

- 确保CDN开启了CORS（跨域资源共享）
- 设置正确的MIME类型
- 对于SPA应用，配置所有路由都指向index.html

4. **配置主应用**

确保主应用的`micro/apps.js`中正确配置了子应用的CDN地址：

```js
{
  name: 'ablaze-admin',
  entry: 'https://cos.roginx.ink/www/admin/', // CDN地址
  container: '#subapp-container',
  activeRule: '/admin'
}
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
        alias /path/to/ablaze-admin/dist/;
        try_files $uri $uri/ /admin/index.html;
        
        # 允许跨域
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }
}
```

## 常见问题

### 生命周期函数未被正确识别

如果遇到"You need to export lifecycle functions"错误，请检查：

1. 确保`qiankun-entry.js`文件被正确生成并可访问
2. 检查CDN上的文件是否完整，特别是`qiankun-entry.js`和`lifecycle.js`
3. 使用浏览器开发者工具检查网络请求，确认这些文件能被正确加载
4. 确保CDN的CORS配置正确

### CDN部署后资源加载失败

1. 检查CDN的CORS配置
2. 确认资源URL是否正确
3. 检查浏览器控制台是否有跨域错误
4. 验证CDN的缓存设置是否正确

### 在主应用中无法正常显示子应用

1. 检查主应用的微应用配置是否正确
2. 确认子应用的生命周期函数是否被正确导出
3. 检查子应用的路由配置是否与主应用冲突

## 技术栈

- Vue 3
- Vite
- Element Plus
- Vue Router
- Pinia
- qiankun (微前端框架)

## 注意事项

- 子应用可以独立运行，也可以在主应用中被加载
- 子应用的路由配置需要考虑在主应用中的路径前缀
- 资源路径需要正确配置，特别是在微前端环境下
