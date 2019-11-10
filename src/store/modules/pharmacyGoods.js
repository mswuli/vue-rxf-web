import {
  deletePharmacyGoods,
  getList,
  getPayStatus,
  getPharmacyHomeInfo,
  getSaasPayQrcode,
  marketable,
  updPharmacyItemStore,
  useCashCoupon,
  addPharmacyGoods
} from '@/api/pharmacyGoods'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    pharmacyGoods: {},
    pharmacyHomeInfo: {
      data: {
        financeAccount: {},
        today: {},
        yesterday: {}
      }
    },
    qrcodeInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PHARMACY_GOODS: (state, pharmacyGoods) => {
      state.pharmacyGoods = pharmacyGoods
    },
    SET_PHARMACY_HOME_INFO: (state, info) => {
      state.pharmacyHomeInfo = info
    },
    SET_PAY_QRCODE: (state, info) => {
      state.qrcodeInfo = info
    }
  },

  actions: {
    addPharmacyGoods({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addPharmacyGoods(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },
    // 获取列表
    getPharmacyGoodsList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_PHARMACY_GOODS', response)
          params.callback && params.callback()
          resolve()
        }).catch(function(reason) {
          console.log(reason)
          reject(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getPharmacyHomeInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyHomeInfo(params).then(response => {
          commit('SET_PHARMACY_HOME_INFO', response)
          resolve()
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    marketableGoods({ commit }, params) {
      return new Promise((resolve, reject) => {
        marketable(params).then(response => {
          resolve(response)
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    // 获取充值二维码
    getSaasPayQrcode({ commit }, params) {
      return new Promise((resolve, reject) => {
        getSaasPayQrcode(params).then(response => {
          commit('SET_PAY_QRCODE', response)
          resolve(response)
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    // 获取支付结果
    getPayStatus({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPayStatus(params).then(response => {
          resolve(response)
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    // 删除
    deletePharmacyGoods({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deletePharmacyGoods(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 使用优惠券
    useCashCoupon({ commit }, params) {
      return new Promise((resolve, reject) => {
        useCashCoupon(JSON.stringify(params)).then(response => {
          resolve(response)
          params.callback && params.callback()
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    // 更新库存
    updPharmacyItemStore({ commit }, params) {
      return new Promise((resolve, reject) => {
        updPharmacyItemStore(JSON.stringify(params)).then(response => {
          resolve(response)
        }).catch(function(reason) {
          reject(reason)
        })
      })
    }
  }
}

export default objectStore
