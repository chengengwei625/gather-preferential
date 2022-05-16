import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import(/*webpackChunkName: "Layout" */ '@/views/Layout')
const Home = () => import(/*webpackChunkName: "Home" */ '@/views/home')
const TopCategory = () => import(/*webpackChunkName: "TopCategory" */ '@/views/category/index')
const SubCategory = () => import(/*webpackChunkName: "SubCategory" */ '@/views/category/sub')
const Goods = () => import(/*webpackChunkName: "Goods" */ '@/views/goods/index')
const Login = () => import(/*webpackChunkName: "Login" */ '@/views/login/index')
const LoginCallback = () => import(/*webpackChunkName: "LoginCallback" */ '@/views/login/callback')
const CartPage = () => import(/*webpackChunkName: "CartPage" */ '@/views/cart/index')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'category/:id', component: TopCategory },
      { path: 'category/sub/:id', component: SubCategory },
      { path: 'product/:id', component: Goods },
      { path: 'cart', component: CartPage }
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

export default router
