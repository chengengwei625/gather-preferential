<template>
  <div class="detail-logistics">
    <p>
      <span>{{ logistics.list[0].time }}</span>
      <span>{{ logistics.list[0].text }}</span>
    </p>
    <a href="javascript:;" @click="onLogisticsOrder(order)">查看物流</a>
  </div>
  <!-- 参看物流 -->
  <Teleport to="#dailog">
    <OrderLogistics ref="logisticsOrderCom"></OrderLogistics>
  </Teleport>
</template>
<script>
import { ref } from 'vue'
import { logisticsOrder } from '@/api/order'
import { useLogisticsOrder } from '../index' // 导入参看物流逻辑
import OrderLogistics from './order-logistics' // 查看物流
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  // 组件实例化的时候需要执行setup,因为需要返回渲染模板需要的数据
  async setup(props) {
    const logistics = ref(null)
    // 模拟加载时间
    const $sleep = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    await $sleep()
    const data = await logisticsOrder(props.order.id)
    logistics.value = data.result

    return { logistics, ...useLogisticsOrder() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
