import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // 移动端常用布局
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],

    // 移动端安全区域
    ['safe-area-top', 'pt-[env(safe-area-inset-top)]'],
    ['safe-area-bottom', 'pb-[env(safe-area-inset-bottom)]'],

    // 常用按钮样式
    [
      'btn-primary',
      'bg-blue-500 text-white px-4 py-2 rounded-lg active:bg-blue-600 transition-colors',
    ],
    [
      'btn-secondary',
      'bg-gray-200 text-gray-800 px-4 py-2 rounded-lg active:bg-gray-300 transition-colors',
    ],

    // 卡片样式
    ['card', 'bg-white rounded-lg shadow-sm border border-gray-100'],

    // 移动端触摸优化
    ['touch-action', 'touch-manipulation select-none'],
  ],

  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
    breakpoints: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },

  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup()],

  safelist: ['safe-area-top', 'safe-area-bottom'],
})
