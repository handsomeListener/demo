<script>
export default {
  name: 'hzCommonTable',
  data () {
    return {
      uuId: 0
    }
  },
  watch: {
    '$attrs.columns': {
      handler () {
        this.uuId += 1
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 为了方便使用 对象健 也是正则表达式 柯里化的写法¬
    dealWithKey (handleConfig) {
      const keys = Object.keys(handleConfig)
      return function (colOptions) {
        if (handleConfig[colOptions]) return handleConfig[colOptions]
        const fdkey = keys.find(it => {
          // eslint-disable-next-line no-new-func
          const ts = new Function('return ' + `/${it}/`)()
          return ts.test(colOptions)
        })
        if (fdkey) return handleConfig[fdkey]
        return false
      }
    },
    // 处理表头的函数
    renderTableColumn (h, colOptions, handleConfig, common, index) {
      const that = this
      colOptions.prop = colOptions.key || colOptions.prop
      colOptions.label = colOptions.title || colOptions.label
      const visible = colOptions.visible !== undefined ? colOptions.visible : true
      if (!visible) {
        return null
      }
      let props = {}

      if (common) {
        colOptions = {
          ...colOptions,
          ...common
        }
      }

      const handle = handleConfig(colOptions.prop)
      // 如果特使处理的函数存在的时候 覆盖来的配置
      if (handle && handle.props) {
        props = {
          props: {
            ...colOptions,
            ...handle.props
          }
        }
      } else { // 默认的时候处理的值
        props = {
          props: { ...colOptions }
        }
      }

      const { render, child } = colOptions
      const slotScope = {
        scopedSlots: {
          default (scope) {
            return typeof render === 'function' ? render(h, scope)
              : (
                handle && typeof handle.handle === 'function' ? handle.handle(h, scope, props.props)
                  : scope.row[colOptions.prop]
              )
          },
          header (scope) {
            return typeof render === 'function' ? render(h, scope)
              : (
                handle && typeof handle.header === 'function' ? handle.header(h, scope, props.props)
                  : props.props.label
              )
          }
        }
      }

      return (
        <el-table-column
          {...props}
          {...slotScope}
          key={index}
        >
          { _.isArray(child) && child.length > 0 &&
          child.map(item => that.renderTableColumn(h, item, handleConfig, common))
          }
        </el-table-column>
      )
    }
  },
  render: function (h) {
    const props = {
      props: this.$attrs
    }

    // 表头数据 跟报表的数据一样，
    let columns = this.$attrs.columns || []
    // 特殊数据处理的函数
    const handleConfig = this.$attrs.handleConfig || this.$attrs['handle-config'] || {}

    const on = {
      on: this.$listeners
    }

    if (handleConfig.handle) {
      // push  方法回触发数据的响应出现循环调用
      columns = columns.concat([{
        title: '操作',
        key: 'operate',
        fixed: 'right'
      }])
    }
    const handle = this.dealWithKey(handleConfig)
    const common = handle('commonConfig')
    return (
      <el-table
        class='hz-table'
        ref='hz_table'
        key={ props.props.tableType === 'form' ? '1' : this.uuId }
        {...on}
        {...props}
        border={true}
        style='width: 100%;'
      >
        { this.$slots.left }
        { this.$attrs.selectedColumn ? <el-table-column type='selection' width="40" fixed="left"/> : null }
        { this.$attrs.indexColumn ? <el-table-column type='index' width="60" label='序号' align='center' /> : null }
        {
          columns.map((item, index) => this.renderTableColumn(h, item, handle, common, index))
        }
        { this.$slots.right }
      </el-table>
    )
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .hz-table {
    .el-table th.gutter{
      display: table-cell!important;
    }
    .el-table colgroup.gutter{
      display: table-cell!important;
    }
  }
</style>
