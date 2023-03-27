// 权限拦截在路由跳转 路由守卫
import router from '@/router'
import store from './store' // 引入store实例，相当于组件中的this.$store
import NProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

// 不需要导出，因为只需要让代码执行即可

const writeList = ['/login', '/404'] // 定义白名单

// 前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 只有在有token的情况下，才能获取资料
  // 判断是否有token
  if (store.getters.token) {
    // 有Token
    // 判断要去的地址是登录页面/login
    if (to.path === '/login') {
      // 是登录页，跳转到主页
      next('/')
    } else {
      // 只有放过的时候才去获取用户资料
      // 如果当前vuex中有用户的资料id表示，已经有资料了，不需要再获取   没有id才需要获取
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo') // 如果后续需要根据用户资料获取数据，这里必须改成 同步
      }
      // 不是登录页 放行通过
      next()
    }
  } else {
    // 没有token
    // 判断要去的地址是否在白名单
    if (writeList.indexOf(to.path) > -1) {
      // 在，放行通过
      next()
    } else {
      // 不在，跳转到登录页面
      next('/login')
    }
  }
  NProgress.done()// 手动关闭进度条
})
// 后置守卫
router.afterEach(() => {
  NProgress.done()// 关闭进度条
})
