import {
  getAppealNoRefund,
  getAppealRefund,
  getFinanceServiceList,
  getFinanceSmsList,
  getList,
  getPrescriptionCheckDetail,
  getReject
} from '@/api/financeIncome'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    financeIncomes: {
      data: {}
    },
    financeServices: {},
    financeSmss: {},
    prescriptionCheckDetail: {},
    appealRefund: {},
    appealNoRefund: {},
    getReject: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_HANDOVER_LIST: (state, handoverList) => {
      state.handoverList = handoverList
    },
    SET_FINANCE_INCOMES: (state, financeIncomes) => {
      state.financeIncomes = financeIncomes
    },
    SET_FINANCE_SERVICES: (state, financeServices) => {
      state.financeServices = financeServices
    },
    SET_FINANCE_SMSS: (state, financeSmss) => {
      state.financeSmss = financeSmss
    },
    SET_PRESCRIPTION_CHECK_DETAIL: (state, prescriptionCheckDetail) => {
      state.prescriptionCheckDetail = prescriptionCheckDetail
    },
    SET_APPEAL_REFUND: (state, appealRefund) => {
      state.appealRefund = appealRefund
    },
    SET_APPEAL_NO_REFUND: (state, appealNoRefund) => {
      state.appealNoRefund = appealNoRefund
    },
    SET_REJECT: (state, getReject) => {
      state.getReject = getReject
    }
  },

  actions: {
    // 获取列表
    getFinanceIncomeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_FINANCE_INCOMES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取服务费明细列表
    getFinanceServiceList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getFinanceServiceList(params).then(response => {
          commit('SET_FINANCE_SERVICES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取处方申诉详情信息
    getPrescriptionCheckDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPrescriptionCheckDetail(params).then(response => {
          // commit('SET_PRESCRIPTION_CHECK_DETAIL', response)
          resolve(response)
          // params.callback && params.callback(response)
        }).catch(function(reason) {
          console.log(reason)
          // params.callback && params.callback()
        })
      })
    },
    // 获取佣金申诉同意接口
    getAppealRefund({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAppealRefund(params).then(response => {
          commit('SET_APPEAL_REFUND', response)
          params.callback && params.callback(response)
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取佣金申诉拒绝接口
    getAppealNoRefund({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAppealNoRefund(params).then(response => {
          commit('SET_APPEAL_NO_REFUND', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 申诉拒绝原因
    getReject({ commit }, params) {
      return new Promise((resolve, reject) => {
        getReject(params).then(response => {
          commit('SET_REJECT', response)
          params.callback && params.callback(response)
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取短信明细列表
    getFinanceSmsList({
                        commit
                      }, params) {
      return new Promise((resolve, reject) => {
        getFinanceSmsList(params).then(response => {
          commit('SET_FINANCE_SMSS', response)
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
