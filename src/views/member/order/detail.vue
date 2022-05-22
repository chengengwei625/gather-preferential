<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailStep :order="order"></DetailStep>
    <!-- 物流栏 -->
    <Suspense v-if="[3, 4, 5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics @on-logistics-order="onLogisticsOrder" :order="order"></DetailLogistics>
      </template>
      <!-- 组件加载中显示 -->
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <OrderInfo :order="order"></OrderInfo>
  </div>
</template>
<script>
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action' // 操作栏
import DetailStep from './components/detail-step' // 订单进度
import DetailLogistics from './components/detail-logistics' // 物流栏
import OrderInfo from './components/detail-info' // 订单商品信息
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailStep, DetailLogistics, OrderInfo },
  setup() {
    const order = ref(null)
    const route = useRoute()
    // 获取商品信息
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
