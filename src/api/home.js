//提供首页相关的API接口
import request from '@/utils/request'
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
