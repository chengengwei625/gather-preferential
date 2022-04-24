import { createStore } from 'vuex'
//模块A
const moduleA = {}

//模块B
const moduleB = {}

//2.0 export default new Vuex.Store({
export default createStore({
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
  modules: {
    moduleA,
    moduleB
  }
})
