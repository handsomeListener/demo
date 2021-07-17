<template>
  <div
    id="warp-body"
    ref="warpBody"
    class="warp-body"
    :style="warpStyle"
  >
    <div class="">
      <slot :height="height" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'hzAutoHeight',
  props: {
    bottomTop: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      warpStyle: {
        height: '200px'
      },
      height: 0
    }
  },
  mounted () {
    this.initHeight()
  },
  methods: {
    initHeight () {
      this.$nextTick(() => {
        const hdiff = document.body.clientHeight - this.$refs.warpBody.getBoundingClientRect().top - this.bottomTop
        this.height = hdiff
        this.warpStyle = {
          height: hdiff + 'px'
        }
      })
    }
  }
}
</script>

<style scoped>
.warp-body{
    width: 100%;
}
</style>
