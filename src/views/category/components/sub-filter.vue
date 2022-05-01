<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" @click="filterData.brands.selectedBrand = item.id" :class="{ active: filterData.brands.selectedBrand === item.id }" v-for="item in filterData.brands" :key="item.id">{{ item.name }}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}</div>
      <div class="body">
        <a href="javascript:;" @click="item.selectedProp = prop.id" :class="{ active: item.selectedProp === prop.id }" v-for="prop in item.properties" :key="prop.id">{{ prop.name }}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="200px" height="40px" />
    <XtxSkeleton class="item" width="200px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
export default {
  name: 'SubFilter',
  setup() {
    // 1. 获取数据
    // 2. 数据中需要全部选中，需要预览将来点击激活功能。默认选中全部
    // 3. 完成渲染
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    // 4. 分类发生变化的时候需要重新获取筛选数据，需要使用侦听器
    watch(
      () => route.params.id,
      (newVal, oldVal) => {
        // 当你从二级分类去顶级分类也会拿到ID，不能去加载数据因为它不是二级分类的ID
        if (newVal && route.path === '/category/sub/' + newVal) {
          filterLoading.value = true
          newVal &&
            findSubCategoryFilter(route.params.id).then(({ result }) => {
              // 品牌全部
              result.brands.selectedBrand = null
              result.brands.unshift({ id: null, name: '全部' })
              // 销售属性全部
              result.saleProperties.forEach(item => {
                item.selectedProp = null
                item.properties.unshift({ id: null, name: '全部' })
              })
              console.log(result)
              filterData.value = result
              filterLoading.value = false
            })
        }
      },
      { immediate: true }
    )
    return { filterData, filterLoading }
  }
}
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
