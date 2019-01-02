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
      { hid: 'Keywords', name: 'Keywords', content: pkg.keywords },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    script: [{ src: "http://res2.wx.qq.com/open/js/jweixin-1.4.0.js" }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/header.jpg' }
    ]
  },
  env: {
    title: "幻化成扇子的小窝",
    // baseUrl: 'http://127.0.0.1:7001/',
    baseUrl: 'http://120.79.88.200:7001/',
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
  ],

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
