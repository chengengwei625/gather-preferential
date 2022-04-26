import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import(/*webpackChunkName: "Layout" */ '@/views/Layout')
const Home = () => import(/*webpackChunkName: "Home" */ '@/views/home')
const TopCategory = () => import(/*webpackChunkName: "TopCategory" */ '@/views/category/index')
const SubCategory = () => import(/*webpackChunkName: "SubCategory" */ '@/views/category/sub')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'category/:id', component: TopCategory },
      { path: 'category/sub/:id', component: SubCategory }
    ]
  }
]
//Vue3.0 createRouter({})创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
