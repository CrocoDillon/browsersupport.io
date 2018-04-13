const withCSS = require('@zeit/next-css')

const { serverRuntimeConfig, publicRuntimeConfig } = require('./runtime.config')

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]__[hash:base64:5]',
  },
  serverRuntimeConfig,
  publicRuntimeConfig,
})
