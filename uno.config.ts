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
    // 移动端常用布局优化
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    ['flex-start', 'flex items-center justify-start'],
    ['flex-end', 'flex items-center justify-end'],

    // 移动端安全区域增强
    ['safe-area-top', 'pt-[env(safe-area-inset-top)]'],
    ['safe-area-bottom', 'pb-[env(safe-area-inset-bottom)]'],
    ['safe-area-left', 'pl-[env(safe-area-inset-left)]'],
    ['safe-area-right', 'pr-[env(safe-area-inset-right)]'],
    ['safe-area-x', 'px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'],
    ['safe-area-y', 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'],

    // 优化的按钮样式（更好的触摸体验）
    [
      'btn-primary',
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg active:from-blue-600 active:to-blue-700 transition-all duration-200 select-none touch-manipulation min-h-[44px]',
    ],
    [
      'btn-secondary',
      'bg-gray-100 text-gray-700 px-4 py-3 rounded-lg active:bg-gray-200 transition-colors duration-200 select-none touch-manipulation min-h-[44px]',
    ],
    [
      'btn-ghost',
      'bg-transparent text-current px-4 py-3 rounded-lg active:bg-black/5 transition-colors duration-200 select-none touch-manipulation min-h-[44px]',
    ],
    [
      'btn-danger',
      'bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg active:from-red-600 active:to-red-700 transition-all duration-200 select-none touch-manipulation min-h-[44px]',
    ],

    // 卡片和容器样式
    ['card', 'bg-white rounded-xl shadow-sm border border-gray-100/50'],
    ['card-hover', 'card hover:shadow-md transition-shadow duration-200'],
    ['container-mobile', 'max-w-sm mx-auto px-4'],

    // 移动端触摸优化
    ['touch-action', 'touch-manipulation select-none'],
    ['tap-highlight-transparent', '[&:not(input):not(textarea)]:[-webkit-tap-highlight-color:transparent]'],

    // 文本和排版
    ['text-title', 'text-xl font-bold text-gray-900'],
    ['text-subtitle', 'text-lg font-semibold text-gray-800'],
    ['text-body', 'text-base text-gray-700'],
    ['text-caption', 'text-sm text-gray-600'],
    ['text-muted', 'text-xs text-gray-500'],

    // 输入框样式
    ['input-base', 'w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors min-h-[44px]'],

    // 动画和过渡
    ['animate-fade-in', 'animate-[fadeIn_0.3s_ease-in-out]'],
    ['animate-slide-up', 'animate-[slideUp_0.3s_ease-out]'],
    ['animate-scale', 'animate-[scale_0.2s_ease-out]'],
  ],

  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
      },
    },
    breakpoints: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    animation: {
      keyframes: {
        fadeIn: '{from{opacity:0}to{opacity:1}}',
        slideUp: '{from{transform:translateY(100%)}to{transform:translateY(0)}}',
        scale: '{from{transform:scale(0.95)}to{transform:scale(1)}}',
      },
    },
  },

  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        heroicons: () => import('@iconify-json/heroicons/icons.json').then(i => i.default),
      },
    }),
  ],

  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],

  // 性能优化：明确指定需要的类名
  safelist: [
    'safe-area-top',
    'safe-area-bottom',
    'safe-area-left', 
    'safe-area-right',
    'touch-manipulation',
    'select-none',
    'tap-highlight-transparent',
    // 动态类名
    'bg-emerald-50',
    'text-emerald-700',
    'border-emerald-500',
    'bg-green-100',
    'border-green-400',
  ],

  // 排除不必要的CSS生成
  blocklist: [
    // 排除一些不常用的工具类
    /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  ].filter(Boolean),
})
