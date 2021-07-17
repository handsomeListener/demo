<template>
  <div class="hz-print-drop">
    <el-dropdown @command="commandFun">
      <slot name="title">
        <span>打印</span>
      </slot>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in menuList"
          :key="item.id"
          :command="item.id"
        >
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'hz-print-drop',
  data () {
    return {
    }
  },
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    commandFun (id) {
      this.$emit('click', id)
    }
  }
}
</script>

<style scoped>

</style>
