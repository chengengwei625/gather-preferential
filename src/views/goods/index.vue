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
          <XtxButton @click="insertCart" type="primary" style="margin-top: 20px">加入购物车</XtxButton>
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
import Message from '@/components/library/Message' // 提示组件
import { nextTick, ref, watch, provide } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup() {
    // 获取商品详情
    const goods = useGoods()
    // sku改变时价格，优惠价格，库存也要更新
    const changeSku = sku => {
      if (sku.skuId) {
        // 有图就保留,没图就删除picture属性
        if (!sku.skuPicture) {
          delete sku.skuPicture
        }
        // 若没选完整规格sku是 {}
        currSku.value = sku
        // console.log(sku)
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }
    // 选择的数量
    const count = ref(1)
    // 将数据提供给后代组件(由于返回的goods是ref声明的,inject注入时要.value)
    provide('goods', goods)

    // 加入购物车
    const currSku = ref(null)
    // const instance = getCurrentInstance()
    const store = useStore()
    const insertCart = () => {
      if (!currSku.value) {
        return Message({ type: 'warn', text: '请选择商品规格' })
      }
      if (count.value > goods.inventory) {
        return Message({ type: 'warn', text: '库存不足' })
      }
      store
        .dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: currSku.value.skuPicture || goods.value.mainPictures[0],
          price: currSku.value.price, // 加入时价格
          nowPrice: currSku.value.price, // 当前价格
          attrsText: currSku.value.specsText, // 属性文字
          stock: currSku.value.inventory, // 库存
          count: count.value, // 加购数量
          selected: true, // 是否选中
          isEffective: true // 是否有效
        })
        .then(() => {
          // instance.proxy.$message('加入购物车成功', 'success')
          Message({ type: 'success', text: '加入购物车成功' })
        })
    }
    return { goods, changeSku, count, insertCart }
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
