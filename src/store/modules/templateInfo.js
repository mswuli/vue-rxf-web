const templateInfo = {
  state: {
    templateInfo: {}
  },
  mutations: {
    SET_TEMPLATE_INFO: (state, templateInfo) => {
      state.templateInfo = templateInfo
    },
  },
  actions: {
    getTemplateInfo({commit}, params) {
      commit('SET_TEMPLATE_INFO', params)
    },
    dell({commit}) {
      commit('SET_TEMPLATE_INFO', {})
    }
  }
}
export default templateInfo
