//1。创建一个新的axios实例
//2。请求拦截器，如果有tokenj进行头部携带
//3。响应拦截器：1。剥离无效数据2。处理token失效
//4。导出一个函数，调用当前的axios实例发请求
import Axios from 'axios'
import store from '@/store'
import router from '@/router'
//导出基准地址,原因:如上传图片等不需要通过axios发请求但是需要用到这个基地址
export const baseURL = 'http://pcapi-xiaotuxian-front-dectest.itheima.net'
const instance = Axios.create({
  baseURL,
  // baseURL: 'http://www.liulongbin.top:8000',
  timeout: 5000
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 目标：统一携带token
    // 判断本地有token再携带，判断具体api/index.js里如果没有携带Authorization,我在添加上去
    // 未定义叫undefined,null具体的值你得赋予才叫空
    const token = store.state.user.profile.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (res) {
    // 对响应数据做点什么
    res = res.data
    return res
  },
  async function (error) {
    // 对响应错误做点什么
    //判断请求是否有响应
    if (error.response && error.response.status === 401) {
      //清空无效的用户信息
      store.commit('user/setUser', {})
      //优化跳转,浏览网页地址传给登录页
      //组件里头:`/user?a=10` $route.path === /user $router.fullPath === /user?a=10
      //js模块里头:router.currentRoute.value.fullPath 就是当前路由地址,router.currentRouter 是响应式数据使用得加.value
      //encodeURIComponent转换编码格式,防止报错
      router.replace(`/login?redirectUrl=${encodeURIComponent(router.currentRoute.value.fullPath)}`)
    }

    return Promise.reject(error)
  }
)
function request(url, method, data) {
  // 俩个事儿  1 instance方法执行  2.把执行结果return
  return instance({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: data
  })
}

export default request
