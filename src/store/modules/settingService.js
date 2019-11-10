import { getList, getServiceStatus, getServiceFee, addService, editService, deleteService } from '@/api/settingService'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    settingServices: {},
    serviceStatus: {},
    serviceFee: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SERVICES: (state, settingServices) => {
      state.settingServices = settingServices
    },
    SET_SERVICE_STATUS: (state, serviceStatus) => {
      state.serviceStatus = serviceStatus
    },
    SET_SERVICE_FEE: (state, serviceFee) => {
      state.serviceFee = serviceFee
    }
  },

  actions: {
    // 获取列表
    getSettingServiceList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_SERVICES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getServiceStatus({ commit }, params) {
      return new Promise((resolve, reject) => {
        getServiceStatus(params).then(response => {
          commit('SET_SERVICE_STATUS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getServiceFee({ commit }, params) {
      return new Promise((resolve, reject) => {
        getServiceFee(params).then(response => {
          commit('SET_SERVICE_FEE', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addService({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addService(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editService({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editService(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteService({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteService(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
