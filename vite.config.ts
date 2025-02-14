import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import glob from 'fast-glob';
import eslintPlugin from 'vite-plugin-eslint';
import Inspector from 'vite-plugin-vue-inspector';
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    Inspector()
    // eslintPlugin({
    //   include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts']
    // })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },

  optimizeDeps: {
    include: (
      await glob(['dayjs/locale/*.js'], {
        cwd: path.resolve(__dirname, 'node_modules')
      })
    ).map(p => p.replace(/\.js$/, ''))
  },

  build: {
    sourcemap: false,
    target: 'modules',
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'index',
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      preserveEntrySignatures: 'strict',
      output: {
        terserOptions: {
          mangle: false
        },
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
}));
