<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div v-show="show" class="large" :style="[{ backgroundImage: `url(${images[currIndex]})` }, largePosition]"></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!-- 遮罩色块 -->
      <div v-show="show" class="layer" :style="layerPosition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img, i) in images" :key="i" :class="{ active: i === currIndex }">
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const currIndex = ref(0)
    // 1.是否显示遮罩和大图
    const show = ref(false)
    // 2.遮罩的坐标(样式)
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 3.大图背景定位(样式)
    const largePosition = reactive({
      backgroundPositionX: '100px',
      backgroundPositionY: 0
    })
    // 4.使用useMouseInElement得到基于元素左上角的坐标和是否离开元素的数据
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // elementX是ref声明的响应式数据,所以不用()=>{elementX}
    watch([elementX, elementY, isOutside], () => {
      // console.log(elementX)
      // 5.根据得到的数据设置样式数据和是否显示数据
      // 设置是否显示预览大图
      show.value = !isOutside.value
      const position = { x: 0, y: 0 }
      // 控制X轴方向的定位 0-200 之间
      if (elementX.value < 100) position.left = 0
      else if (elementX.value > 300) position.left = 200
      else position.left = elementX.value - 100
      // 控制Y轴方向的定位 0-200 之间
      if (elementY.value < 100) position.top = 0
      else if (elementY.value > 300) position.top = 200
      else position.top = elementY.value - 100
      // 设置遮罩容器的定位
      layerPosition.left = position.left + 'px'
      layerPosition.top = position.top + 'px'
      // 设置大背景的定位
      largePosition.backgroundPositionX = -position.left * 2 + 'px'
      largePosition.backgroundPositionY = -position.top * 2 + 'px'
    })
    return { currIndex, show, layerPosition, largePosition, target }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.4);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
