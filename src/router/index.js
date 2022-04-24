import { createRouter, createWebHashHistory } from 'vue-router'

const routes = []
//Vue3.0 createRouter({})创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
