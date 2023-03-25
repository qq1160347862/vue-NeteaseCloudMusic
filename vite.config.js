import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 是否开启 https
  // https: false,
  // 服务端渲染
  // ssr: false,
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  publicPath:'./',
  base:process.env.NODE_ENV === 'production' ? './' : '/',
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  // outDir: 'dist',
  // resolve: {
  //   alias: {
  //     '@': resolve(__dirname, '.', 'src'),
  //   },
  // },
  // 反向代理
  server: {
    port: 8080,
    host: "0.0.0.0",
    // 是否自动在浏览器打开
    open: true,
    // 是否开启 https
    https: false,
    proxy: {
      '/api': {
        target: 'https://blog.csdn.net/weixin_45292658',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

