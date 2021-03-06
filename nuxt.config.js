const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '幻化成扇子的小窝',
    meta: [
      { charset: 'utf-8' },
      { name: 'google-site-verification', content: 'aGSG1y4cAYqh-gplWQbGayscj9uaaBHtlEMsdEIYRAY' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: pkg.keywords },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    script: [{ src: "res2.wx.qq.com/open/js/jweixin-1.4.0.js" }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/header.jpg' }
    ]
  },
  env: {
    title: "幻化成扇子的小窝",
    baseUrl: 'http://se7en.iego.net/api',
    HOST: pkg.config.nuxt.host,
    PORT: pkg.config.nuxt.port,
    // baseUrl: 'https://120.79.88.200:7001/',
  },
  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/loading.vue',

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/iconfont/iconfont.css'
  ],
  server: {
    port: 80, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '~plugins/filters.js',
    '@/plugins/common.js',
    '@/plugins/api.js'
  ],
  router: {
    base: '/',
    middleware: ["default"],
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
