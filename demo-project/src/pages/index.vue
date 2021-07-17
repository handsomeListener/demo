<template>
  <div class="template">
    <div class="header">
      <hz-filter-box
        :filterData="filterData"
      />
    </div>
    <div class="button-box">
      <hz-button-box :buttonData="buttonData"/>
    </div>
    <div class="content">
      <hz-auto-height :bottomTop="100">
        <template slot-scope="{ height }">
          <hz-common-table
            :height="height"
            :data="tableData"
            :indexColumn="true"
            :selectedColumn="true"
            border
            :columns="tableColumns"
            :handleConfig="handlerConfig"
            ref="table"
          />
        </template>
      </hz-auto-height>
    </div>
  </div>
</template>

<script>
import HzFilterBox from '@/components/filter/hz-filter-box'
import HzButtonBox from '@/components/button/hz-button-box'
import HzCommonTable from '@/components/table/hz-common-table'
import HzAutoHeight from './components/hz-auto-height'
import dataCenter from '@/dataCenter'
import data from '@/pages/mixins/data'

export default {
  name: 'index',
  components: {
    HzFilterBox,
    HzButtonBox,
    HzAutoHeight,
    HzCommonTable
  },
  data () {
    return {
      filterData: [],
      buttonData: [],
      handlerConfig: {}
    }
  },
  mixins: [data],
  mounted () {
    this.dataCenter(this.id)
  },
  methods: {
    dataCenter (id) {
      dataCenter(id).then(data => {
        this.filterData = data.filterData
        this.buttonData = data.buttonData
        this.handlerConfig = data.handlerConfig
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.id = to.path.split('/')[1]
    })
  }
}
</script>

<style lang="scss" scoped>
.template {
  width: 100%;
  height: 100%;
}
</style>
