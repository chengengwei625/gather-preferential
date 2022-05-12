//扩展vue原有的功能:全局组件,自定义指令,挂载原型方法,注意:没有全局过滤器.
//这就是插件
// vue2.0插件写法要素:导出一个对象,有install函数,默认传入了Vue构造函数,Vue基础之上扩展
// vue3.0插件写法要素:导出一个对象,有install函数,默认传入了app应用实例,app基础之上扩展
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from '@/components/library/xtx-bread'
// import XtxBreadItem from '@/components/library/xtx-bread-item'
import defaultImg from '@/assets/images/200.png'
import Message from './Message.js'

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 返回一个导入函数`importFn`,它有一个 keys() 属性可以获取所有的文件路径
// 有了文件路径数组,通过遍历数组,再使用`importFn`导入组件对象
// 遍历的同时再进行全局注册
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)
// console.dir(importFn.keys()) 文件名称数组
export default {
  install(app) {
    //在app上进行扩展,app提供 component directive 函数
    //如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 批量注册全局组件
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })

    //挂载指令
    defineDirective(app)
    // 定义一个原型函数
    app.config.globalProperties.$message = Message
  }
}
//1.图片懒加载指令 v-lazy
//原理:先存储图片地址不能在src上, 当图片进入可视区, 将你存储图片地址设置给图片元素即可.
// 指令
const defineDirective = app => {
  // 图片懒加载指令
  app.directive('lazyload', {
    //vue2.0监听使用指令的DoM是否创建好,钩子函数:inserted
    //vue3.0的指令拥有的钩子函数和组件的一样,使用指令的DoM是否创建好,钩子函数:mounted
    mounted(el, binding) {
      //2,创建一个观察对象,来观察当前使用指令的元素
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            //停止观察
            observer.unobserve(el)
            //加载失败,设置默认图
            el.onerror = () => {
              el.src = defaultImg
            }
            //3.把指令的值设置给el的src属性binding.value就是指令的值
            //4.处理图片加载失败error图片加载失败的事件1oad图片加载成功
            el.src = binding.value
          }
        },
        {
          threshold: 0.01
        }
      )
      //开启观察
      observer.observe(el)
    }
  })
}
