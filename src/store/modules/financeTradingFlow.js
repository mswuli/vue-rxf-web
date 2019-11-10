import { getList } from '@/api/financeTradingFlow'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    financeTradingFlows: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_FINANCE_TRANDING_FLOWS: (state, financeTradingFlows) => {
      state.financeTradingFlows = financeTradingFlows
    }
  },

  actions: {
    // 获取列表
    getFinanceTradingFlowList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_FINANCE_TRANDING_FLOWS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
