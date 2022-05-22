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
      <OrderItem @on-logistics="onLogisticsOrder" @on-confirm-order="onConfirmOrder" @on-delete-order="onDeleteOrder" @on-cancel-order="onCancelOrder" v-for="item in orderList" :key="item.id" :order="item"></OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total > requestParams.pageSize" @current-change="requestParams.page = $event" :total="total" :page-size="requestParams.pageSize" :current-page="requestParams.page"></XtxPagination>
    <!-- 取消订单原因组件 -->
    <OrderCancel ref="orderCancelCom"></OrderCancel>
    <!-- 参看物流 -->
    <OrderLogistics ref="logisticsOrderCom"></OrderLogistics>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants' // 订单分类
import { findOrderList, delteOrder, confirmOrder } from '@/api/order'
import OrderItem from '@/views/member/order/components/order-item' // 订单项
import OrderCancel from '@/views/member/order/components/order-cancel' // 订单取消
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics' // 查看物流
export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
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
    return { activeName, changeTab, orderStatus, orderList, requestParams, loading, total, ...useCancelOrder(), onDeleteOrder, ...useConfirmOrder(), ...useLogisticsOrder() }
  }
}
// 封装逻辑-取消订单
export const useCancelOrder = () => {
  const orderCancelCom = ref(null)
  const onCancelOrder = item => {
    // item 就是你要取消的订单
    orderCancelCom.value.open(item)
  }
  return { onCancelOrder, orderCancelCom }
}
// 封装逻辑-确认收货
const useConfirmOrder = () => {
  const onConfirmOrder = item => {
    // item 就是你要确认收货的订单
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(item.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // 确认收货后状态变成 待评价
        item.orderState = 4
      })
    })
  }
  return { onConfirmOrder }
}
// 封装逻辑-查看物流
export const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const onLogisticsOrder = item => {
    logisticsOrderCom.value.open(item)
  }
  return { onLogisticsOrder, logisticsOrderCom }
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
