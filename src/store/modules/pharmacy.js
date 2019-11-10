import {
  addPharmacy,
  appealRefund,
  deletePharmacy,
  editPharmacy,
  getHandoverList,
  getList,
  getNotification,
  getPharmacyServices,
  getPharmacyStatusList,
  getPharmacyTypeList,
  getRefund,
  getRefundQuery,
  getServiceCdt,
  getServiceDetail,
  postHandover,
  postServiceCdt,
  setAdmin,
  listCurrentLicensed,
  getPharmacyTitleList
} from '@/api/pharmacy'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    pharmacys: {},
    pharmacyTypes: {},
    pharmacyStatus: {},
    pharmacyServices: {},
    serviceDetail: {},
    serviceCdt: {},
    handoverList: {},
    appealRefund: {},
    refund: {},
    appealList: {},
    currentLicensedList: {},
    pharmacyTitleList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PHARMACYS: (state, pharmacys) => {
      state.pharmacys = pharmacys
    },
    SET_PHARMACY_TITLE_LIST: (state, pharmacyTitleList) => {
      state.pharmacyTitleList = pharmacyTitleList.data
    },
    SET_PHARMACY_TYPES: (state, types) => {
      state.pharmacyTypes = types
    },
    SET_PHARMACY_STATUS: (state, status) => {
      state.pharmacyStatus = status
    },
    SET_PHARMACY_SERVICES: (state, services) => {
      state.pharmacyServices = services
    },
    SET_SERVICE_DETAIL: (state, serviceDetail) => {
      state.serviceDetail = serviceDetail
    },
    SET_SERVICE_CDT: (state, cdt) => {
      state.serviceCdt = cdt
    },
    SET_HANDOVER_LIST: (state, handoverList) => {
      state.handoverList = handoverList
    },
    SET_REFUND: (state, refund) => {
      state.refund = refund
    },
    SET_REFUND_QUERY: (state, appealList) => {
      state.appealList = appealList
    },
    SET_CURRENT_LICENSED_LIST: (state, currentLicensedList) => {
      state.currentLicensedList = currentLicensedList.data
    }
  },

  actions: {
    // 获取当前登录药店的执业药师
    listCurrentLicensed({ commit }, params) {
      return new Promise((resolve, reject) => {
        listCurrentLicensed(params).then(response => {
          commit('SET_CURRENT_LICENSED_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取药店职位列表
    getPharmacyTitleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyTitleList(params).then(response => {
          commit('SET_PHARMACY_TITLE_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取列表
    getPharmacyList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_PHARMACYS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    clearPharmacyList() {
      this.commit('SET_PHARMACYS', '')
    },
    // 获取药店类型列表
    getPharmacyTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyTypeList(params).then(response => {
          console.log(response)
          commit('SET_PHARMACY_TYPES', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取服务信息列表
    getServiceCdt({ commit }, params) {
      commit('SET_SERVICE_CDT', [])
      return new Promise((resolve, reject) => {
        getServiceCdt(params.data).then(response => {
          console.log(response)
          commit('SET_SERVICE_CDT', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取药店状态列表
    getPharmacyStatusList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyStatusList(params).then(response => {
          console.log(response)
          commit('SET_PHARMACY_STATUS', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取药店服务列表
    getPharmacyServices({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyServices(params).then(response => {
          console.log(response)
          commit('SET_PHARMACY_SERVICES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addPharmacy({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addPharmacy(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editPharmacy({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editPharmacy(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deletePharmacy({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deletePharmacy(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 设置管理员
    setAdmin({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        setAdmin(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getServiceDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        getServiceDetail(params).then(response => {
          commit('SET_SERVICE_DETAIL', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 提交列表
    postServiceCdt({ commit }, params) {
      return new Promise((resolve, reject) => {
        postServiceCdt(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },
    // 获取药店告警
    getNotification({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNotification(params).then(response => {
          // commit('SET_NOTIFICATION', response)
          resolve(response.data)
        }).catch(function(reason) {
          console.log(reason)
          // reject(reason)
        })
      })
    },

    // 获取交接信息
    postHandover({ commit }, params) {
      return new Promise((resolve, reject) => {
        postHandover(params).then(response => {
          // commit('SET_HANDOVER_CONNECT', response)
          // params.callback && params.callback()
          resolve(response.data)
        }).catch(function(reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },

    // 获取交接列表信息
    getHandoverList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getHandoverList(params).then(response => {
          commit('SET_HANDOVER_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 佣金申诉退款信息
    appealRefund({ commit }, params) {
      return new Promise((resolve, reject) => {
        appealRefund(params).then(response => {
          resolve(response.data)
        }).catch(function(reason) {
          console.log(reason)
          reject(reason)
        })
      })
    },
    // 佣金申诉退款原因
    refund({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRefund(params).then(response => {
          commit('SET_REFUND', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 佣金申诉记录查询
    refundQuery({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRefundQuery(params).then(response => {
          commit('SET_REFUND_QUERY', response)
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
