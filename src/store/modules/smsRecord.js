import { getList, addRecord, editRecord, deleteRecord } from '@/api/smsRecord'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    smsRecords: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SMS_RECORDS: (state, smsRecords) => {
      state.smsRecords = smsRecords
    }
  },

  actions: {
    // 获取列表
    getSMSRecordList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_SMS_RECORDS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addSMSRecord({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addRecord(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editSMSRecord({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editRecord(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteSMSRecord({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteRecord(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
