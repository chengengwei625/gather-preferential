<template>
  <!-- 顶部通栏 -->
  <AppNavbar></AppNavbar>
  <!-- 吸顶头部 -->
  <AppHeaderSticky></AppHeaderSticky>
  <!-- 头部组件 -->
  <AppHeader></AppHeader>
  <!-- 内容容器 -->
  <div class="main">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>
  <!-- 底部组件 -->
  <div>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import AppNavbar from '@/components/app-navbar.vue'
import AppHeaderSticky from '@/components/app-header-sticky'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'

export default {
  name: 'Layout',
  setup() {
    //获取分类数据
    const store = useStore()
    store.dispatch('category/getList')
    return {}
  },

  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  }
}
</script>

<style lang="less" scoped>
.main {
  min-height: 600px;
}
</style>
