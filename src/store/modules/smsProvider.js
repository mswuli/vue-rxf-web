import { getList, getProviderCodeList, addProvider, editProvider, deleteProvider } from '@/api/smsProvider'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    providers: {},
    providerCodes: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PROVIDERS: (state, providers) => {
      state.providers = providers
    },
    SET_PROVIDER_CODES: (state, providerCodes) => {
      state.providerCodes = providerCodes
    }
  },

  actions: {
    // 获取列表
    getSMSProviderList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_PROVIDERS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取服务商列表
    getProviderCodeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getProviderCodeList(params).then(response => {
          console.log(response.data)
          commit('SET_PROVIDER_CODES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addSMSProvider({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addProvider(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editSMSProvider({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editProvider(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteSMSProvider({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteProvider(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
