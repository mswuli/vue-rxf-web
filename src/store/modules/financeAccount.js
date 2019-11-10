import {
  addFinanceAccount,
  chargingAccount,
  deleteFinanceAccount,
  deleteFinanceAccountMgt,
  editFinanceAccount,
  submitAuditInfo,
  submitAudit,
  editFinanceAccountMgt,
  getCardTypeList,
  getCurrentPharmacy,
  getDictionaryItem,
  getBusinessAccountTypes,
  getFinanceAccountMgtList,
  getList,
  getBankNameList,
  getPharmacyHome,
  getRechargeList,
  renewalFinanceAccount,
  getSubBank
} from '@/api/financeAccount'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    financeAccounts: {},
    financeRecharges: {},
    currentPharmacy: {},
    pharmacyHome: {
      financeAccount: {}
    },
    financeAccountMgts: {},
    cardTypes: [],
    banks: [],
    businessAccountTypes: {},
    dictionaryItems: {},
    subBanks: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_FINANCE_ACCOUNTS: (state, financeAccounts) => {
      state.financeAccounts = financeAccounts
    },
    SET_RECHARGES: (state, recharges) => {
      state.financeRecharges = recharges
    },
    SET_CURRENT_PHARMACY: (state, pharmacy) => {
      state.currentPharmacy = pharmacy
    },
    SET_PHARMACY_HOME: (state, pharmacy) => {
      state.pharmacyHome = pharmacy
    },
    SET_FINANCE_ACCOUNT_MGTS: (state, financeAccountMgts) => {
      state.financeAccountMgts = financeAccountMgts
    },
    SET_CARD_TYPES: (state, cardTypes) => {
      state.cardTypes = cardTypes.data
    },
    SET_BANKS: (state, banks) => {
      state.banks = banks
    },
    SET_BUSINESS_ACCOUNT_TYPES: (state, businessAccountTypes) => {
      state.businessAccountTypes = businessAccountTypes
    },
    SET_DICTIONARY_ITEMS: (state, types) => {
      state.dictionaryItems = types
    },
    SET_SUB_BANK: (state, subBanks) => {
      state.subBanks = subBanks
    }
  },

  actions: {
    // 获取列表
    getFinanceAccountList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_FINANCE_ACCOUNTS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取开户行支行
    getSubBanks({ commit }, params) {
      return new Promise((resolve, reject) => {
        getSubBank(params).then(response => {
          commit('SET_SUB_BANK', response)
          resolve(response)
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    // 获取列表
    getBankNameList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getBankNameList(params).then(response => {
          commit('SET_BANKS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getRechargeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRechargeList(params).then(response => {
          commit('SET_RECHARGES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取类型列表
    getDictionaryItem({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDictionaryItem(params).then(response => {
          console.log(response)
          commit('SET_DICTIONARY_ITEMS', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取商户账户类型列表
    getBusinessAccountTypes({ commit }, params) {
      return new Promise((resolve, reject) => {
        getBusinessAccountTypes(params).then(response => {
          console.log(response)
          commit('SET_BUSINESS_ACCOUNT_TYPES', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getCardTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCardTypeList(params).then(response => {
          commit('SET_CARD_TYPES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取当前药店
    getCurrentPharmacy({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCurrentPharmacy(params).then(response => {
          commit('SET_CURRENT_PHARMACY', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取当前药店
    getPharmacyHome({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyHome(params).then(response => {
          commit('SET_PHARMACY_HOME', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addFinanceAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addFinanceAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editFinanceAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editFinanceAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 保存支付开通的资料
    submitAuditInfo({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        submitAuditInfo(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 提交审核
    submitAudit({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        submitAudit(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteFinanceAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteFinanceAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getFinanceAccountMgtList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getFinanceAccountMgtList(params).then(response => {
          commit('SET_FINANCE_ACCOUNT_MGTS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editFinanceAccountMgt({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editFinanceAccountMgt(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteFinanceAccountMgt({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteFinanceAccountMgt(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 充值
    chargingAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        chargingAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 续费
    renewalFinanceAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        renewalFinanceAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
