<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{ err: errors.mobile }" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{ err: errors.code }" v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span @click="send" class="code">{{ time === 0 ? '发送验证码' : `${time}秒后发送` }}</span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'
import QC from 'qc'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        console.log(res)
        avatar.value = res.data.figureurl_qq
        nickname.value = res.data.nickname
      })
    }
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 监听isMsgLogin重置表单(数据+清除校验结果)
    const formCom = ref(null)
    // watch(isMsgLogin, () => {
    //   // 重置数据
    //   form.isAgree = true
    //   form.mobile = null
    //   form.code = null
    //   // 如果是没有销毁Field组件,之前的校验结果是不会清除 例如: v-show切换的
    //   // Form组件提供了一个resetForm函数清除校验结果
    //   formCom.value.resetForm()
    // })

    const time = ref(0)
    let timer = null

    // 发送短信
    const send = async () => {
      // mySchema.mobile(form.mobile)返回校验通过状态(布尔值)
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          try {
            await userQQBindCode(form.mobile)
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
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
      // 组件销毁时暂停
      onUnmounted(() => {
        clearInterval(timer)
      })
    }
    // 使用store
    const store = useStore()
    // 使用router
    const router = useRouter()
    // 立即绑定点击事件
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
          data = await userQQBindLogin({ unionId: props.unionId, ...form })
        } catch (e) {
          if (e.response.data) {
            // 失败提示
            Message({ type: 'error', text: e.response.data.message || '绑定失败' })
          }
        }
        // 成功
        // 1. 存储信息
        const { id, account, nickname, avatar, token, mobile } = data.result
        store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
        // 合并购物车成功在提示和跳转
        store.dispatch('cart/mergeLocalCart').then(() => {
          // 2. 跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3. 成功提示
          Message({ type: 'success', text: 'QQ登录成功' })
        })
      }
    }
    return { nickname, avatar, form, mySchema, send, formCom, time, submit }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
