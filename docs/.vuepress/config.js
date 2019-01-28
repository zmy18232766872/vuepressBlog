module.exports = {
  title: "ZMY's Website",
  description: "ZMY's Website",
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/images/logo.jpeg' }],
    ['link', { rel: 'manifest', href: '/images/logo.jpeg' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/logo.jpeg' }],
  ],
  serviceWorker: true, // 是否开启 PWA
  base: '/', // 部署到github相关的配置
  markdown: {
    lineNumbers: true // 代码块是否显示行号
  },
  themeConfig: {
    nav:[ // 导航栏配置
      {text: '前端基础', link: '/accumulate/' },
      {text: '算法题库', link: '/algorithm/'},
      {text: '关于我', link: '/aboutme/'}
    ],
    // sidebar: auto,
    sidebar:{
      '/accumulate/': [
        {
          title: 'html',
          collapsable: true,
          children: [
            'html/canvas'
          ]
        },
        {
          title: 'css',
          collapsable: true,
          children: [
            'css/animation',
            'css/bfc',
            'css/dot-lines',
            'css/maodian'
          ]
        },
        {
          title: '打包配置',
          collapsable: true,
          children: [
            'configuration/gulp',
            'configuration/webpack',
            'configuration/webpack-vue2'
          ]
        }
      ],
      '/algorithm/': [
        {
          title: 'two-stack-to-row',
          collapsable: false,
          children: []
        }
      ],
      '/aboutme/': []
    },
    sidebarDepth: 2
  }
};