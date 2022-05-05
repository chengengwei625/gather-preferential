<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" @click="changeBrand(item.id)" :class="{ active: filterData.selectedBrand === item.id }" v-for="item in filterData.brands" :key="item.id">{{ item.name }}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}</div>
      <div class="body">
        <a href="javascript:;" @click="changeProp(item, prop.id)" :class="{ active: item.selectedProp === prop.id }" v-for="prop in item.properties" :key="prop.id">{{ prop.name }}</a>
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
  setup(props, { emit }) {
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
              // 品牌全部(在品牌数组对象平级增加属性记录品牌id)
              result.selectedBrand = null
              result.brands.unshift({ id: null, name: '全部' })
              // 销售属性全部
              result.saleProperties.forEach(item => {
                item.selectedProp = null
                item.properties.unshift({ id: null, name: '全部' })
              })
              console.log(result, 111)
              filterData.value = result
              filterLoading.value = false
            })
        }
      },
      { immediate: true }
    )
    // 获取筛选参数
    const getFilterParams = () => {
      // 参考数据:{brandId:'',attrs:[{groupName:'',propertyName:''},...]}
      const obj = { brandId: null, attrs: [] }
      // 品牌
      obj.brandId = filterData.value.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      //字段置空,axios判断为空不发给后台
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    //1.记录当前选择的品牌
    const changeBrand = brandId => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    //2.记录选择的销售属性
    const changeProp = (item, proId) => {
      if (item.selectedProp === proId) return
      item.selectedProp = proId
      emit('filter-change', getFilterParams())
    }
    return { filterData, filterLoading, changeBrand, changeProp }
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
