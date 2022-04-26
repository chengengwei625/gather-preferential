import request from '@/utils/request'
// 首页-全部分类（包含顶级,二级,推荐商品）
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
