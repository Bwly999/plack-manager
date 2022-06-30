import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import unocss from 'unocss/vite';

const { env } = process;
export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader({ svgoConfig: {} }), unocss()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js'],
  },
  // 本地反向代理解决浏览器跨域限制
  // server: {
  //   host: '0.0.0.0',
  //   port: Number(env.VITE_APP_PORT),
  //   open: true, // 运行自动打开浏览器
  //   proxy: {
  //     [env.VITE_APP_BASE_API]: {
  //       target: 'http://127.0.0.1:8080',
  //       changeOrigin: true,
  //       rewrite: (path) =>
  //         path.replace(new RegExp(`^${env.VITE_API_BASE_URL}`), ''),
  //     },
  //   },
  // },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
