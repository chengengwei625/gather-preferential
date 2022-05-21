<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 将modelValue转成响应式数据 modelValue在父组件是ref声明的需要 .value
    const activeName = useVModel(props, 'modelValue', emit)
    // 给xtx-tabs-panel传值
    provide('activeName', activeName)
    // 点击选项卡对应的处理函数
    const tabClick = (name, index) => {
      activeName.value = name
      // 触发一个点击自定义事件
      emit('tab-click', { name, index })
    }
    return { activeName, tabClick }
  },
  render() {
    // jsx语法，它能够让我们创建节点和写html一样
    // 1. 动态插值表达式{} 2. 尽量三元表示式做判断，使用map来遍历 3.事件使用原始方式绑定
    // 获取默认插槽节点
    const panels = this.$slots.default()
    // 动态的panels逐组件集合
    const dynamicPanels = []
    panels.forEach(item => {
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        item.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })
    // 选项卡
    const nav = (
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            // () => this.tabClick(item.props.name, i) 原生标签不能用Fn(params)的方式传参 这会立即调用函数
            <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">
              {item.props.label}
            </a>
          )
        })}
      </nav>
    )
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>
<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
