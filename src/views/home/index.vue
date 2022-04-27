<template>
  <!-- 通栏 -->
  <div class="home-entry">
    <!-- 居中版心 -->
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
      <HomeBanner></HomeBanner>
    </div>
  </div>
</template>

<script>
import HomeCategory from '@/views/home/components/home-category'
import HomeBanner from '@/views/home/components/home-banner'

export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner
  }
}
</script>

<style lang="less" scoped>
// .container {
//   .hoverShadow();
// }
</style>
