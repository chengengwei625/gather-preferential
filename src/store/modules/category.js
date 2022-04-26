import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state() {
    return {
      //分类集合
      list: topCategory.map(item => ({ name: item }))
    }
  },
  //修改分类函数
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    show(state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide(state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  actions: {
    async getList({ commit }) {
      const data = await findAllCategory()

      //给每个分类加上控制二级分类显示隐藏的数据
      data.result.forEach(top => {
        top.open = false
      })
      commit('setList', data.result)
    }
  }
}
