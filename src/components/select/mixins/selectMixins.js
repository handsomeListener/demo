import selectConfig from '@/components/select/config/index'
import data from '@/components/select/data'

export default {
  props: {
    type: {
      type: String,
      default: null
    },
    context: {
      type: Function,
      default: undefined
    },
    params: {
      type: Object,
      default: undefined
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      optionsList: null, // 固定的下拉项
      optionsKey: null, // 输入数据的显示值
      remote: true,
      preLoad: true,
      resultOneOff: true // 只返回一次的结果值
    }
  },
  watch: {
    type: {
      handler (val) {
        if (val) {
          this.init()
          if (this.$refs.base_select) this.$refs.base_select.exposeInitFun()
        } else { // v-bind config 无法覆盖原来的值现在这样写了
          this.optionsList = this.config.optionsList
          this.optionsKey = _.get(this.config, ['optionsKey'], null) || { id: 'id', value: 'value' }
        }
      },
      immediate: true
    }
  },
  methods: {
    init () {
      // 获取预先配置的下拉的列表数据 config 会覆盖该值
      this.optionsList = _.get(this.config, ['optionsList'], null) || _.get(selectConfig, [this.type, 'optionsList'], null)
      this.optionsKey = _.get(this.config, ['optionsKey'], null) || _.get(selectConfig, [this.type, 'optionsKey'], { id: 'id', value: 'value' })
      this.remote = _.get(this.config, ['remote'], null) === null ? _.get(selectConfig, [this.type, 'remote'], true) : _.get(this.config, ['remote'], true)
      this.preLoad = _.get(this.config, ['preLoad'], null) === null ? _.get(selectConfig, [this.type, 'preLoad'], true) : _.get(this.config, ['preLoad'], true)
    },
    // 有新建按钮的时候
    addFun () {
      // 配置式的
      if (_.has(selectConfig, [this.type, 'addFun'])) {
        selectConfig[this.type].addFun(obj => {
          this.clearCopyState(obj)
        })
      }
      // 自定义的新增接口
      this.$emit('addFun', obj => {
        this.clearCopyState(obj)
      })
    },
    // 清空下拉缓存的方法
    clearCopyState (obj) {
      this.$store.commit('cache/save', {
        type: this.type,
        data: null
      })
      this.$refs.base_select.exposeInitFun(obj)
    },
    // 返回函数代理
    changeFun (args, type) {
      if (type === 'visibleChange' || type === 'clear' || type === 'removeTag') {
        this.$emit(type, args)
      } else {
        this.$emit(type, args[0], args[1])
      }
    },
    // 查询函数 方法有点复杂 考虑的清楚比较多， 如果使用柯里化的写法会更加的好
    async search ({ value, func }) {
      let result = {}
      if (!value) { // 第一次请求数据的时候 保存数据到 vuex中下次使用
        if (this.$store.state.cache[this.type] && _.get(this, ['config', 'cacheStatus'], true) !== false) {
          result = this.$store.state.cache[this.type]
        } else {
          result = await this.getSelectOptions()
          if (_.get(this, ['config', 'cacheStatus'], true) !== false) {
            const code = _.get(result, ['code'], 1080)
            if ((code === 0 || code === 1080) && result.data) {
              this.$store.commit('cache/save', {
                type: this.type,
                data: result
              })
            }
          }
        }
      } else {
        result = await this.getSelectOptions(value)
      }
      // 只触发一次事件
      if (this.resultOneOff) {
        this.$emit('result', result)
        this.resultOneOff = false
      }
      // 数据处理的判断方法
      if (this.context) {
        // 父级处理数据逻辑
        const data = await this.context(result)
        func(data)
        return
      }
      if (_.has(selectConfig, [this.type, 'handle'])) {
        // 配置处理数据
        const res = await selectConfig[this.type].handle(result)
        func(res)
        return
      }
      if (result.data) {
        func(result.data)
      }
    },
    // 请求数据的接口
    async getSelectOptions (keyword = '') {
      const params = {}
      const word = _.get(selectConfig, [this.type, 'keyword'], 'keyword') // 查询关键字的默认
      params[word] = keyword
      // 处理请求参数 [userId, unitId, bossUnitId] 这三个参数可以拿
      const defParam = ['userId']
      if (_.has(selectConfig, [this.type, 'params'])) {
        selectConfig[this.type].params.forEach(item => {
          if (item === 'keyword' && this.params && _.has(this.params, ['keyword'])) { // 特殊情况下 带关键字获取下拉值在第一次的时候
            params[word] = keyword || _.get(this.params, ['keyword'])
          } else {
            const index = defParam.indexOf(item)
            params[item] = index > -1 ? this[`$${defParam[index]}`] : _.get(this.params, [item], null)
          }
        })
      } else { // 没有配置就是默认的情况下
        params.userId = ''
      }
      return data[this.type]
      // return request({
      //   url: _.get(selectConfig, [this.type, 'url'], ''),
      //   methods: _.get(selectConfig, [this.type, 'methods'], 'get'),
      //   data: { ...params }
      // })
    }
  }
}
