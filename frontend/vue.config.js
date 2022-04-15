const path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil')
const { resolveCss } = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {},
  css: [],
  js: []
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // 此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
        target: 'http://192.168.10.234:38088/swagger-ui/',
        host: 'http://192.168.10.234:38088/swagger-ui/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  transpileDependencies: ['@sense70/*', '@young-datafan/*'],
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/theme.less')]
    }
  },
  configureWebpack: config => {
    // 生产打包环境下，开启console、debugger等过滤
    if (process.env.NODE_ENV === 'production') {
      const compress = {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
      Object.assign(config.optimization.minimizer[0].options.terserOptions.compress, compress)
    }
    config.entry.app = ['babel-polyfill', 'whatwg-fetch', './src/main.js']
    config.performance = {
      hints: false
    }
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss
      })
    )
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    // 版本戳
    config.plugins.push(new webpack.BannerPlugin(`new version`))
    // 生产环境下将资源压缩成gzip格式
    if (isProd) {
      // add `CompressionWebpack` plugin to webpack plugins
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
    // if prod, add externals
    if (isProd) {
      config.externals = assetsCDN.externals
    }
  },
  chainWebpack: config => {
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProd) {
      config.plugin('optimize-css').tap(args => {
        args[0].cssnanoOptions.preset[1].colormin = false
        return args
      })
    }
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
