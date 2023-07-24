const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    port: 18121, // 设置您想要的端口号
    proxy: {
      '/api': {
        target: 'http://139.224.134.138:8121',
        changeOrigin: true,
      },
    },
  },
  // publicPath: 'C:/Users/aprez/Desktop/ztrk-adm',
  lintOnSave: false  //加入此行 , false为关闭true为开启
}

