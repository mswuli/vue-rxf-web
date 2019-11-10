import { getList } from '@/api/commissionfee'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    pharmacyCommissionFees: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_COMMISSION_FEES_LIST: (state, commissionFees) => {
      state.pharmacyCommissionFees = commissionFees
    }
  },

  actions: {
    // 获取列表
    getCommissionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_COMMISSION_FEES_LIST', response)
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
