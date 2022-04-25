import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import(/*webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: '/',
        component: () => import(/*webpackChunkName: "Home" */ '@/views/home')
      }
    ]
  }
]
//Vue3.0 createRouter({})创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
