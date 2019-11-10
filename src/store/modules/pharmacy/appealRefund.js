import {
  getAppealRefundList,
  getAppealRefundPharmacyList
} from '@/api/pharmacy/appealRefund'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    appealRefundList: {},
    appealRefundPharmacyList: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_APPEAL_REFUND_LIST: (state, appealRefundList) => {
      state.appealRefundList = appealRefundList
    },
    SET_APPEAL_REFUND_PHARMACY_LIST:  (state, appealRefundPharmacyList) => {
      state.appealRefundPharmacyList = appealRefundPharmacyList
    }
  },

  actions: {
    /**
     * 佣金申诉记录查询
     * @param commit
     * @param params
     * @returns {Promise<any>}
     */
    getAppealRefundList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAppealRefundList(params).then(response => {
          commit('SET_APPEAL_REFUND_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    /**
     * 获取申诉药店列表
     * @param commit
     * @param params
     * @returns {Promise<any>}
     */
    getAppealRefundPharmacyList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAppealRefundPharmacyList(params).then(response => {
          commit('SET_APPEAL_REFUND_PHARMACY_LIST', response)
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
