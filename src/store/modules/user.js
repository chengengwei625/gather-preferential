//用户模块
export default {
  namespaced: true,
  //写成函数形式相互之前不会有影响(语法要求)
  state() {
    return {
      //用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登陆后会跳地址
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息
    setUser(state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    setRedirectUrl(state, url) {
      state.redirectUrl = url
    }
  }
}
