import { getList, getTypeList } from '@/api/sysLogs'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    sysLogs: {},
    types: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SYS_LOGS: (state, sysLogs) => {
      state.sysLogs = sysLogs
    },
    SET_TYPES: (state, types) => {
      state.types = types
    }
  },

  actions: {
    // 获取列表
    getSysLogsList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_SYS_LOGS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取类型列表
    getSysLogsTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeList(params).then(response => {
          console.log(response)
          commit('SET_TYPES', response.data)
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
