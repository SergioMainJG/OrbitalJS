/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      isDev && devtools({ autoname: true }),
      solidPlugin(),
      tailwindcss()
    ],

resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/core': path.resolve(__dirname, 'src/core'),
        '@/application': path.resolve(__dirname, 'src/application'),
        '@/features': path.resolve(__dirname, 'src/features'),
        '@/presentation': path.resolve(__dirname, 'src/presentation'),
        '@/shared': path.resolve(__dirname, 'src/shared'),
        daisyui: path.resolve(__dirname, 'node_modules/daisyui/index.js'),
      },
      conditions: ['development', 'browser'],
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
      minify: true,
      cssMinify: true,
      modulePreload: {
        polyfill: false,
        resolveDependencies: (filename: string, deps: string[]) => {
          if (filename.includes('index')) {
            return deps.filter(
              (d) => d.includes('physics-core') || d.includes('vendor-solid')
            );
          }
          return [];
        },
      },
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'vendor-solid',
                test: /node_modules\/solid-js/,
                priority: 30,
              },
              {
                name: 'vendor-chartjs',
                test: /node_modules\/chart\.js|@kurkle\//,
                priority: 25,
              },
              {
                name: 'physics-core',
                test: /src\/core\/physics|src\/core\/engines/,
                priority: 40,
              },
              {
                name: 'vendor',
                test: /node_modules/,
                priority: 10,
                minSize: 10_000,
              },
            ],
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      // @ts-expect-error
      sourcemap: process.env.SOURCE_MAP === 'true' ? 'hidden' : false,
      reportCompressedSize: true,
    },

    optimizeDeps: {
      include: ['solid-js', 'solid-js/web', 'solid-js/store', 'chart.js'],
      exclude: ['solid-devtools', 'daisyui', '@tailwindcss/vite'],
    },

    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
      server: {
        deps: {
          inline: [/solid-js/, /@solidjs\/testing-library/],
        },
      },
      deps: {
        optimizer: {
          web: {
            enabled: true,
            include: ['solid-js', 'solid-js/web', 'solid-js/store', '@solidjs/testing-library'],
          },
        },
      },
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
    },
  };
});
