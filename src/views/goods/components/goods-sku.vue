<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img v-if="val.picture" @click="clickSpecs(item, val)" :class="{ selected: val.selected, disabled: val.disabled }" :src="val.picture" :title="val.name" />
          <span v-else @click="clickSpecs(item, val)" :class="{ selected: val.selected, disabled: val.disabled }">{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
const spliter = '-'
// 根据skus数据得到路径字典对象
const getPathMap = skus => {
  const pathMap = {}
  skus.forEach(sku => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory > 0) {
      // 2. 得到sku属性值数组
      const specs = sku.specs.map(spec => spec.valueName)
      // 3. 得到sku属性值数组的子集,例如:[1,2]==>[[],[1],[2],[1,2]]
      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象 key -value
      powerSet.forEach(set => {
        const key = set.join(spliter)
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 得到当前选中规格集合
const getSelectedArr = specs => {
  const selectedArr = []
  specs.forEach(spec => {
    // 对应规格中找到选中的的项
    const selectedVal = spec.values.find(val => val.selected)
    // 按照forEach的顺序添加到selectedVal数组中
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}
// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // console.log(specs)
  specs.forEach((spec, i) => {
    // 得到选中的规格的集合
    const selectedArr = getSelectedArr(specs)
    // 遍历规格中的每一个值(按钮)对象,并设置禁用状态
    spec.values.forEach(val => {
      // 已经选中的按钮不用判断
      if (val.selected) return false
      // 未选中的替换对应的值(判断该规格下的其他值是否禁用)
      selectedArr[i] = val.name
      // console.log(selectedArr)
      // 过滤无效值得到key(过滤掉undefined)
      const key = selectedArr.filter(value => value).join(spliter)
      // console.log(key)
      // 设置禁用状态
      val.disabled = !pathMap[key]
      // console.log(val.disabled)
    })
  })
}
// 根据SKU初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  // 找到sku信息
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((item, i) => {
      const valueName = sku.specs[i].valueName
      item.values.forEach(val => {
        val.selected = val.name === valueName
      })
    })
  }
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 根据skuId初始化选中
    if (props.skuId) {
      initSelectedStatus(props.goods, props.skuId)
    }
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化:更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 规格点击事件
    const clickSpecs = (item, val) => {
      // 当按钮是禁用的阻止程序进行
      if (val.disabled) return
      // 1. 选中与取消选中逻辑
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(bv => {
          bv.selected = false
        })
        val.selected = true
      }
      // 点击按钮时:更新按钮的禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 触发change事件将sku数据传递出去
      // 过滤掉undefined,==>['黑色', '中国', '10cm']
      const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)
      // 完整的sku组合，提交给父组件
      if (selectedArr.length === props.goods.specs.length) {
        // 拼接数组 {蓝色-中国-10cm: ['1369155864430120962']}
        const skuIds = pathMap[selectedArr.join(spliter)]
        // 通过找到的路径对象的skuid找goods.skus里的sku数据项['1369155864430120962']
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // 传递
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', '')
        })
      } else {
        // 不完整的sku组合
        emit('change', {})
      }
    }
    return { clickSpecs }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
