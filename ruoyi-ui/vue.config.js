'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const CompressionPlugin = require('compression-webpack-plugin')

const name = process.env.VUE_APP_TITLE || '若依管理系统' // 网页标题

const port = process.env.port || process.env.npm_config_port || 80 // 端口

// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  transpileDependencies: ['quill'],
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0', // 允许外部访问
    port: port, // 端口号
    open: true, // 自动打开浏览器
    proxy: {
      // 代理配置
      // 详细：https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8080`, // 代理目标地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '' // 路径重写
        }
      }
    },
    disableHostCheck: true // 关闭主机检查
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' } // 设置Sass编译选项
      }
    }
  },
  configureWebpack: {
    name: name, // 网页标题
    resolve: {
      alias: {
        '@': resolve('src') // 设置路径别名
      }
    },
    plugins: [
      // 使用gzip压缩静态文件
      // 参考：http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      new CompressionPlugin({
        cache: false, // 不启用文件缓存
        test: /\.(js|css|html|jpe?g|png|gif|svg)?$/i, // 压缩文件格式
        filename: '[path][base].gz[query]', // 压缩后的文件名
        algorithm: 'gzip', // 使用gzip压缩
        minRatio: 0.8, // 压缩比例，小于 80% 的文件不会被压缩
        deleteOriginalAssets: false // 压缩后不删除原文件
      })
    ]
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // 删除预加载插件
    config.plugins.delete('prefetch') // 删除预取插件

    // 设置svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons')) // 排除icons目录
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/) // 匹配svg文件
      .include.add(resolve('src/assets/icons')) // 包含icons目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]' // 设置symbolId
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime`必须与runtimeChunk名称相同，默认是`runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()

      config.optimization.splitChunks({
        chunks: 'all', // 分割所有的代码块
        cacheGroups: {
          libs: {
            name: 'chunk-libs', // 分割第三方库
            test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录
            priority: 10, // 优先级
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          elementUI: {
            name: 'chunk-elementUI', // 分割elementUI
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // 适配cnpm
            priority: 20 // 优先级高于libs和app
          },
          commons: {
            name: 'chunk-commons', // 分割公共代码
            test: resolve('src/components'), // 匹配components目录
            minChunks: 3, // 最小共用次数
            priority: 5, // 优先级
            reuseExistingChunk: true // 复用已存在的代码块
          }
        }
      })
      config.optimization.runtimeChunk('single') // 提取runtime
    })
  }
}
