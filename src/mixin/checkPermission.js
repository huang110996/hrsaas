import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是组件的选项
  methods: {
    // 检查权限 有/没有  key就是检查的点
    checkPermission(key) {
      // 去用户信息里面找，points中有没有key 有-有权限  没有-没权限
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) { // 有数据进入到该判断
        return userInfo.roles.points.some(item => item === key) // points找到key相等的值，返回true
      }
      return false // 如没进入到if判断，说明没有权限
    }
  }
}
