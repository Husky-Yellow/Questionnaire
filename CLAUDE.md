# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript mobile-first H5 application with PWA capabilities, using modern tooling and mobile-optimized architecture.

## Development Commands

Use pnpm as the package manager (specified in packageManager field):

- `pnpm dev` - Start development server on port 3000 with host true
- `pnpm build` - Production build with type checking (runs type-check + build-only in parallel)
- `pnpm build-only` - Build without type checking
- `pnpm type-check` - Run Vue TypeScript compiler
- `pnpm test:unit` - Run Vitest unit tests
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm build:pwa` - Build with PWA enabled (VITE_ENABLE_PWA=true)
- `pnpm analyze` - Build in analyze mode for bundle analysis

## Architecture & Structure

### Mobile-First H5 Application
- **Responsive Design**: Built mobile-first with breakpoints in uno.config.ts (xs: 375px to xl: 1280px)
- **Safe Area Support**: CSS safe area utilities for iOS notch/dynamic island (`safe-area-top`, `safe-area-bottom`)
- **Device Detection**: App store automatically detects iOS/Android/mobile in src/stores/app.ts:44-49

### State Management (Pinia)
- **App Store** (src/stores/app.ts): Global app state, theme, network status, device info, safe area insets
- **User Store** (src/stores/user.ts): Authentication, user profile, token management
- **Counter Store** (src/stores/counter.ts): Example store
- Stores have persistence configured with localStorage

### API Layer
- **Composable API** (src/composables/useApi.ts): VueUse-based HTTP client with interceptors
- Automatic JWT token injection, 401 redirect handling, timeout configuration
- Environment-based configuration (VITE_API_BASE_URL, VITE_API_TIMEOUT)

### Styling (UnoCSS)
- **Atomic CSS** with mobile-optimized shortcuts in uno.config.ts
- **Custom Shortcuts**: `flex-center`, `btn-primary`, `card`, `touch-action`
- **Icon System**: Preset icons with 1.2 scale for mobile
- **Theme Colors**: Primary color system with CSS custom properties

### PWA Features
- **Service Worker**: public/sw.js for offline capabilities
- **Manifest**: public/manifest.json configured for mobile app experience
- **Install Composable**: src/composables/usePWA.ts handles installation flow

### Build Configuration
- **Code Splitting**: Manual chunks for vendor (vue, vue-router, pinia) and utils (@vueuse/core)
- **Chunk Size Warning**: Set to 1000kb limit
- **Development**: Vue DevTools enabled, UnoCSS integration

## Testing
- **Vitest** with jsdom environment for Vue component testing
- Test files in `src/components/__tests__/`
- Example: HelloWorld.spec.ts

## Key Conventions
- **Composition API**: All components use `<script setup lang="ts">`
- **TypeScript**: Strict typing throughout with multiple tsconfig files
- **Mobile Optimization**: Touch-friendly interactions, safe area handling
- **Progressive Enhancement**: PWA features with graceful fallbacks

## Important Files
- **src/main.ts**: App initialization, store setup, device detection
- **src/stores/app.ts**: Core mobile app functionality and device handling
- **uno.config.ts**: Mobile-first CSS utilities and theme configuration
- **vite.config.ts**: Build optimization and development server config