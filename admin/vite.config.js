import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import qiankun from 'vite-plugin-qiankun'
import UnoCSS from 'unocss/vite'

const name = 'ablaze-admin';
const port = 9000;

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  // 从环境变量中获取CDN域名和前缀
  const cdnDomain = env.VITE_COS_CDN_DOMAIN || 'https://cos.roginx.ink'
  const cosPrefix = env.VITE_COS_PREFIX || 'www/admin'
  
  return {
    plugins: [
      vue(),
      UnoCSS(),
      qiankun(name, {
        useDevMode: command === 'serve',
        exportType: 'umd'
      })
    ],
    base: process.env.NODE_ENV === "production" ? `${cdnDomain}/${cosPrefix}/` : "/",
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port,
      host: '127.0.0.1',
      cors: true,
      // 允许来自主应用的跨域请求
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      },
      proxy: {
        '/agent': {
          target: 'https://www.roginx.ink/agent',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/agent/, '')
        },
        '/baseagent': {
          // target: 'http://127.0.0.1:8085/',
          target: 'https://edu.roginx.ink/api/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/baseagent/, '')
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
        '/api/cloud-storage': {
          // target: 'http://localhost:8085/cloud-storage',
          target: 'https://edu.roginx.ink/api/cloud-storage',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cloud-storage/, '')
        },
        '/api/auth-center': {
          // target: 'http://localhost:8085/auth-center',
          target: 'https://edu.roginx.ink/api/auth-center',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/auth-center/, '')
        },
        '/api': {
          // target: 'https://www.roginx.ink/api/',
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/')
        },
        '/kv': {
          target: 'https://www.roginx.ink/api/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/kv/, '/kv')
        },
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: process.env.NODE_ENV !== 'production',
      // 确保生成的代码能被qiankun正确识别
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          // 自定义文件输出配置
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
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
          }
        }
      }
    },
    define: {
      __VUE_PROD_DEVTOOLS__: false
    }
  }
})
