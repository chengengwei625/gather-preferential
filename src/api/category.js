import request from '@/utils/request'
// 首页-全部分类（包含顶级,二级,推荐商品）
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
/**
 * 获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */
export const findTopCategory = id => {
  return request('/category', 'get', { id })
}
