import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import Component from '@/components'

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives'
import * as filters from '@/filters'
import i18n from '@/lang'

import CheckPermission from '@/mixin/checkPermission'

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)
})

// 注册自定义组件
Vue.use(Component)
// 全局混入检查对象
Vue.mixin(CheckPermission) // 表示所有组件都拥有了检查的方法

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) // 注册全局自定义指令
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 实例化Vue
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
