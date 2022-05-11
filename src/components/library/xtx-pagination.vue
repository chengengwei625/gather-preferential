<template>
  <div class="xtx-pagination">
    <!-- 将来绑定事件的时候,不用监听事件源 -->
    <a v-if="myCurrentPage <= 1" href="javascript:;" class="disabled">上一页</a>
    <a @click="changePage(myCurrentPage - 1)" v-else href="javascript:;">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a @click="changePage(i)" href="javascript:;" :class="{ active: i === myCurrentPage }" v-for="i in pager.btnArr" :key="i">{{ i }}</a>
    <span v-if="pager.end < pager.pageCount">...</span>
    <a href="javascript:;" v-if="myCurrentPage >= pager.pageCount" class="disabled">下一页</a>
    <a @click="changePage(myCurrentPage + 1)" v-else href="javascript:;">下一页</a>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      //总条数
      type: Number,
      default: 100
    },
    pageSize: {
      //每页条数
      type: Number,
      default: 10
    },
    currentPage: {
      //当前页码
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    // 按钮个数
    const btnCount = 5
    // 当前第几页
    const myCurrentPage = ref(1)
    // 总条数
    const myTotal = ref(100)
    // 每页条数
    const myPageSize = ref(10)

    // 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      // 计算总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到
      // Math.floor(btnCount / 2)==>为按钮左右俩边按钮个数
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        end = start + btnCount - 1 > pageCount ? pageCount : start + btnCount - 1
      }
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount
        start = end - btnCount + 1 < 1 ? 1 : end - btnCount + 1
      }
      // 处理完毕start和end得到按钮数组(显示时看到的按钮)
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, start, end, btnArr }
    })
    // 页码点击事件
    const changePage = newPage => {
      myCurrentPage.value = newPage
      // 通知父组件最新页码
      emit('current-change', newPage)
    }
    // 监听传入值的改变
    watch(
      props,
      () => {
        myTotal.value = props.total
        myPageSize.value = props.pageSize
        myCurrentPage.value = props.currentPage
      },
      // 父组件数据写死时,不触发监听,所以加immediate
      { immediate: true }
    )

    return { pager, myCurrentPage, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
