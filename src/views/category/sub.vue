<template>
  <div class="sub-categroy">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
    </div>
  </div>
</template>

<script>
import SubBread from '@/views/category/components/sub-bread'
import SubFilter from '@/views/category/components/sub-filter'
export default {
  name: 'SubCategroy',
  components: { SubBread, SubFilter },
  setup() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
