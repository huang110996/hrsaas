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
        const { roles } = await store.dispatch('user/getUserInfo') // 如果后续需要根据用户资料获取数据，这里必须改成 同步
        // 筛选用户可用路由 actions中的函数，默认是promise对象，调用这个对象想要获取返回值，必须加上await或者是then  actions是做异步操作
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 将动态路由 添加到 路由表中
        // addRoutes 必须用 next(地址)  不能用next()
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表 铺路
        // 添加动态路由之后
        next(to.path) // 相当于跳转到对应的地址 相当于多做一次跳转  为什么多做一次跳转--进门后，路还没铺好，直接走会掉坑，多做一次跳转，再冲门外进一次，路就铺好了
      } else {
        // 不是登录页 放行通过
        next()
      }
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
