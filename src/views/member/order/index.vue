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
      <OrderItem @on-delete-order="onDeleteOrder" @on-cancel-order="onCancelOrder" v-for="item in orderList" :key="item.id" :order="item"></OrderItem>
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
import { findOrderList, delteOrder } from '@/api/order'
import OrderItem from '@/views/member/order/components/order-item'
import OrderCancel from '@/views/member/order/components/order-cancel'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
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

    const loading = ref(true) // 是否显示加载动图
    const total = ref(0) // 订单总数

    // 获取订单列表(必须放watch前面,因为watch第一次就调用)
    const findOrderListFn = () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }

    // 监听请求参数改变重新发请求
    watch(
      requestParams,
      () => {
        findOrderListFn()
      },
      { immediate: true }
    )

    // 删除订单
    const onDeleteOrder = item => {
      Confirm({ text: '您确认删除该条订单吗？' })
        .then(() => {
          delteOrder([item.id]).then(() => {
            Message({ text: '删除订单成功', type: 'success' })
            findOrderListFn()
          })
        })
        .catch(e => {})
    }
    return { activeName, changeTab, orderStatus, orderList, requestParams, loading, total, ...useCancelOrder(), onDeleteOrder }
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
