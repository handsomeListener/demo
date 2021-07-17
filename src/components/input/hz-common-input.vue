/*
* el-icon-self-money 金钱（正数）
* el-icon-negative-money 金钱（负数）
* el-icon-percent 百分比
*/
<script>

export default {
  name: 'hzCommonInput',
  props: {
    defaultValue: { // 默认值
      type: [String, Number],
      default: undefined
    },
    format: { // 输入数字的时候保留小数点
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      input: '',
      tempTime: null
    }
  },
  watch: {
    defaultValue: {
      handler (val) {
        if (val === null || val === undefined) return
        this.input = val
        this.$emit('change', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 键盘抬起
    keyupFun () {
      clearTimeout(this.tempTime)
      this.tempTime = setTimeout(() => {
        this.$emit('change', this.input)
      }, 600)
    },
    // 回车回调
    inputValueFun (event) {
      console.log('回车触发')
      this.$emit('change', this.input)
    },
    // 输入数字的时候，对数字格式进行处理，保留小数位，和数字长度等
    dealWithNumber (num) {
      return num
    }
  },
  render (h) {
    const self = this
    return h('el-input', {
      attrs: {
        placeholder: '请填写',
        ...self.$attrs
      },
      class: 'hz-common-input',
      props: {
        value: self.input
      },
      scopedSlots: {
        ...self.$slots
      },
      on: {
        input: val => {
          // 这里做输入验证的逻辑
          self.input = self.dealWithNumber(val)
        },
        blur: val => {
          this.$emit('blur', this.input)
        }
      },
      nativeOn: {
        keyup () {
          self.keyupFun()
        }
      }
    })
  }
}
</script>
<style scoped lang="scss">
  @mixin icon-style($argus){
    position: relative;
    text-align: center;
    &:after{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      content: $argus;
      font-size: 12px;
      text-align: center;
    }
  }
  input-style {
    background: #f5f7fa !important;
    color: #909399 !important;;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
  }
  .hz-common-input {
    /deep/ .el-input__suffix {
      @extend input-style;
      right: 0;
    }
    /deep/ .el-input__prefix {
      @extend input-style;
      left: 0;
    }
    /deep/ .el-icon-percent{
      @include icon-style('%')
    }
   /deep/ .el-icon-self-money {
      @include icon-style('￥')
    }
    /deep/ .el-icon-negative-money{
      @include icon-style('￥-')
    }
    /deep/ .el-icon-megabytes{
      @include icon-style('M')
    }
  }
</style>
