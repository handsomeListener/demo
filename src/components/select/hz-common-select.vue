<template>
  <hz-base-select
    ref="base_select"
    :options-list="optionsList"
    :option-key="optionsKey"
    :remote="remote"
    :pre-load="preLoad"
    v-bind="{...config}"
    @addFun="addFun"
    @visibleChange="changeFun($event, 'visibleChange')"
    @changeOpt="changeFun(arguments,'changeOpt')"
    @changeSelect="changeFun(arguments,'changeSelect')"
    @change="changeFun(arguments,'change')"
    @search="search"
    @clear="changeFun($event,'clear')"
    @removeTag="changeFun($event,'removeTag')"
  />
</template>

<script>
import hzBaseSelect from '@/components/select/hz-base-select'
import selectMixins from '@/components/select/mixins/selectMixins'
export default {
  name: 'NfCommonSelect',
  components: { hzBaseSelect },
  mixins: [selectMixins]
}
</script>

<style scoped>

</style>
