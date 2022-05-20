<template>
  <XtxDialog :title="`${formData.id ? '编辑' : '添加'}收货地址`" v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity :fullLocation="formData.fullLocation" @change="changeCty" placeholder="请选择所在地区" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton @click="dialogVisible = false" type="gray" style="margin-right: 20px">取消</XtxButton>
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import Message from '@/components/library/Message'
import { addAddress, editAddress } from '@/api/order'
export default {
  name: 'AddressEdit',
  emits: ['success'],
  setup(props, { emit }) {
    // 控制对话框显示隐藏
    const dialogVisible = ref(false)
    // 打开函数
    const open = form => {
      dialogVisible.value = true
      if (form.id) {
        // 传人{}的时候就是清空，否则就是赋值
        for (const key in form) {
          formData[key] = form[key]
        }
      } else {
        // 清空表单数据
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 0
          } else {
            formData[key] = null
          }
        }
      }
    }
    // 表单数据
    const formData = reactive({
      receiver: '', // 收货人
      contact: '', // 手机号
      provinceCode: '', // 省
      cityCode: '', // 市
      countyCode: '', // 县
      address: '', // 详细地址
      postalCode: '', // 邮政编码
      addressTags: '', // 地址标签
      isDefault: 0, // 是否为默认地址
      fullLocation: '' // 完整行政区地址
    })
    // 选择地区
    const changeCty = data => {
      formData.provinceCode = data.provinceCode // 省
      formData.cityCode = data.cityCode // 市
      formData.countyCode = data.countyCode // 县
      formData.fullLocation = data.fullLocation // 完整行政区
    }
    // 提交操作
    const submit = () => {
      // 有id则证明是修改地址
      if (formData.id) {
        editAddress(formData).then(() => {
          // 修改成功
          Message({ text: '修改收货地址成功', type: 'success' })
          // 隐藏
          dialogVisible.value = false
          // 提交表单对象给父组件
          emit('success', formData)
        })
      } else {
        // 添加地址
        addAddress(formData).then(data => {
          // 提示
          Message({ text: '添加收货地址成功', type: 'success' })
          // 记录地址id
          formData.id = data.result.id
          // 隐藏
          dialogVisible.value = false
          // 提交表单对象给父组件
          emit('success', formData)
        })
      }
    }
    return { dialogVisible, open, formData, changeCty, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
