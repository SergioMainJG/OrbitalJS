/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
  plugins: [mode === 'development' && devtools({ autoname: true }), solidPlugin(), tailwindcss()],

  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~/physics': path.resolve(__dirname, 'src/physics'),
      '~/render': path.resolve(__dirname, 'src/render'),
      '~/ui': path.resolve(__dirname, 'src/ui'),
      '~/state': path.resolve(__dirname, 'src/state'),
      '~/types': path.resolve(__dirname, 'src/types'),
      '~/constants': path.resolve(__dirname, 'src/constants'),
      '~/utils': path.resolve(__dirname, 'src/utils'),
    },
    conditions: ['browser'],
  },

  server: {
    port: 3000,
    strictPort: true,
    open: false,
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 500,
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', 'src/index.tsx', 'src/**/*.d.ts'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ['solid-js', 'chart.js'],
        },
      },
    },
  },
}));
