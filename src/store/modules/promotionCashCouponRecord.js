import { getList } from '@/api/promotionCashCouponRecord'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    promotionCashCouponRecords: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PROMOTION_CASH_COUPON_RECORDS: (state, promotionCashCouponRecords) => {
      state.promotionCashCouponRecords = promotionCashCouponRecords
    }
  },

  actions: {
    // 获取列表
    getPromotionCashCouponRecordList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_PROMOTION_CASH_COUPON_RECORDS', response)
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
