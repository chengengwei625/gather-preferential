<template>
  <div class="sub-sort">
    <div class="sort">
      <a @click="changeSort(null)" :class="{ active: sortParams.sortField === null }" href="javascript:;">默认排序</a>
      <a @click="changeSort('publishTime')" :class="{ active: sortParams.sortField === 'publishTime' }" href="javascript:;">最新商品</a>
      <a @click="changeSort('orderNum')" :class="{ active: sortParams.sortField === 'orderNum' }" href="javascript:;">最高人气</a>
      <a @click="changeSort('evaluateNum')" :class="{ active: sortParams.sortField === 'evaluateNum' }" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod == 'asc' }" />
        <i class="arrow down" :class="{ active: sortParams.sortField === 'price' && sortParams.sortMethod == 'desc' }" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup(props, { emit }) {
    // 1. 根据后台需要的参数定义数据对象
    // 2. 根据数据对象，绑定组件（复选框，排序按钮）
    // 3. 在操作排序组件的时候，需要反馈给数据对象
    const sortParams = reactive({
      inventory: false, //显示有货商品
      onlyDiscount: false, //显示特惠商品
      //排序字段(publishTime[最新],orderNum[最高人气],price[价格],evaluateNum[评价最多])
      sortField: null,
      sortMethod: null //排序方法(asc为正序 desc为倒序)
    })

    // 改变排序
    const changeSort = sortField => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) {
          // 第一次点击，默认是降序
          sortParams.sortMethod = 'desc'
        } else {
          // 其他情况根据当前排序取反
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果排序已选中退出
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      emit('sort-change', sortParams)
    }
    //筛选条件改变
    const changeCheck = sortField => {
      //因为是响应式数据,所以sortParams不用在形参传进来
      emit('sort-change', sortParams)
    }
    return { sortParams, changeSort, changeCheck }
  }
}
</script>
<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
