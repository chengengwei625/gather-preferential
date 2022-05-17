import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, updateCart } from '@/api/cart'
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
    },
    // 修改sku规格函数
    updateCartSku(state, newGoods) {
      // 找到对应sku商品的索引
      const index = state.list.findIndex(item => item.skuId === newGoods.oldSkuId)
      const sameIndex = state.list.findIndex(item => item.skuId === newGoods.skuId)
      // 逻辑：有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        // 重新计算加入购物车数量
        newGoods.count = state.list[sameIndex].count + newGoods.count
        // 删除相同商品和本身商品对应索引的值
        state.list.splice(index, 1)
        state.list.splice(sameIndex, 1)
        // 在数组最前面追加新商品
        state.list.unshift(newGoods)
      } else {
        // 没有相同的商品替换
        state.list.splice(index, 1, newGoods)
      }
    },
    // 设置购物车列表(清空或从服务器设置给本地)
    setCartList(state, list) {
      state.list = list
    }
  },
  actions: {
    // 加入购物车(异步操作)
    insertCart(ctx, goods) {
      return new Promise((resolve, reject) => {
        // state是当前模块的状态
        // rootState是所有模块的状态
        if (ctx.rootState.user.profile.token) {
          // 已登录 TODO
          insertCart(goods)
            .then(() => {
              // 成功时调用API获取购物车列表
              return findCartList()
            })
            .then(data => {
              // 根据上面的列表设置给vuex
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 未登录
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },
    // 获取购物车列表
    findCartList(ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录后调用API获取购物车列表
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = ctx.state.list.map(item => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr)
            .then(dataArr => {
              // dataArr数组元素顺序和promiseArr数组元素顺序一致,所以索引都一样
              dataArr.forEach((data, i) => {
                // 提交一个对象给updataCart,对象添加对应的skuId
                ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
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
          deleteCart([skuId])
            .then(() => {
              // 成功时调用API获取购物车列表
              return findCartList()
            })
            .then(data => {
              // 根据上面的列表设置给vuex
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 本地
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 修改购物车商品
    updateCart(ctx, goods) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          updateCart(goods)
            .then(() => {
              // 成功后调用API更新购物车数据
              return findCartList()
            })
            .then(data => {
              // 将数据设置给vuex
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 本地
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },
    // 有效商品的全选&反选
    checkAllCart(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除选中商品
    batchDeleteCart(ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          // 得到需要删除的商品列表（失效，选中）的skuId集合
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids)
            .then(() => {
              // 成功后调用API更新购物车数据
              return findCartList()
            })
            .then(data => {
              // 将数据设置给vuex
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          // isClear为真时删除选中有效商品,为假时删除无效商品
          ctx.getters[!isClear ? 'selectedList' : 'invalidList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改sku规格函数
    updateCartSku(ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
          // 1. 获取旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText, skuPicture: picture } = newSku
          const newGoods = { ...oldGoods, skuId, oldSkuId, nowPrice, stock, attrsText, picture }
          // 4. 去替换即可
          ctx.commit('updateCartSku', newGoods)
        }
      })
    },
    // 合并本地购物车
    async mergeLocalCart(ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    }
  }
}
