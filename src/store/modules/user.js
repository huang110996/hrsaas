import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken() // 设置token初始状态   token持久化 => 放到缓存中
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token 只是修改state的数据 123 =》 1234
    // vuex变化 =》 缓存数据
    setToken(token) // vuex和缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除vuex 再清除缓存 vuex 和 缓存数据的同步
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api登录接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
