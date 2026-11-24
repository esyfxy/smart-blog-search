import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: process.env.NODE_ENV === "production" ? "https://cos.roginx.ink/www/index/" : "/",
  server: {
    host: '127.0.0.1',
    port: 9001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/agent': {
        target: 'https://www.roginx.ink/agent',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent/, '')
      },
      '/baseagent': {
        target: 'http://127.0.0.1:8085/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baseagent/, '')
      },
      '/getIp': {
        target: 'http://ip-api.com/json/?lang=zh-CN',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/getIp/, '')
      },
      '/api/alist': {
        target: 'https://alist.roginx.ink/api/',
        changeOrigin: true,
        headers: {
          Host: 'alist.roginx.ink',
          Authorization: ''
        },
        rewrite: (path) => path.replace(/^\/api\/alist/, '/')
      },
      '/api/netapi': {
        target: 'https://www.roginx.ink/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/scrape': {
        target: 'http://service-pjors7ji-1257251314.hk.apigw.tencentcs.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scrape/, '/puppeteer'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
            res.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            res.end('代理请求出错: ' + err.message);
          });
        },
        timeout: 60000,
      },
      '/api/aurora': {
        target: 'http://aurora.roginx.ink/aurora/',
        changeOrigin: true,
        headers: {
          Host: 'aurora.roginx.ink'
        },
        rewrite: (path) => path.replace(/^\/api\/aurora/, '')
      },
      '/api': {
        // target: 'https://www.roginx.ink/api/',
        target: 'http://localhost:8080/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/')
      },
      '/mapi163/weapi': {
        target: 'http://music.163.com/weapi/',
        rewrite: (path) => path.replace(/^\/mapi163\/weapi/, '/')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]
          if (/\.(css|less|scss|sass)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'css'
          } else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'img'
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'fonts'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'qiankun': ['qiankun']
        }
      }
    }
  }
}) 