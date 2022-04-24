import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//使用createApp函数基于App.vue组件创建应用实例
createApp(App).use(store).use(router).mount('#app')
