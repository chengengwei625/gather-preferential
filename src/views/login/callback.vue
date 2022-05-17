<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 加载中 -->
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <!-- 绑定账号或完善信息 -->
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount = true" :class="{ active: hasAccount }" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机号</span>
      </a>
      <a @click="hasAccount = false" :class="{ active: !hasAccount }" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" :nickname="nickname" :avatar="avatar" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>

  <LoginFooter />
</template>

<script>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import Message from '@/components/library/Message'
import { ref } from 'vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'PageCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup() {
    const store = useStore()
    const router = useRouter()
    const hasAccount = ref(true) // 请显示绑定手机号
    const nickname = ref(null)
    const avatar = ref(null)
    const isBind = ref(true) // 是否绑定账号
    const unionId = ref(null) // qq登录请求返回的openId
    // 假设已经绑定，默认会去做一次登录，如果登录失败证明未绑定。
    // 默认认为已经注册且绑定
    // 1. 获取QQ互联的openId也就是后台需要的unionId(16BC9D75A1E2399A59EC978CABBB32C7)
    // 2. 根据QQ互联的openId去进行登录，准备一个接口
    // 检查QQ是否登录
    if (QC.Login.check()) {
      QC.Login.getMe(openId => {
        unionId.value = openId
        userQQLogin(openId)
          .then(data => {
            // 代表：使用qq登录成功
            // 1. 存储用户信息
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            // 合并购物车成功在提示和跳转
            store.dispatch('cart/mergeLocalCart').then(() => {
              // 2. 跳转到来源页或者首页
              router.push(store.state.user.redirectUrl)
              // 3. 成功提示
              Message({ type: 'success', text: 'QQ登录成功' })
            })
          })
          .catch(e => {
            // 代表：使用qq登录失败===>1. 没绑定小兔鲜帐号  2. 没有小兔鲜帐号
            isBind.value = false
            Message({ type: 'warn', text: '请绑定手机号或完善资料' })
          })
      })
    }
    return { hasAccount, nickname, avatar, isBind, unionId }
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: 730px;
  padding: 25px 0;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
