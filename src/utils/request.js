import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios实例

// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 判断是否有token数据
  if (store.getters.token) {
    // 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
    // 只有在有token情况下，才有必要检查时间戳是否超时
    if (isCheckTimeOut()) {
      // 值为true 表示超时 token过期了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
  }

  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  // 响应成功时执行的代码
  response => {
    // 结构数据
    const { success, data, message } = response.data
    // 判断success
    if (success) {
      // 成功，返回data数据
      return data
    } else {
      // 失败--1.提示错误消息  2.业务执行错误，进入catch
      Message.error(message)
      return Promise.error(new Error(message))
    }
  },
  // 响应失败是执行的代码
  error => {
    // error信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) { // 表示token超时
      store.dispatch('user/logout') // 超时了登出操作
      router.push('/login') // 跳转到登出页面
    } else {
      // 提示错误消息
      Message.error(error.message)
    }
    // 返回执行错误 让当前的执行链跳出成功直接进入catch
    return Promise.reject(error)
  }
)
// 是否超时  超时逻辑  当前时间戳-缓存时间戳 是否大于 时间差
function isCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timestamp = getTimeStamp()
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service // 向外导出service

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// // )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// // export default service
