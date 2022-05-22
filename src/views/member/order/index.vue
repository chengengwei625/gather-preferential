<template>
  <div class="member-order">
    <!-- tabs栏 -->
    <XtxTabs v-model="activeName" @tab-click="changeTab">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div v-if="!loading && orderList.length === 0" class="none">暂无数据</div>
      <OrderItem @on-cancel-order="onCancelOrder" v-for="item in orderList" :key="item.id" :order="item"></OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total > requestParams.pageSize" @current-change="requestParams.page = $event" :total="total" :page-size="requestParams.pageSize" :current-page="requestParams.page"></XtxPagination>
    <!-- 取消订单原因组件 -->
    <OrderCancel ref="orderCancelCom"></OrderCancel>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList } from '@/api/order'
import OrderItem from '@/views/member/order/components/order-item'
import OrderCancel from '@/views/member/order/components/order-cancel'
export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel },
  setup() {
    // 默认激活tab按钮
    const activeName = ref('all')
    // 请求订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])
    // 查询订单
    findOrderList(requestParams).then(data => {
      orderList.value = data.result.items
    })
    // tab点击事件
    const changeTab = tab => {
      // 此时：tab.index 就是订单的状态
      requestParams.orderState = tab.index
      requestParams.page = 1
    }
    const loading = ref(true)
    const total = ref(0)
    // 监听请求参数改变重新发请求
    watch(
      requestParams,
      () => {
        loading.value = true
        findOrderList(requestParams).then(data => {
          orderList.value = data.result.items
          total.value = data.result.counts
          loading.value = false
        })
      },
      { immediate: true }
    )
    return { activeName, changeTab, orderStatus, orderList, requestParams, loading, total, ...useCancelOrder() }
  }
}
// 封装逻辑-取消订单
const useCancelOrder = () => {
  const orderCancelCom = ref(null)
  const onCancelOrder = item => {
    // item 就是你要取消的订单
    console.log(item, 'item')
    orderCancelCom.value.open(item)
  }
  return { onCancelOrder, orderCancelCom }
}
</script>
<style scoped lang="less">
.member-order {
  height: 100%;
  min-height: 400px;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
}
.loading {
  min-height: 400px;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
