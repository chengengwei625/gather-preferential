import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'

export default createStore({
  modules: {
    cart,
    user,
    category
  },
  // plugins是vuex提供的插件配置
  plugins: [
    createPersistedState({
      key: 'rabbit-fresh',
      // 需要缓存的模块
      paths: ['user', 'cart']
      // 存储的地方
      // storage: window.localStorage,
      // whiteList: [],
      // blackList: []
    })
  ]
})

// //模块A
// const moduleA = {}

// //模块B
// const moduleB = {}

//2.0 export default new Vuex.Store({
// export default createStore({
// state: {
//   username: 'zs'
// },
// getters: {
//   newName(state) {
//     return state.username + '!!!'
//   }
// },
// mutations: {
//   updateName(state) {
//     state.username = 'ls'
//   }
// },
// actions: {
//   updateName(ctx) {
//     setTimeout(() => {
//       ctx.commit('updateName')
//     }, 1000)
//   }
// },
// modules: {
//   moduleA,
//   moduleB
// }
// })
