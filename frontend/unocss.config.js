import { defineConfig, presetUno, presetAttributify, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  // 预设
  presets: [
    presetUno(), // 默认预设
    presetAttributify(), // 属性化模式支持
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    }), // 图标支持
  ],
  // 转换器
  transformers: [
    transformerDirectives(), // 支持@apply、@screen等指令
    transformerVariantGroup(), // 支持(hover:text-red/50 focus:text-blue/40)这样的写法
  ],
  // 自定义规则
  rules: [
    // 自定义规则示例
    ['card-shadow', { 'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.08)' }],
    ['text-brand', { color: '#22c6ff' }],
  ],
  // 自定义快捷方式
  shortcuts: {
    // 常用组件样式
    'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md transition-colors duration-200',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-700',
    'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300',
    
    // 布局相关
    'flex-center': 'flex items-center justify-center',
    'grid-center': 'grid place-items-center',
    
    // 卡片样式
    'card': 'bg-white rounded-lg p-4 card-shadow',
    'card-hover': 'card hover:shadow-lg transition-shadow duration-200',
    
    // 输入框样式
    'input-base': 'border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300',
  },
  // 主题配置
  theme: {
    colors: {
      brand: {
        primary: '#22c6ff',
        secondary: '#0099cc',
        light: '#e6f7ff',
      },
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  // 安全列表，始终包含这些类
  safelist: [
    'hidden', 'block', 'flex', 'grid',
    'text-brand-primary', 'bg-brand-light',
  ],
}) 