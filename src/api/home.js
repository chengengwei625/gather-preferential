//提供首页相关的API接口
import request from '@/utils/request'
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
//首页-轮播图数据
export const findBanner = () => {
  return request('/home/banner', 'get')
}
//首页-新鲜好物
export const findNew = () => {
  return request('home/new', 'get')
}
//首页-人气推荐
export const findHot = () => {
  return request('home/hot', 'get')
}
//首页-产品区块
export const findGoods = () => {
  return request('home/goods', 'get')
}
//首页-最新专题
export const findSpecial = () => {
  return request('home/special', 'get')
}
