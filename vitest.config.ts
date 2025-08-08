import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import type { UserConfigExport } from 'vite'

const resolvedViteConfig: UserConfigExport =
  typeof viteConfig === 'function'
    ? // Provide defaults that work for Vitest
      (viteConfig as any)({ command: 'serve', mode: 'test' })
    : viteConfig

export default mergeConfig(
  resolvedViteConfig as any,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
