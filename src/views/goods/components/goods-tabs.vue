<template>
  <div class="goods-tabs">
    <nav>
      <a @click="activeName = 'GoodsDetail'" :class="{ active: activeName === 'GoodsDetail' }" href="javascript:;">商品详情</a>
      <a @click="activeName = 'GoodsComment'" :class="{ active: activeName === 'GoodsComment' }" href="javascript:;"
        >商品评价<span>({{ goods.commentCount }})</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <!-- <GoodsDetail v-if="activeName === 'GoodsDetail'"></GoodsDetail>
    <GoodsComment v-if="activeName === 'GoodsComment'"></GoodsComment> -->
    <!-- is属性用来决定component动态组件宣染为那个组件,组件的名称 -->
    <keep-alive>
      <component :is="activeName"></component>
    </keep-alive>
  </div>
</template>

<script>
import GoodsDetail from './goods-detail' //详情
import GoodsComment from './goods-comment' //评论
import { ref, inject } from 'vue'
export default {
  name: 'GoodsTabs',
  components: { GoodsDetail, GoodsComment },
  setup() {
    // activeName的值:GoodsDetail GoodsComment
    const activeName = ref('GoodsDetail')
    //当前组件注入provide提供的数据和函数
    const goods = inject('goods')

    return { activeName, goods }
  }
}
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: '';
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
