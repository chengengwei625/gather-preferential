const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.join(__dirname, './src/assets/styles/mixins.less'), path.join(__dirname, './src/assets/styles/variables.less')]
    }
  },
  // vue/cli 4.x
  // chainWebpack: config => {
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap(options => Object.assign(options, { limit: 10000 }))
  // }
  // vue/cli 5.x
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10KiB
        }
      })
  }
})
