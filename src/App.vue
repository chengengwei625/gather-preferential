<template>
  <!-- 3.0不需要根元素 -->
  <p>{{ $store.state.moduleA.username }}</p>
  <p>{{ $store.getters.newName }}</p>

  <p>{{ $store.state.moduleB.username }}</p>
  <p>{{ $store.getters['moduleB/newName'] }}</p>
  <button @click="mutationsFn">mutationsFn</button>
  <button @click="actionsFn">actionsFn</button>
</template>
<script>
//导入useStore构造函数
import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',
  setup() {
    //拿到vuex仓库实例
    const store = useStore()
    console.log(store.state.username)
    console.log(store.getters.newName)
    const mutationsFn = () => {
      store.commit('moduleB/updateName')
    }
    const actionsFn = () => {
      store.dispatch('moduleB/updateName')
    }
  }
})
</script>

<style lang="less"></style>
