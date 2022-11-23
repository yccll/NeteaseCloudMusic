import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router' // 引入vue-router路由
import VueLazyLoad from 'vue-lazyload' // 懒加载
import ElementUI from 'element-ui' // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css' // 引入element-ui的样式
import 'assets/css/reset.css' // reset.css
// import plTable from 'pl-table'
// import 'pl-table/themes/index.css'
// import 'pl-table/themes/plTableStyle.css'

import router from './router' // 引入路由配置文件
import store from './store' // 引入vuex配置文件

Vue.use(ElementUI) // 使用element-ui
Vue.use(VueRouter) // 使用vue-router
// Vue.use(plTable)

Vue.use(VueLazyLoad, {
  loading: require('@/assets/lazy.jpg'),
  error: require('@/assets/lazy.jpg'),
  attempt: 1, // 图片加载失败后的重试次数，默认为3
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: (h) => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this // 安装全局事件总线
  },
})
