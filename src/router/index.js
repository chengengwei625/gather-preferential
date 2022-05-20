import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store' // js模块不用导入vuex,直接导目录默认时index.js
const Layout = () => import(/*webpackChunkName: "Layout" */ '@/views/Layout')
const Home = () => import(/*webpackChunkName: "Home" */ '@/views/home')
const TopCategory = () => import(/*webpackChunkName: "TopCategory" */ '@/views/category/index')
const SubCategory = () => import(/*webpackChunkName: "SubCategory" */ '@/views/category/sub')
const Goods = () => import(/*webpackChunkName: "Goods" */ '@/views/goods/index')
const Login = () => import(/*webpackChunkName: "Login" */ '@/views/login/index')
const LoginCallback = () => import(/*webpackChunkName: "LoginCallback" */ '@/views/login/callback')
const CartPage = () => import(/*webpackChunkName: "CartPage" */ '@/views/cart/index')
const Checkout = () => import(/*webpackChunkName: "Checkout" */ '@/views/member/pay/checkout')
const PayIndex = () => import(/*webpackChunkName: "PayIndex" */ '@/views/member/pay/index')
const PayResult = () => import(/*webpackChunkName: "PayResult" */ '@/views/member/pay/result')
const MemberLayout = () => import(/*webpackChunkName: "MemberLayout" */ '@/views/member/Layout')
// const MemberHome = () => import(/*webpackChunkName: "MemberHome" */ '@/views/member/home')
const routes = [
  {
    // 一级路由布局容器
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'category/:id', component: TopCategory },
      { path: 'category/sub/:id', component: SubCategory },
      { path: 'product/:id', component: Goods },
      { path: 'cart', component: CartPage },
      { path: 'member/checkout', component: Checkout },
      { path: 'member/pay', component: PayIndex },
      { path: 'pay/callback', component: PayResult },
      { path: 'member', component: MemberLayout }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: LoginCallback }
]
//Vue3.0 createRouter({})创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  //路由跳转时返回顶部区域
  scrollBehavior() {
    //vue2.0 x y 控制
    //vue3.0 left top控制
    return { legt: 0, top: 0 }
  }
})
// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 用户信息
  const token = store.state.user.profile.token
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    // next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})
export default router
