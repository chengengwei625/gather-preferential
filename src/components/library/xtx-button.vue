<template>
  <button class="xtx-button ellipsis" :class="[size, type]">
    <slot />
  </button>
</template>
<script>
export default {
  name: 'XtxButton',
  props: {
    // 默认按钮尺寸为中
    size: {
      type: String,
      default: 'middle'
    },
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>
<style scoped lang="less">
.xtx-button {
  // 取消按钮的默认样式
  appearance: none;
  border: none;
  //取消轮廓
  outline: none;
  background: #fff;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  // 指针
  cursor: pointer;
}
// 大
.large {
  width: 240px;
  height: 50px;
  font-size: 16px;
}
// 小
.middle {
  width: 180px;
  height: 50px;
  font-size: 16px;
}
// 小
.small {
  width: 100px;
  height: 32px;
  font-size: 14px;
}
// 超小
.mini {
  width: 60px;
  height: 32px;
  font-size: 14px;
}
.default {
  border-color: #e4e4e4;
  color: #666;
}
// 主要
.primary {
  border-color: @xtxColor;
  background: @xtxColor;
  color: #fff;
}
// 朴素
.plain {
  border-color: @xtxColor;
  color: @xtxColor;
  background: lighten(@xtxColor, 50%);
}
// 灰色
.gray {
  border-color: #ccc;
  background: #ccc;
  color: #fff;
}
</style>
