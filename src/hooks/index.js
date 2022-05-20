//提供复用逻辑的函数(钩子)
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
export const useLazyData = apiFn => {
  const result = ref([])
  const target = ref(null)
  // target 是DOM对象
  // apiFn是 接口
  // stop 是停止观察是否进入或移出可视区域的行为
  const { stop } = useIntersectionObserver(
    // target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
    target,
    // isIntersecting 是否进入可视区域，true是进入 false是移出
    // observerElement 被观察的dom
    ([{ isIntersecting }], observerElement) => {
      // 在此处可根据isIntersecting来判断，然后做业务
      if (isIntersecting) {
        stop()
        //调用接口取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    //配置对像,组件出现在可视区域的比例(数值型)
    { threshold: 0 }
  )
  return { result, target }
}
/**
 * 订单时间格式化
 * @returns {function,String} start timeText
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    },
    1000,
    false
  )
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间
  const start = countdown => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
