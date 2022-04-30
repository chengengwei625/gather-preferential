<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <!-- 动画模式mode:旧组件退出,新组件进入 -->
        <Transition name="fade-right" mode="out-in">
          <!-- 加key是给组件添加唯一标识,从而触发触发动画条件 -->
          <XtxBreadItem :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" />
              <p>{{ sub.name }}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/category'
import GoodsItem from '@/views/category/components/goods-item'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup() {
    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    // 面包屑+所有分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      // console.log(route.params.id)
      // console.log(store.state.category.list)
      let cate = {} //有数据才给cate,上面模板就不用判断了
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    //获取各个子类目下推荐商品
    const subList = ref([])
    // findTopCategory(route.params.id).then(data => {
    //   subList.value = data.result.children
    // })
    async function findTopCategoryFn() {
      const data = await findTopCategory(route.params.id)
      // console.log(data)
      subList.value = data.result.children
    }
    watch(
      () => route.params.id,
      //取对象里面的属性,要用函数进行监听
      newVal => {
        // newVal && findTopCategoryFn()
        //防止跳转二级类目被监听为跳转一级类目,从而报错
        if (newVal && `/category/${newVal}` === route.path) findTopCategoryFn()
      },
      { immediate: true }
    )
    return { sliders, topCategory, subList }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  //子分类关联商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
