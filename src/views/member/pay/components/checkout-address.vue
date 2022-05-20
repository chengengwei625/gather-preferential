<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, '') + showAddress.address }}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换收货地址 - 确认框组件 -->
  <XtxDialog ref="addressEdit" title="切换收货地址" v-model:visible="dialogVisible">
    <div @click="selectedAddress = item" :class="{ active: selectedAddress?.id === item.id }" class="text item" v-for="item in list" :key="item.id">
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li><span>联系方式：</span>{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
        <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') + item.address }}</li>
      </ul>
    </div>
    <template #footer>
      <XtxButton @click="dialogVisible = false" type="gray" style="margin-right: 20px">取消</XtxButton>
      <XtxButton @click="confirmAddress()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加收货地址组件 -->
  <AddressEdit @success="successHandler()" ref="addressEdit"></AddressEdit>
</template>
<script>
import AddressEdit from './address-edit'
import { ref } from 'vue'
import { editAddress } from '@/api/order'
export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  // 1. 在拥有根元素的组件中，触发自定义事件，有没有emits选项无所谓
  // 2. 如果你的组件渲染的代码片段，vue3.0规范，需要在emits中申明你所触发的自定义事件
  // 3. 提倡：你发了自定义事件，需要在emits选项申明下，代码可读性很高
  emits: ['change'],
  setup(props, { emit }) {
    // 显示的地址
    const showAddress = ref(null)
    if (props.list?.length) {
      const defaultAddress = props.list.find(item => item.isDefault === 0)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // 有常用地址就赋值第一个
        if (props.list.length) {
          // showAddress.value 和 props.list[0]是同一个数据的引用,以后修改showAddress也会修改props.list[0]
          // 因为props是只读的,所以ESLint会报错,加上下面这条注释可以忽略这个校验规则
          // eslint-disable-next-line vue/no-setup-props-destructure
          showAddress.value = props.list[0]
        }
      }
    }
    // 控制确认框的显示和隐藏
    const dialogVisible = ref(false)
    // 默认通知一个地址ID给父
    emit('change', showAddress.value?.id)
    // 记录选择的地址
    const selectedAddress = ref(null)
    // 打开对话框
    const openDialog = () => {
      // 显示
      dialogVisible.value = true
      // 清空选中
      selectedAddress.value = null
    }
    // 确认地址
    const confirmAddress = () => {
      // 隐藏
      dialogVisible.value = false
      // 记录选中
      showAddress.value = selectedAddress.value
      const oldAddress = props.list.find(item => item?.isDefault === 0)
      if (oldAddress) {
        oldAddress.isDefault = 1
        editAddress(oldAddress)
      }
      showAddress.value.isDefault = 0
      editAddress(showAddress.value)

      // 默认通知一个地址ID给父
      emit('change', showAddress.value?.id)
    }
    // 添加收货地址组件
    const addressEdit = ref(null)
    const openAddressEdit = formData => {
      // 调用组件内部暴漏的open方法
      addressEdit.value.open(formData)
    }
    // 添加地址组件 - 添加成功触发的自定义事件
    const successHandler = formData => {
      const address = props.list.find(item => item?.id === formData?.id)
      // 有id证明是修改地址
      if (address) {
        // 修改
        for (const key in address) {
          address[key] = formData[key]
        }
        showAddress.value = formData
      } else {
        // 需要克隆下，不然使用的是对象的引用,组件内部清空数据也会清空这里的数据
        // props.list是复杂数据类型,所以可以修改
        // props.list.unshift(JSON.parse(JSON.stringify(formData)))
        const { ...newData } = formData
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(newData)
      }
    }
    return { showAddress, dialogVisible, selectedAddress, openDialog, confirmAddress, addressEdit, openAddressEdit, successHandler }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
