<template>
  <div class="hz-date-select">
    <el-date-picker
      v-if="type==='RANGE'"
      v-model="value"
      style="width: 100%;"
      type="daterange"
      :disabled="disabled"
      :picker-options="pickerOptions"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      range-separator="~"
      :value-format="valueFormat"
      :default-time="['00:00:00', '23:59:59']"
      @input="changeFun"
    />
    <el-date-picker
      v-else
      v-model="value"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      style="width: 100%;"
      :value-format="valueFormat"
      @input="changeFun"
    />
  </div>
</template>

<script>
import {formatDate} from '@/tool/tool'

// 设置天数
function setFilterDay (day) {
  const days = new Date()
  if (day !== 0) {
    days.setTime(new Date() - (-3600 * 1000 * 24 * day))
  }
  return days
}

export default {
  name: 'hzDateSelect',
  props: {
    disabled: Boolean,
    defaultValue: {
      type: [Array, Number, Date, String],
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    type: {
      type: String,
      default: 'date'
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    shortcutsList: {
      type: Array,
      default: () => {
        return ['本周', '上周', '本月', '上月', '本年', '去年']
      }
    }
  },
  data () {
    return {
      value: null,
      pickerOptions: {}
    }
  },
  watch: {
    defaultValue: {
      handler (val) {
        this.dealWithDefaultValue(val)
      },
      deep: true,
      immediate: true
    },
    shortcutsList: {
      handler (val) {
        if (val) {
          this.pickerOptions.shortcuts = []
          val.forEach(v => {
            this.pickerOptions.shortcuts.push(
              this.getShortucts(v)
            )
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    dealWithDefaultValue (val) {
      if (val === null || val === undefined) return
      let dateArr
      if (Array.isArray(val)) { // 选择范围的时候
        dateArr = val.map(item => {
          if (typeof item === 'object') {
            return this.getFormatDate(item)
          }
          if (!isNaN(item)) {
            return this.getFormatDate(setFilterDay(item))
          }
        })
      } else if (typeof val === 'object') { // 当是 new Date() 的时候
        dateArr = this.getFormatDate(val)
      } else if (typeof val === 'string') {
        dateArr = this.getFormatDate(new Date(val))
      } else { // 当是数字的时候
        dateArr = this.getFormatDate(setFilterDay(val))
      }
      this.changeFun(dateArr)
      this.value = dateArr
    },
    changeFun (event) {
      if (!event) {
        this.$emit('change', null)
        return
      }
      let formValue = []
      if (this.type === 'RANGE') { // 多选的时候
        formValue = [event[0], event[1]]
      } else { // 单选的时候
        formValue = event
      }
      this.$emit('change', formValue)
    },
    // 日期时间处理
    getFormatDate (val) {
      if (this.valueFormat !== 'timestamp') {
        return formatDate(val, this.valueFormat)
      }
      return val.getTime()
    },
    // 日期快捷键设置
    getShortucts (val) {
      const end = new Date()
      const start = new Date()
      let day = 0
      switch (val) {
        case '近7天':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
          break
        case '近15天':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
          break
        case '近30天':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
          break
        case '本周':
          day = start.getDay() === 0 ? 7 : start.getDay() - 1
          start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
          break
        case '上周':
          day = end.getDay() === 0 ? 8 : start.getDay()
          end.setTime(end.getTime() - 3600 * 1000 * 24 * day)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * (day + 6))
          break
        case '本月':
          start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
          break
        case '上月':
          day = new Date(start.getFullYear(), start.getMonth(), 0).getDate()
          start.setTime(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1))
          end.setTime(new Date(new Date().getFullYear(), new Date().getMonth() - 1, day))
          break
        case '本年':
          start.setTime(new Date(start.getFullYear(), 0, 1))
          break
        case '去年':
          start.setTime(new Date(start.getFullYear() - 1, 0, 1))
          end.setTime(new Date(end.getFullYear() - 1, 11, 31))
          break
      }
      return {
        text: val,
        onClick (picker) {
          picker.$emit('pick', [start, end])
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .hz-date-select {
    /deep/ .el-range-separator {
      height: 24px;
      line-height: 24px;
    }
  }
</style>
