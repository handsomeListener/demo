<template>
  <el-select
    ref="select"
    v-model="value"
    style="width: 100%;"
    :placeholder="placeholder"
    collapse-tags
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :filterable="true"
    :filter-method="val=> keyValue = val"
    :no-data-text="noDataText"
    @visible-change="initSelect"
    @change="changeFun(false)"
    @keyup.native="keyupFun"
    @remove-tag="proxyEvent($event, 'removeTag')"
    @clear="proxyEvent($event, 'clear')"
  >
<!--    <input-->
<!--      v-show="multiple"-->
<!--      ref="input"-->
<!--      v-model.trim="keyValue"-->
<!--      class="search-input-text"-->
<!--      type="text"-->
<!--      placeholder="请输入搜索内容"-->
<!--      @keyup="keyupFun"-->
<!--    >-->
<!--    <a-->
<!--      v-if="addStatus"-->
<!--      class="add-select-input-btn"-->
<!--      href="javascript:;"-->
<!--      @click="addFun"-->
<!--    >+新建</a>-->
    <el-option
      v-for="item in options"
      :key="item[optionKey.id]"
      :label="item[optionKey.value]"
      :value="item[optionKey.id]"
    />
  </el-select>
</template>

<script>
/*
   * @ multiple 多选 单选参数
   * @ optionKey {id:id,value:value } 下拉数据使用到的id和value
   * @ optionsList 直接传入数据的接口
   * @ defaultValue    默认输入的数组
   * @ addStatus 是否有新建按钮
   * @ dataType 返回值的类型
   * @ remote 远程搜索 默认是远程
   * @ disabled 禁用
   * @ 清除
   * @ preLoad 预先加载
   * @ loaderOptions 预先加载下拉数据
   * */

import { deepCopy } from '@/tool/tool'

export default {
  name: 'hz-base-select',
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    addStatus: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    dataType: {
      type: String,
      default: 'ID'
    },
    remote: {
      type: Boolean,
      default: true
    },
    optionKey: {
      type: Object,
      default: () => ({
        id: 'id',
        value: 'value'
      })
    },
    optionsList: {
      type: Array,
      default: undefined
    },
    url: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: [Object, Array, String, Function],
      default: undefined
    },
    preLoad: {
      type: Boolean,
      default: true
    },
    cacheStatus: {
      type: Boolean,
      default: true
    },
    loaderOptions: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [],
      value: '',
      keyValue: '',
      hasSelected: [],
      copyOptions: null
    }
  },
  computed: {
    noDataText () {
      return this.preLoad ? '无数据' : '请输入关键字查询'
    }
  },
  watch: {
    defaultValue: {
      handler (value) { // 这个是输入默认值
        if (typeof value === 'function') { // 增加一个函数类型可以带来跟大的灵活性
          value = value()
        }
        if (this.judgeValue(value)) {
          // 数据存在的时候
          if (!this.isequalDefaulValue(value)) {
            this.dealWithDefaultValue(value, true)
          }
        } else {
          this.dealWithDefaultValue(null, true)
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    if (this.optionsList) {
      // 由父级传递数组的时候
      this.options = this.detelecontactRepeat(this.hasSelected, this.optionsList)
    }
    if (this.loaderOptions) {
      this.getCommonOptions()
    }
  },
  methods: {
    // 判断默认值是否跟现在已经选择的值是否相等，如果相等则不需要触发change函数
    isequalDefaulValue (args) {
      if (_.isArray(args)) {
        const arg = []
        args.forEach(item => {
          if (_.isObject(item)) {
            if (_.get(item, [this.optionKey.id], false)) {
              arg.push(item[this.optionKey.id])
            }
          } else {
            arg.push(item)
          }
        })
        const value = [...this.value].sort()
        return _.isEqual(arg.sort(), value)
      } else if (_.isObject(args)) {
        return args[this.optionKey.id] === this.value
      } else {
        return args === this.value
      }
    },
    // 代理事件的函数
    proxyEvent (val, type) {
      this.$emit(type, val)
    },
    // 判断值存在同时不为空的时候
    judgeValue (val) {
      if (val === false || val === 0) {
        return true
      }
      if (val) { // '' undefined null 的时候为false
        return true
      }
    },
    // 暴露给父级直接调用的方法
    exposeInitFun (data) {
      if (_.isArray(this.hasSelected) && data) {
        this.hasSelected.push(data)
        this.dealWithDefaultValue(this.hasSelected)
      } else {
        this.hasSelected = []
        this.dealWithDefaultValue()
      }
      // 清除缓存 重组选中项
      this.copyOptions = null
    },
    // 处理默认值的函数
    dealWithDefaultValue (value, bool = false) {
      // 数据存在的时候
      if (_.isArray(value)) {
        const arr = _.uniq(value)
        this.value = []
        arr.forEach(item => {
          if (!_.isObject(item)) { // 默认值是一组字符串的时候
            this.value.push(item)
            return
          }
          if (this.judgeValue(item[this.optionKey.id])) { // 默认值是数组对象的的时候
            this.value.push(item[this.optionKey.id])
          }
        })
        if (this.value[0] && typeof this.value[0] !== 'string') { // 是数组对象的时候直接拼接到下拉数据上面
          this.options = this.options.concat(value)
        }
      } else if (value && _.has(value, this.optionKey.id)) { // 是对象的时候
        if (this.judgeValue(value[this.optionKey.id])) {
          this.value = value[this.optionKey.id]
          this.options.push(value)
        } else {
          this.value = this.multiple ? [] : ''
        }
      } else if (value !== '' && typeof value === 'string') { // 是字符串的时候
        this.value = this.multiple ? [value] : value
      } else {
        this.value = this.multiple ? [] : ''
      }
      this.changeFun(bool)
    },
    // 输入框 里面 键盘抬起的时候触发
    keyupFun () {
      clearTimeout(this.tempTime)
      this.tempTime = setTimeout(() => {
        this.searchFun()
      }, 1000)
    },
    // 添加 增加数据的时候
    addFun () {
      // 在新建的时候失去焦点
      this.$refs.select.blur()
      this.$emit('addFun')
    },
    // 两个数组合并的时候进行去重
    detelecontactRepeat (...args) {
      const arr = _.concat(...args) // 合并数组
      const obj = {}
      const newArr = []
      arr.forEach(item => {
        if (!obj[item[this.optionKey.id]]) {
          newArr.push(item)
          obj[item[this.optionKey.id]] = 1
        }
      })
      return newArr
    },
    // 数据回传到父级上面去
    changeFun (bool = false) {
      let hasSelected = []
      if (this.value && this.value.length > 0) {
        if (_.isArray(this.value)) { // 多选的时候
          const value = [...this.value]
          this.options.forEach(item => { // 这里的算法是最低效的算法要改进
            const find = value.find(it => it === item[this.optionKey.id])
            find && hasSelected.push(item)
          })
        } else { // 单选的时候
          const find = this.options.find(item => item[this.optionKey.id] === this.value)
          if (find) {
            hasSelected = [{ ...find }]
          }
        }
      }
      const label = []
      this.hasSelected = _.uniqWith(hasSelected, _.isEqual) // 去重
      const opt = this.hasSelected.map(item => {
        label.push(item[this.optionKey.value])
        return `${item[this.optionKey.id]}&#&${item[this.optionKey.value]}` // 统一处理的时候有用
      })
      if (this.dataType === 'VALUE') {
        this.$emit('change', label, bool)
      } else if (this.dataType === 'ID') {
        this.$emit('change', this.value, bool)
      }
      this.$emit('changeOpt', opt, bool)
      this.$emit('changeSelect', this.hasSelected, bool)
    },
    // 远程搜索的方法 bing-input
    searchFun () {
      if (this.remote) { // 开启远程 通过接口进行过滤 这个方法是异步的
        this.getCommonOptions()
      } else { // 本地搜索
        // 复制副本
        if (!this.copyOptions) {
          this.copyOptions = deepCopy(this.options)
        }
        // 使用本地过滤 没有 进行大小写转换
        if (this.keyValue) {
          this.options = this.copyOptions.filter(item => {
            return (item[this.optionKey.value].toLowerCase()).indexOf((this.keyValue.toLowerCase())) > -1
          })
        } else {
          this.options = this.copyOptions
        }
        this.options = this.detelecontactRepeat(this.options, this.hasSelected)
      }
    },
    // 通过父级调用search方法的回调函数实现 自定义的方法
    getCommonOptions () { // 搜索值没有的时候 并且copyOptions不存在的时候
      if (!this.preLoad && !this.keyValue) return
      if (this.copyOptions && !this.keyValue) { // 输入框清空的时候不发起请求
        this.options = this.detelecontactRepeat(this.hasSelected, this.copyOptions)
      } else {
        this.$emit('search', {
          value: this.keyValue || '',
          func: (list) => { // 数据的回调函数
            // eslint-disable-next-line no-undef
            if (_.isArray(list)) { // 是数组才会执行
              this.options = this.detelecontactRepeat(list, this.hasSelected)
              if (!this.copyOptions) {
                this.copyOptions = deepCopy(this.options)
              }
            }
          }
        })
      }
    },
    // 获取焦点 - 打开下拉数据 - 时候
    initSelect (event) {
      // 判断是否使用缓存
      if (!this.cacheStatus) {
        this.copyOptions = null
      }
      if (this.optionsList) {
        // 由父级传递数组的时候
        this.options = this.detelecontactRepeat(this.hasSelected, this.optionsList)
        return
      }
      if (event) {
        // 下拉数据打开的时候
        this.getCommonOptions()
      } else {
        // 下拉数据关闭的时候
        this.keyValue = ''
      }
      if (event && this.multiple) { // 自动获取焦点， 样式出现问题后期完善
        setTimeout(() => {
          this.$refs.input.focus()
        }, 100)
      }
      this.$emit('visibleChange', event)
    }
  }
}
</script>

<style scoped lang="scss">
  .select-input{
    box-sizing: border-box;
    padding: 10px;
    /deep/ .el-input__inner{
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      border-color: #409EFF;
    }
  }
  .add-select-input-btn,.search-input-text{
    display: block;
    width: 100%;
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 14px;
    color: #FFA914;
  }
  .search-input-text{
    &::placeholder{
      color: #CCCED4;
    }
    color: #0e0530;
  }
</style>
