import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import(/*webpackChunkName: "Layout" */ '@/views/Layout')
const Home = () => import(/*webpackChunkName: "Home" */ '@/views/home')
const TopCategory = () => import(/*webpackChunkName: "TopCategory" */ '@/views/category/index')
const SubCategory = () => import(/*webpackChunkName: "SubCategory" */ '@/views/category/sub')
const Goods = () => import(/*webpackChunkName: "SubCategory" */ '@/views/goods/index')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'category/:id', component: TopCategory },
      { path: 'category/sub/:id', component: SubCategory },
      { path: 'product/:id', component: Goods }
    ]
  }
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
