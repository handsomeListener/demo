<script>
import HzDateSelect from '@/components/date/hz-date-select'
import HzCommonInput from '@/components/input/hz-common-input'
import HzCommonSelect from '@/components/select/hz-common-select'
export default {
  name: 'NfFilterBox',
  components: {
    HzDateSelect,
    HzCommonSelect,
    HzCommonInput
  },
  props: {
    /* { 所需要的参数数据 } */
    filterData: {
      default: () => [],
      type: [Object, Array],
      required: true
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    detailsData: {
      type: [Object, null],
      default: () => {}
    },
    isDetails: {
      type: Boolean
    },
    spanNum: {
      type: Number,
      default: 6
    },
    gutter: {
      type: Number,
      default: 10
    },
    rules: {
      type: Object,
      default: undefined
    },
    formData: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      form: {},
      outLink: {}
    }
  },
  methods: {
    inputValueFun (val, key) {
      // 处理普通的输入框
      this.form[key] = val
      this.submit(key)
    },
    // 返回函数的方法
    submit (key) {
      // 初始化报错样式
      // this.$refs[key] && this.$refs[key].$el.classList.remove('is-error')
      this.$emit('submit', this.form)
    },
    // 在详情的时候该方法的渲染
    detailsRenderFun (h, item) {
      if (!this.detailsData) {
        throw Error('请检查参数detailsData！')
      }
      let detailData = item.detailKey
        ? this.detailsData[item.detailKey]
        : this.detailsData[item.valueKey]
      if (typeof detailData === 'function') {
        // 直接渲染自定义的render函数
        return detailData(h, item)
      }
      if (typeof item.detailKey === 'function') {
        return item.detailKey(h, item)
      }
      const props = {
        disabled: true,
        placeholder: ''
      }
      switch (item.type) {
        case 'input':
          return h('hz-common-input', {
            attrs: {
              ...item.props,
              ...props,
              defaultValue: detailData || ''
            }
          })
        case 'textarea':
          return h('hz-common-input', {
            attrs: {
              ...item.props,
              ...props,
              defaultValue: detailData || ''
            }
          })
        default:
          return h('el-input', {
            props: {
              ...props,
              value: detailData
            }
          })
      }
    },
    // 各大函数执行change事件
    allChangeFun (cb, event, outLink, type) {
      if (typeof cb === 'function') {
        let index
        if (Array.isArray(outLink)) {
          // 当outLink 是一个数组的时候
          index = []
          outLink.forEach(item => {
            index.push(this.outLink[item])
          })
        } else {
          index = outLink ? this.outLink[outLink] : undefined
        }
        if (type === 'select') {
          cb(event[0], index, event[1])
        } else {
          cb(event, index)
        }
      }
    },
    // 判断class返回
    computeClassName (className) {
      if (Array.isArray(className)) {
        return className.join(' ')
      } else if (typeof className === 'string') {
        return className
      } else {
        return ''
      }
    },
    // 渲染form label
    renderFormLabel (item) {
      const label = item.label || item.customFieldName
      if (label && label.length > 6) {
        return (
          <el-tooltip effect='dark' content={label} placement='top'>
            <span>{label}</span>
          </el-tooltip>
        )
      } else {
        return <span>{label}</span>
      }
    }
  },
  render (h) {
    return (
      <div class='hz-filter-box'>
        <el-form label-width={this.labelWidth}>
          <el-row gutter={this.gutter}>
            {this.filterData.map((item, index) => {
              // 存储对应 valueKey 的下标值
              this.outLink[item.valueKey] = index
              /* { 处理传入组件 } */
              if (item.visible !== undefined && !item.visible) {
                return null
              }
              return (
                <el-col
                  span={item.span ? item.span : 6}
                  offset={item.offset ? item.offset : 0}
                >
                  <el-form-item
                    ref={item.valueKey}
                    label={item.label}
                    prop={item.valueKey}
                    labelWidth={item.labelWidth || this.labelWidth}
                    class={`${
                      item.required ? 'is-required' : ''
                    } ${this.computeClassName(item.className)}`}
                  >
                    <span slot='label'>{this.renderFormLabel(item)}</span>
                    {(_this => {
                      if (_this.isDetails) {
                        // 为了不触发render里面循环更新 这样写了
                        return _this.detailsRenderFun(h, item)
                      }
                      switch (item.type) {
                        case 'input':
                          return (
                            <hz-common-input
                              {...{ props: item.props }}
                              {...{ attrs: item.props }}
                              onChange={$event => {
                                _this.inputValueFun($event, item.valueKey)
                                _this.allChangeFun(
                                  item.change,
                                  $event,
                                  item.outLink
                                )
                              }}
                            />
                          )
                        case 'textarea':
                          return (
                            <hz-common-input
                              {...{ props: item.props }}
                              {...{ attrs: item.props }}
                              onChange={$event => {
                                _this.inputValueFun($event, item.valueKey)
                                _this.allChangeFun(
                                  item.change,
                                  $event,
                                  item.outLink
                                )
                              }}
                            />
                          )
                        case 'dateSelect':
                          return (
                            <hz-date-select
                              {...{ attrs: item.props }}
                              onChange={$event => {
                                _this.inputValueFun($event, item.valueKey)
                                _this.allChangeFun(
                                  item.change,
                                  $event,
                                  item.outLink
                                )
                              }}
                            />
                          )
                        case 'select':
                          return (
                            <hz-common-select
                              {...{ attrs: item.props }}
                              onChange={(args1, args2) => {
                                _this.inputValueFun(args1, item.valueKey)
                                _this.allChangeFun(
                                  item.change,
                                  [args1, args2],
                                  item.outLink,
                                  item.type
                                )
                              }}
                              onVisibleChange={$event => {
                                item.visibleChange && item.visibleChange($event)
                              }}
                              onChangeSelect={(args1, args2) => {
                                _this.allChangeFun(
                                  item.changeSelect,
                                  [args1, args2],
                                  item.outLink
                                )
                              }}
                              onResult={$event => {
                                _this.allChangeFun(
                                  item.result,
                                  $event,
                                  item.outLink
                                )
                              }}
                              onClear={$event => {
                                _this.allChangeFun(
                                  item.cleart,
                                  $event,
                                  item.outLink
                                )
                              }}
                            />
                          )
                        case 'selfComponent':
                          return item.render(h, this)
                        default:
                          break
                      }
                    })(this)}
                  </el-form-item>
                </el-col>
              )
            })}
          </el-row>
        </el-form>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
/deep/.hz-filter-box {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
    .button-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      box-sizing: border-box;
    }
    .el-form-item {
      margin-bottom: 6px;
      .el-input__inner {
        color: #0f1831;
      }
      .el-form-item__label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 10px 0 0;
        font-size: 12px;
      }
    }
    .el-form-item__error {
      z-index: 999;
    }
    .el-form-item__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-checkbox-group,
    .el-form-item__label,
    .el-form-item__content,
    .el-input__icon,
    .el-input__inner {
      height: 30px !important;
      line-height: 30px !important;
    }
    .text-overFlow {
      div {
        label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .el-input {
      font-size: 12px;
    }
}
</style>
