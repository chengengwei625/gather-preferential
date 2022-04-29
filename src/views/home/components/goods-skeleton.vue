<template>
  <div class="box">
    <div class="cover">
      <XtxSkeleton bg="#e4e4e4" width="240px" height="610px" shan />
    </div>
    <div class="goods-skeleton">
      <div class="item" v-for="i in 8" :key="i" :style="{ backgroundColor: bg }">
        <XtxSkeleton bg="#e4e4e4" width="160px" height="160px" animated />
        <XtxSkeleton bg="#e4e4e4" width="178px" height="44px" shan />
        <XtxSkeleton bg="#e4e4e4" width="178px" height="22px" shan />
        <XtxSkeleton bg="#e4e4e4" width="70px" height="28px" shan />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsSkeleton',
  props: {
    bg: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped lang="less">
.box {
  display: flex;
  padding-top: 115px;
  .goods-skeleton {
    width: 990px;
    height: 610px;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: space-between;
    padding-top: 10px;
    .item {
      width: 240px;
      height: 300px;
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-last-child(-n + 4) {
        margin-bottom: 0;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
      .xtx-skeleton ~ .xtx-skeleton {
        display: block;
        margin: 16px auto 0;
      }
      .xtx-skeleton:nth-child(2) {
        margin-top: 6px;
      }
      .xtx-skeleton:nth-child(3) {
        margin-top: 6px;
      }
      .xtx-skeleton:nth-child(4) {
        margin: 10px 0 0 30px;
        float: left;
      }
    }
  }
}
//骨架动画
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
