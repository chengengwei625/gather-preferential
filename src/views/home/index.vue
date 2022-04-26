<template>
  <div class="container">
    <!-- 首页入口 -->
    <div class="home-entry">
      <!-- 坐车分类 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
    </div>
  </div>
</template>

<script>
import HomeCategory from '@/views/home/components/home-category'

export default {
  name: 'HomePage',
  components: {
    HomeCategory
  }
}
</script>

<style lang="less" scoped>
.container {
  .hoverShadow();
}
</style>
