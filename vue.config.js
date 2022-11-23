const path = require('path')
const { config } = require('process')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  pages: {
    index: {
      // 入口文件
      entry: 'src/main.js',
    },
  },
  lintOnSave: false, // 关闭eslint语法监测
  // 开启代理服务器
  devServer: {
    host: 'localhost',
    port: '8080', // 本地运行端口
    open: true, // run自动弹出浏览器页面
    proxy: {
      '/api': {
        // target: 'https://netease-cloud-music-api-eight-gold.vercel.app',
        target: 'http://www.codeman.ink', // 这是别人的服务器，不需要去掉/api
        // pathRewrite: { '^/api': '' }, // 请求目标服务器时把 /api 去掉
        ws: true, // 用于支持websocket
        changeOrigin: true, // 用于控制请求头中的host值
      },
    },
  },
  // 设置快捷路径
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  },
}
