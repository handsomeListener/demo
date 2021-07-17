<script>
import HzPrintDrop from '@/components/button/hz-print-drop'
export default {
  name: 'hz-button-box',
  components: {
    HzPrintDrop
  },
  props: {
    buttonData: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  render (h) {
    return (
      <div class="hz-button-box">
        {
          this.buttonData.map((item, index) => {
            if (item.type === 'drop') {
              return (
                <hz-print-drop
                  menuList={item.list}
                  onClick={$event => {
                    item.click($event, index)
                  }}
                >
                  <el-button slot="title" type={item.status || ''}>{item.label}</el-button>
                </hz-print-drop>
              )
            } else if (this.type === 'selfComponent') {
              return item.render(h, this)
            } else {
              return (
                <el-button type={item.status || ''} onClick={$event => {
                  item.click($event, index)
                }}>{item.label}</el-button>
              )
            }
          })
        }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.hz-button-box {
  display: flex;
  flex-direction: row;
  height: 36px;
  padding: 5px 10px;
  /deep/ .el-button {
    height: 30px;
    line-height: 30px;
    min-width: 80px;
    padding: 0;
    text-align: center;
    margin-right: 10px;
  }
}
</style>
