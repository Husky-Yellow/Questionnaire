import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    // 只在开发环境启用DevTools
    ...(command === 'serve' ? [vueDevTools()] : []),
    UnoCSS(),
    viteMockServe({
      mockPath: 'mocks',
      enable: command === 'serve',
      watchFiles: true,
      ignore: /^_/,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome80',
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心框架
          'vendor-vue': ['vue', 'vue-router'],
          'vendor-pinia': ['pinia'],
          // 工具库
          'vendor-utils': ['@vueuse/core'],
          // UnoCSS相关
          'vendor-unocss': ['@unocss/preset-uno', '@unocss/preset-attributify', '@unocss/preset-icons'],
        },
        // 优化文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash].[ext]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'assets/fonts/[name]-[hash].[ext]'
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash].[ext]'
          }
          return 'assets/[ext]/[name]-[hash].[ext]'
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // 压缩配置
    minify: 'terser',
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }),
    // 启用source map在开发模式
    sourcemap: command === 'serve',
  },
  server: {
    host: true,
    port: 3000,
    // 开发服务器预热
    warmup: {
      clientFiles: ['./src/main.ts', './src/App.vue'],
    },
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vueuse/core',
    ],
    exclude: [
      'vue-demi'
    ],
  },
  // CSS 配置
  css: {
    devSourcemap: true,
  },
  // 环境变量配置
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
}))
