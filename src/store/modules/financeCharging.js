import { getList, addFinanceCharging, editFinanceCharging, deleteFinanceCharging } from '@/api/financeCharging'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    financeChargings: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_FINANCE_CHARGINGS: (state, financeChargings) => {
      state.financeChargings = financeChargings
    }
  },

  actions: {
    // 获取列表
    getFinanceChargingList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_FINANCE_CHARGINGS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addFinanceCharging({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addFinanceCharging(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editFinanceCharging({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editFinanceCharging(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteFinanceCharging({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteFinanceCharging(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
