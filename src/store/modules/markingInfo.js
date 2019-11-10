const markingInfo = {
  state: {
    markingInfo: {},
  },
  mutations: {
    SET_MARKING_INFO: (state, markingInfo) => {
      state.markingInfo = markingInfo
    },
    clear: (state, a) => {
      state.markingInfo = a
    }
  },
  actions: {
    markingInfo({commit}, params) {
      commit('SET_MARKING_INFO', params)
    },
    delMarkingInfo({commit}) {
      commit('SET_MARKING_INFO', {})
    }
  }
}
export default markingInfo
