import request from '@/utils/request'

/**
 * 获取新的商品信息(最新价格,库存,死是否有效)
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = skuId => {
  return request(`/goods/stock/${skuId}`, 'get')
}
