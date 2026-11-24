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
  ],
  theme: {
    colors: {
      // 可以添加自定义颜色
      primary: 'var(--themeBackground)',
      secondary: 'var(--greyFont)',
    },
  },
  rules: [
    // 可以添加自定义规则
  ],
  safelist: [
    // 安全列表，确保这些类名不会被清除
    'text-white',
    'text-black',
    'bg-primary',
    'bg-secondary',
  ]
}) 