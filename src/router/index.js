import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import store from '@/store' // js模块不用导入vuex,直接导目录默认时index.js
import { h } from 'vue'
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
const MemberHome = () => import(/*webpackChunkName: "MemberHome" */ '@/views/member/home')
const MemberOrder = () => import(/*webpackChunkName: "MemberHome" */ '@/views/member/order')
const MemberOrderDetail = () => import(/*webpackChunkName: "MemberOrderDetail" */ '@/views/member/order/detail')

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
      {
        path: 'member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          // { path: '/member/order', component: MemberOrder },
          // { path: '/member/order/:id', component: MemberOrderDetail },
          // vue3.0 模糊匹配exact-class="active"加类名需要 改成嵌套关系才能实现 <RouterView />(组件写法)
          {
            path: '/member/order',
            component: { render: () => h(<RouterView />) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MemberOrderDetail }
            ]
          }
        ]
      }
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
