<template>
  <div class="member-order">
    <!-- tabs栏 -->
    <XtxTabs v-model="activeName" @tab-click="changeTab">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <OrderItem v-for="item in orderList" :key="item.id" :order="item"></OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination></XtxPagination>
  </div>
</template>
<script>
import { ref, reactive } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList } from '@/api/order'
import OrderItem from '@/views/member/order/components/order-item'
export default {
  name: 'MemberOrder',
  components: { OrderItem },
  setup() {
    const activeName = ref('all')
    const changeTab = tab => {
      console.log(tab)
    }
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
    return { activeName, changeTab, orderStatus, orderList }
  }
}
</script>
<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}
</style>
