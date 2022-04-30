<template>
  <div class="sub-categroy">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
    </div>
  </div>
</template>

<script>
import SubBread from '@/views/category/components/sub-bread'
export default {
  name: 'SubCategroy',
  components: { SubBread },
  setup() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
