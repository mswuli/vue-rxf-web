import { getList, getCashStatus, getCashUseStatus, getCashCouponType, addCash, editCash, deleteCash } from '@/api/cash'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    cashs: {},
    cashStatusCode: {},
    cashUseStatusCode: {},
    cashCouponType: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_CASHS: (state, cashs) => {
      state.cashs = cashs
    },
    SET_CASH_STATUS: (state, statusCode) => {
      state.cashStatusCode = statusCode
    },
    SET_CASH_USE_STATUS: (state, statusCode) => {
      state.cashUseStatusCode = statusCode
    },
    SET_CASH_COUPON_TYPE: (state, couponType) => {
      state.cashCouponType = couponType
    }
  },

  actions: {
    // 获取列表
    getCashList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_CASHS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取领取状态
    getCashStatus({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCashStatus(params).then(response => {
          commit('SET_CASH_STATUS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取使用状态
    getCashUseStatus({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCashUseStatus(params).then(response => {
          commit('SET_CASH_USE_STATUS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取类型
    getCashCouponType({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCashCouponType(params).then(response => {
          commit('SET_CASH_COUPON_TYPE', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addCash({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addCash(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editCash({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editCash(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteCash({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteCash(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
