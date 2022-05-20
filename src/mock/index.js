import Mock from 'mockjs'
import qs from 'qs'
// mock的配置
Mock.setup({
  timeout: '500-1000' // 随机延时500-1000毫秒
})
// 拦截请求，
// 第一个参数：url，使用正则去匹配
// 第二个参数：请求方式
// 第三个参数： 生成数据的函数

// 模拟 我的收藏
Mock.mock(/\/member\/collect/, 'get', config => {
  const queryString = config.url.split('?')[1] // 将url以?分隔成数组,取索引为1数据
  const queryObject = qs.parse(queryString) // 查询字符串解析成对象
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(
      Mock.mock({
        id: '@integer(4003000,4006000)', // 随机整数
        name: '@ctitle(10,20)', // 随机中文
        desc: '@ctitle(4,10)', // 随机中文
        price: '@float(100,200,2,2)', // 随机浮点数字
        // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
        picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
      })
    )
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})
