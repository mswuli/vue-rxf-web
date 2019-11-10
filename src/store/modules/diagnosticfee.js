import { getList, getDiagnosticList, addItem, editItem, deleteItem } from '@/api/diagnosticfee'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    diagnosticFees: {},
    hospitalDiagnosticFees: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_DIAGNOSTIC_FEES: (state, diagnosticFees) => {
      state.diagnosticFees = diagnosticFees
    },
    SET_HSP_DIAGNOSTIC_FEES: (state, diagnosticFees) => {
      state.hospitalDiagnosticFees = diagnosticFees
    }
  },

  actions: {
    // 获取列表
    getDiagnosticFeeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_DIAGNOSTIC_FEES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getHospitalDiagnosticList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDiagnosticList(params).then(response => {
          commit('SET_HSP_DIAGNOSTIC_FEES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 清空列表
    clearDiagnosticFeeList() {
      this.commit('SET_DIAGNOSTIC_FEES', '')
    },

    // 添加
    addDiagnosticFee({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addItem(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editDiagnosticFee({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editItem(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteDiagnosticFee({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteItem(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
