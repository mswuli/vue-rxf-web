import { getList, getPharmacyAssistantStatusList, getManageList, addPharmacyAssistant, editPharmacyAssistant, registAssistant, deletePharmacyAssistant } from '@/api/clerkManage'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    pharmacyAssistants: {},
    pharmacyAssistantStatus: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PHARMACY_ASSISTANTS: (state, pharmacyAssistants) => {
      state.pharmacyAssistants = pharmacyAssistants
    },
    SET_PHARMACY_ASSISTANT_STATUS: (state, pharmacyAssistantStatus) => {
      state.pharmacyAssistantStatus = pharmacyAssistantStatus
    }
  },

  actions: {
    // 获取列表
    getPharmacyAssistantList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_PHARMACY_ASSISTANTS', response)
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
    getPharmacyAssistantManageList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getManageList(params).then(response => {
          commit('SET_PHARMACY_ASSISTANTS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取状态列表
    getPharmacyAssistantStatusList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPharmacyAssistantStatusList(params).then(response => {
          commit('SET_PHARMACY_ASSISTANT_STATUS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addPharmacyAssistant({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addPharmacyAssistant(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editPharmacyAssistant({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editPharmacyAssistant(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 提交审核
    registAssistant({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        registAssistant(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deletePharmacyAssistant({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deletePharmacyAssistant(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
