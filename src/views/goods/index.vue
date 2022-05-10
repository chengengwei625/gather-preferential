<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/'${goods.categories[1].id}`">{{ goods.categories[1].name }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{ goods.categories[0].name }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- 商品大图 -->
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <!-- 大图下方信息 -->
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <!-- 大图右侧信息 -->
          <GoodName :goods="goods"></GoodName>
          <!-- skuId="1369155865461919746" -->
          <GoodsSku :goods="goods" @change="changeSku"></GoodsSku>
          <!-- 数量选择组件 -->
          <XtxNumbox label="数量" v-model="count" :max="goods.inventory"></XtxNumbox>
          <!-- 按钮组件 -->
          <XtxButton type="primary" style="margin-top: 20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id"></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs :goods="goods"></GoodsTabs>
          <!-- 注意事项 -->
          <GoodsWarn></GoodsWarn>
        </div>
        <!-- 24热榜+周榜 -->
        <div class="goods-aside">
          <GoodsHot></GoodsHot>
          <GoodsHot :type="2"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant' //同类商品推荐
import GoodsImage from './components/goods-image.vue' //商品大图
import GoodsSales from './components/goods-sales.vue' //商品大图下方信息
import GoodName from './components/goods-name.vue' //商品大图下方信息
import GoodsSku from './components/goods-sku' //SKU组件
import GoodsTabs from './components/goods-tabs' //tab栏切换
import GoodsHot from './components/goods-hot' //热榜商品
import GoodsWarn from './components/goods-warn' //注意事项
import { nextTick, ref, watch, provide } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup() {
    const goods = useGoods()
    // sku改变时价格，优惠价格，库存也要更新
    const changeSku = sku => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }
    // 选择的数量
    const count = ref(1)
    // 将数据提供给后代组件(由于返回的goods是ref声明的,inject注入时要.value)
    provide('goods', goods)
    return { goods, changeSku, count }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(
    () => route.params.id,
    newVal => {
      //有值并且和路由地址相同才去发请求
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then(data => {
          // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
          goods.value = null
          nextTick(() => {
            // console.log(data.result)
            goods.value = data.result
          })
        })
      }
    },
    { immediate: true }
  )
  return goods
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
