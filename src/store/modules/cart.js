import { getNewCartGoods } from '@/api/cart'
export default {
  //命名空间
  namespaced: true,
  state() {
    return {
      //购物车商品列表
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数(getters:当前模块===store.getters   rootGetters:所有getters)
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      // 四舍五入,再去计算
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList(state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList(state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll(state, getters) {
      // 有效商品数量和选中商品数量相等 并且 有效商品不能为0
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  },
  mutations: {
    // 加入购物车
    insertCart(state, goods) {
      // 需要存储的字段:id skuId name attrsText picture price nowPrice selected stock count isEffective
      //            商品id           属性文字        加入时价格 当前价格  是否选中 库存  数量   是否有效
      // 插入规则:
      // 1.先找下是否有相同商品
      // 2.如果有相同的商品,查询它的数量,累加到payload上,再保存最新位置
      // 3.如果没有相同商品,保存在最新位置即可

      const sameIndex = state.list.findIndex(item => item.skuId === goods.skuId)
      // 逻辑：有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        // 重新计算加入购物车数量
        goods.count = state.list[sameIndex].count + goods.count
        // 删除对应索引的商品
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    // 修改购物车商品
    updateCart(state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必需有skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      // 找到对应sku商品的索引
      const index = state.list.findIndex(item => item.skuId === skuId)
      // 删除对应索引的项
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 加入购物车(异步操作)
    insertCart(context, goods) {
      return new Promise((resolve, reject) => {
        // state是当前模块的状态
        // rootState是所有模块的状态
        if (context.rootState.user.token) {
          // 已登录 TODO
        } else {
          // 未登录
          context.commit('insertCart', goods)
          resolve()
        }
      })
    },
    // 获取购物车列表
    findCartList(context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = context.state.list.map(item => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr)
            .then(dataArr => {
              // dataArr数组元素顺序和promiseArr数组元素顺序一致,所以索引都一样
              dataArr.forEach((data, i) => {
                // 提交一个对象给updataCart,对象添加对应的skuId
                context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
              })
              resolve()
            })
            .catch(e => {
              reject(e)
            })
        }
      })
    },
    // 删除购物车商品
    deleteCart(ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    }
  }
}
