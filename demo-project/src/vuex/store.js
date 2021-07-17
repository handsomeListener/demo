// eslint-disable-next-line import/no-duplicates,no-redeclare
import Vue from 'vue'
import Vuex from 'vuex'
import cache from './cache'

Vue.use(Vuex)

const state = {}
const mutations = {}
const actions = {}
// eslint-disable-next-line no-undef
const store = new Vuex.Store({
  modules: {
    cache
  },
  state,
  mutations,
  actions
})
window.vuex_$store = store
export default store
