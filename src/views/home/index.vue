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
  <!-- 新鲜好物 -->
  <HomeNew></HomeNew>
  <!-- 人气推荐 -->
  <HomeHot></HomeHot>
  <!-- 热门品牌 -->
  <HomeBrand></HomeBrand>
  <!-- 产品区块 -->
  <HomeProduct></HomeProduct>
  <!-- 最新专题 -->
  <HomeSpecial></HomeSpecial>
</template>

<script>
import HomeCategory from '@/views/home/components/home-category'
import HomeBanner from '@/views/home/components/home-banner'
import HomeNew from './components/home-new'
import HomeHot from './components/home-hot'
import HomeBrand from '@/views/home/components/home-brand'
import HomeProduct from '@/views/home/components/home-product'
import HomeSpecial from '@/views/home/components/home-special'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>

<style lang="less" scoped>
// .container {
//   .hoverShadow();
// }
</style>
