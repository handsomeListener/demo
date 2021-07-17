export default {
  namespaced: true,
  state: {},
  mutations: {
    save (state, payload) {
      state[payload.type] = payload.data
    }
  }
}
