import VueRouter from 'vue-router'
// 引入规则（路线）
import routes from './routes'
import { Message } from 'element-ui'

// #region
/* 
  重复导航到当前路径会报错, 比如:在/user 我再点击头像导航到 /user 就会报错
  解决办法:重写VueRouter原型对象上的push方法 和 replace方法
*/
const originalPush = VueRouter.prototype.push // 保存一份
const originalReplace = VueRouter.prototype.replace
// 修改 原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
// 修改 原型对象中的replace方法
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err)
}
// #endregion

const router = new VueRouter({
  // mode: 'history',
  routes,
})

// 未登录不能跳转
let notEnter = [
  '/video/videolist',
  '/video/mv',
  '/favorites/album',
  '/favorites/singer',
  '/favorites/video',
  '/dailySongs',
]

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 登录了
  if (localStorage.getItem('userId')) {
    // 哪都能去
    next()
  } else {
    // 未登录
    let canGo = true

    notEnter.forEach((item) => {
      if (item === to.path) {
        canGo = false
      }
    })

    if (canGo) {
      next()
    } else {
      Message({
        type: 'warning',
        message: '请先登录',
      })
    }
  }
})

export default router
