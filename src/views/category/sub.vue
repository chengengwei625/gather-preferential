<template>
  <div class="sub-categroy">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
      <!-- 复选框 -->
      <!-- <XtxCheckbox v-model="isAllChecked">全选{{ isAllChecked }}</XtxCheckbox> -->
      <!-- 商品面板 (排序+列表) -->
      <div class="goods-list">
        <SubSort></SubSort>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SubBread from '@/views/category/components/sub-bread'
import SubFilter from '@/views/category/components/sub-filter'
import SubSort from '@/views/category/components/sub-sort'
export default {
  name: 'SubCategroy',
  components: { SubBread, SubFilter, SubSort },
  setup() {
    const isAllChecked = ref(true)
    return { isAllChecked }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
