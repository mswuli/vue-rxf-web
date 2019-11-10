import {
  drugName,
  getList,
  getPassList,
  getPayment,
  getPharmacyPrescriptionItems,
  getPharmacyPrescriptionList,
  getPrescriptionDetail,
  getPrescriptionItemList,
  getPrescriptionRefundDetail,
  getPrescriptionShDetail,
  getUnpickPrescriptionList,
  pickByCode,
  prescriptionDeliver,
  prescriptionDosage,
  prescriptionDosageReject,
  prescriptionFinish,
  prescriptionFinishReject,
  prescriptionSystemDeduction,
  prescriptionPay,
  prescriptionPayReject,
  prescriptionRefund,
  tradePay,
  medicalAccount
} from '@/api/prescription'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    prescriptions: {},
    prescriptionPass: {},
    payments: [],
    prescriptionItems: [],
    unpickPrescriptionList: {},
    pharmacyPrescriptions: {},
    prescriptionDetail: {
      pickPharmList: [],
      itemList: [],
      prescription: {},
      patient: {},
      hospital: {},
    },
    prescriptionItemList: [],
    prescriptionShDetail: [],
    prescriptionRefundDetail: {
      hospital: {},
      prescription: {},
      itemList: [],
      patient: {},
      pharmacyPrescriptionItemList: [],
      prescriptionOrder: {}
    },
    prescriptionRefund: {},
    drugName: {},
    prescriptionSystemDeduction:{},
    medicalAccount:{},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PRESCRIPTIONS: (state, prescriptions) => {
      state.prescriptions = prescriptions
    },
    SET_PAYMENT: (state, payment) => {
      state.payments = payment
    },
    SET_PRESCRIPTION_ITEMS: (state, items) => {
      state.prescriptionItems = items
    },
    SET_UNPICK_PRESCRIPTION_LIST: (state, unpickPrescriptionList) => {
      state.unpickPrescriptionList = unpickPrescriptionList
    },
    SET_PHARMACY_PRESCRIPTIONS: (state, prescriptions) => {
      state.pharmacyPrescriptions = prescriptions
    },
    SET_PRESCRIPTION_DETAIL: (state, detail) => {
      state.prescriptionDetail = detail.data
    },
    SET_PRESCRIPTION_ITEM_LIST: (state, items) => {
      state.prescriptionItemList = items.data
    },
    SET_PRESCRIPTION_SH_DETAIL: (state, detail) => {
      state.prescriptionShDetail = detail.data
    },
    SET_PRESCRIPTION_REFUNDETAIL: (state, detail) => {
      state.prescriptionRefundDetail = detail.data
    },
    SET_PRESCRIPTION_REFUND: (state, detail) => {
      state.prescriptionRefund = detail
    },
    SET_DRUG_NAME: (state, detail) => {
      state.drugName = detail.data
    },
    SET_PRESCRIPTION_PASS: (state, prescriptionPass) => {
      state.prescriptionPass = prescriptionPass
    },
    SET_MEDICAL_ACCOUNT: (state, medicalAccount) => {
      state.medicalAccount = medicalAccount
    },
    SET_PRESCRIPTION_SYSTEM_DEDUCTION: (state, prescriptionSystemDeduction) => {
      state.prescriptionSystemDeduction = prescriptionSystemDeduction
    },
  },

  actions: {
    getUnpickPrescriptionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUnpickPrescriptionList(params).then(response => {
          commit('SET_UNPICK_PRESCRIPTION_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取列表
    getPrescriptionList({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_PRESCRIPTIONS', response)
          params.callback && params.callback()
        }).catch(function (reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取已审处方列表
    getPrescriptionPass({
                          commit
                        }, params) {
      return new Promise((resolve, reject) => {
        getPassList(params).then(response => {
          commit('SET_PRESCRIPTION_PASS', response)
          params.callback && params.callback()
        }).catch(function (reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取支付方式
    getPayment({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPayment(params).then(response => {
          commit('SET_PAYMENT', response.data)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 获取处方药品列表
    getPharmacyPrescriptionItems({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyPrescriptionItems(params).then(response => {
          commit('SET_PRESCRIPTION_ITEMS', response.data)
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },

    // 获取药店处方列表
    getPharmacyPrescriptionList({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyPrescriptionList(params).then(response => {
          commit('SET_PHARMACY_PRESCRIPTIONS', response)
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
        })
      })
    },

    // 获取处方详情
    getPrescriptionDetail({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPrescriptionDetail(params).then(response => {
          commit('SET_PRESCRIPTION_DETAIL', response)
          params.callback && params.callback(response)
        }).catch(function (reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取处方详情
    getPrescriptionItemList({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPrescriptionItemList(params).then(response => {
          commit('SET_PRESCRIPTION_ITEM_LIST', response)
          params.callback && params.callback()
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 核对/调配
    prescriptionDosage({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionDosage(params).then(response => {
          resolve(response)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 拒绝核对/调配
    prescriptionDosageReject({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionDosageReject(params).then(response => {
          resolve(response)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },
    // 预支付
    getPrescriptionSystemDeduction({commit}, params) {
      return new Promise((resolve, reject) => {
        prescriptionSystemDeduction(params).then(response => {
          commit('SET_PRESCRIPTION_SYSTEM_DEDUCTION', response)
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
        })
      })
    },
    // 支付
    prescriptionPay({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionPay(params).then(response => {
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
        })
      })
    },

    // 支付
    tradePay({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        tradePay(params).then(response => {
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          // reject(reason)
        })
      })
    },

    // 支付失败
    prescriptionPayReject({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionPayReject(params).then(response => {
          resolve(response)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 配药
    prescriptionDeliver({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionDeliver(params).then(response => {
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },

    // 核对/发药
    prescriptionFinish({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionFinish(params).then(response => {
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },

    // 拒绝核对/发药
    prescriptionFinishReject({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionFinishReject(params).then(response => {
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },

    // 获取审核详情
    getPrescriptionShDetail({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPrescriptionShDetail(params).then(response => {
          console.log(response)
          commit('SET_PRESCRIPTION_SH_DETAIL', response)
          params.callback && params.callback()
        })
      })
    },

    // 提取
    pickByCode({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        pickByCode(params).then(response => {
          console.log(response)
          resolve(response)
        }).catch(function (reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },
    //  退款详情
    getPrescriptionRefundDetail({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        getPrescriptionRefundDetail(params).then(response => {
          console.log(response)
          commit('SET_PRESCRIPTION_REFUNDETAIL', response)
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    // 退款
    prescriptionRefund({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        prescriptionRefund(params).then(response => {
          console.log('11111' + response)
          commit('SET_PRESCRIPTION_REFUND', response)
          // params.callback && params.callback()
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    // 名称搜索
    drugName({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        drugName(params).then(response => {
          console.log(response)
          commit('SET_DRUG_NAME', response)
          // resolve(response)
          params.callback && params.callback()
        }).catch(reason => {
          // reject(reason)
          params.callback && params.callback()
        })
      })
    },
    // 清空药品名称搜索
    clearDrugName() {
      this.commit('SET_DRUG_NAME', '')
    },
    // 医保结算
    getMedicalAccount({commit}, params) {
      return new Promise((resolve, reject) => {
        medicalAccount(params.data).then(response => {
          console.log(response)
          commit('SET_MEDICAL_ACCOUNT', response.data)
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
  }
}

export default objectStore
