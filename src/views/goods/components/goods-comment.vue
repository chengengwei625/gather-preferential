<template>
  <div class="goods-comment">
    <!-- 筛选评论 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span>
          <span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span>
          <span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a @click="changeTag(i)" v-for="(item, i) in commentInfo.tags" :key="item.title" href="javascript:;" :class="{ active: currentTagIndex === i }">{{ item.title }}（{{ item.tagCount }}）</a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a @click="reqParams.sortField = null" href="javascript:;" :class="{ active: reqParams.sortField === null }">默认</a>
      <a @click="reqParams.sortField = 'createTime'" href="javascript:;" :class="{ active: reqParams.sortField === 'createTime' }">最新</a>
      <a @click="reqParams.sortField = 'praiseCount'" href="javascript:;" :class="{ active: reqParams.sortField === 'praiseCount' }">最热</a>
    </div>
    <!-- 用户评价列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList" :key="item.id">
        <!-- 用户头像姓名 -->
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <!-- 用户评分 -->
          <div class="score">
            <i v-for="i in item.score" :key="i + 'solid'" class="iconfont icon-wjx01"></i>
            <i v-for="i in 5 - item.score" :key="i + 'hollow'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!-- 图片预览 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
          <!-- 评论时间和点赞数 -->
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total" :total="total" :page-size="reqParams.pageSize" :current-page="reqParams.page" @current-change="changePager"></XtxPagination>
  </div>
</template>
<script>
import { findCommentInfoByGoods, findGoodsCommentList } from '@/api/product'
import { ref, inject, reactive, watch } from 'vue'
import GoodsCommentImage from './goods-comment-image'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup() {
    // 评价信息
    const commentInfo = ref(null)
    // goods是ref声明的数据,所以使用时要加.value
    const goods = inject('goods')
    findCommentInfoByGoods(goods.value.id).then(data => {
      // 为请求回来的数据添加 全部评价 有图 这两项
      // type 的目的是将来点击可以区分点的是不是标签
      data.result.tags.unshift({ type: 'img', title: '有图', tagCount: data.result.hasPictureCount })
      data.result.tags.unshift({ type: 'all', title: '全部评价', tagCount: data.result.evaluateCount })
      commentInfo.value = data.result
      // console.log(data.result)
    })
    // 默认激活的按钮索引
    const currentTagIndex = ref(0)
    // 筛选条件对象
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null, //是否有图(传null axios不会发给后台)
      tag: null, // 标签(质量好)
      sortField: null // 排序字段(praiseCount 热度,createTime 最新)
    })
    // 筛选标签点击事件
    const changeTag = i => {
      currentTagIndex.value = i
      // 情况: 全部评论 有图 正常tag
      // tags: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
      const tag = commentInfo.value.tags[i]
      if (tag.type === 'all') {
        // 排他思想
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
      // 重置页码
      reqParams.page = 1
    }
    // 排序点击事件
    const changeSort = sortField => {
      reqParams.sortField = sortField
      // 重置页码
      reqParams.page = 1
    }
    // 评论列表
    const commentList = ref([])
    // 评论总数
    const total = ref(0)
    // 初始化和筛选条件都发生变化是发请求
    watch(
      reqParams,
      async () => {
        // goods是inject注入进来的,且goods是ref声明的所有要.value
        const data = await findGoodsCommentList(goods.value.id, reqParams)
        commentList.value = data.result.items
        total.value = data.result.counts
        // console.log(data.result.items)
      },
      { immediate: true }
    )
    // 格式化规格数据==>颜色:黑色 尺寸:10cm
    const formatSpecs = specs => {
      // reduce((上一次回调的值,索引为0开始) => {}, 初始值)
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
    }
    // 格式化昵称==> 兔子tony=>兔****y
    const formatNickname = nickname => {
      // substring(0,1)截取字符串0到1索引(不包括1)的值
      return nickname.substring(0, 1) + '****' + nickname.substr(-1)
    }
    // 页码改变事件
    const changePager = newPage => {
      reqParams.page = newPage
    }
    return { commentInfo, currentTagIndex, changeTag, reqParams, commentList, changeSort, formatSpecs, formatNickname, total, changePager }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
