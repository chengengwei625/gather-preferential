//提供首页相关的API接口
import request from '@/utils/request'
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
//获取轮播图数据
export const findBanner = () => {
  return request('/home/banner', 'get')
}
