import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: [
    // 常用布局
    { 'flex-center': 'flex items-center justify-center' },
    { 'flex-between': 'flex items-center justify-between' },
    { 'flex-col-center': 'flex flex-col items-center justify-center' },
    { 'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' },
  ],
  theme: {
    colors: {
      // 自定义颜色
      primary: 'var(--themeBackground)',
      secondary: 'var(--greyFont)',
      success: 'var(--el-color-success)',
      warning: 'var(--el-color-warning)',
      danger: 'var(--el-color-danger)',
      info: 'var(--el-color-info)',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  rules: [
    // 自定义规则
    ['card-shadow', { 'box-shadow': '0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)' }],
  ],
  safelist: [
    // 安全列表，确保这些类名不会被清除
    'text-white',
    'text-black',
    'bg-primary',
    'bg-secondary',
    'text-success',
    'text-warning',
    'text-danger',
    'text-info',
    'bg-success',
    'bg-warning',
    'bg-danger',
    'bg-info',
  ]
}) 