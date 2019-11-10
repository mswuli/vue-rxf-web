import { getList, getOperateTypeList } from '@/api/sysFileUploadRecord'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    bindRecords: {},
    operateTypes: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_BIND_RECORDS: (state, bindRecords) => {
      state.bindRecords = bindRecords
    },
    SET_OPERATE_TYPES: (state, operateTypes) => {
      state.operateTypes = operateTypes
    }
  },

  actions: {
    // 获取列表
    getBindRecordsList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_BIND_RECORDS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取操作类型列表
    getOperateTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOperateTypeList(params).then(response => {
          console.log(response)
          commit('SET_OPERATE_TYPES', response.data)
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
