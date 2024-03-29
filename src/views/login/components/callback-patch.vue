<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{ errors }" class="xtx-form">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{ err: errors.account }" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{ err: errors.mobile }" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{ err: errors.code }" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
        <span @click="send" class="code">{{ time === 0 ? '发送验证码' : `${time}秒后发送` }}</span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{ err: errors.password }" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{ err: errors.rePassword }" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
// import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'

export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 1. 表单校验 多两个校验：用户名是否存在，再次输入密码是否一致
    // 2. 发送短信验证码：接口API定义
    // 3. 完善信息

    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 表单校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // -------------------------------------------------------
    const formCom = ref(null)
    const time = ref(0)
    let timer = null
    // 发送短信
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          try {
            await userQQPatchCode(form.mobile)
          } catch (error) {
            Message({ type: 'error', text: error.response.data.message || '发送失败' })
          }
          time.value = 5
          clearInterval(timer)
          timer = setInterval(() => {
            time.value--
            if (time.value <= 0) {
              clearInterval(timer)
            }
          }, 1000)
          Message({ type: 'success', text: '发送成功' })
          // time.value = 60
          // resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }

      // 组件销毁时暂停
      onUnmounted(() => {
        // pause()
        clearInterval(timer)
      })
    }

    // ----------------------------------------------------------
    // 完善信息
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      //Form组件提供了一个validate函数作为整体表单校验,当是返回的是一个promise
      const valid = await formCom.value.validate()
      // 1.准备一个AP工做帐号登录
      // 2.调用API函数
      // 3.成功:存储用户信息 + 跳转至来源页或者首页 + 消息提示
      // 4.失败:消息提示
      if (valid) {
        // 发送请求
        let data = null
        try {
          // 短信登录
          data = await userQQPatchLogin({ unionId: props.unionId, ...form })
        } catch (e) {
          if (e.response.data) {
            // 失败提示
            Message({ type: 'error', text: e.response.data.message || '完善信息失败' })
          }
        }
        // 成功
        // 1. 存储信息
        const { id, account, nickname, avatar, token, mobile } = data.result
        store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
        // 合并购物车成功在提示和跳转
        store.dispatch('cart/mergeLocalCart').then(() => {
          // 2. 提示
          Message({ type: 'success', text: '完善信息成功' })
          // 3. 跳转
          router.push(store.state.user.redirectUrl)
        })
      }
    }

    return { form, mySchema, formCom, time, send, submit }
  }
}
</script>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
