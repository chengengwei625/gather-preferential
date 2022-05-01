<template>
  <div class="sub-categroy">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
      <!-- 复选框 -->
      <XtxCheckbox v-model="isAllChecked">全选{{ isAllChecked }}</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SubBread from '@/views/category/components/sub-bread'
import SubFilter from '@/views/category/components/sub-filter'
export default {
  name: 'SubCategroy',
  components: { SubBread, SubFilter },
  setup() {
    const isAllChecked = ref(true)
    return { isAllChecked }
  }
}
</script>

<style lang="less" scoped></style>
