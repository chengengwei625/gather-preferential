import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import UI from '@/components/library/index'
import 'normalize.css' //重置样式的库
import '@/assets/styles/common.less' //自己项目的重置样式和公共样式
import './mock' // 本地模拟数据
//使用createApp函数基于App.vue组件创建应用实例
const app = createApp(App)
app.config.errorHandler = (err, vm, info) => {
  console.log('[全局异常]', err, vm, info)
}
app.use(store).use(router).use(UI).mount('#app')
