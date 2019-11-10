import { getList, getTacticList, editTacticList, getBindList, getUnBindList, editBind, deleteBind, getAipharmacyRel, updateAiPharmacyRel } from '@/api/smartPharmacy'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    aiHsps: {},
    tactics: {},
    aiPharmacyRel: {},
    binds: {},
    unbinds: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_AI_HSPS: (state, aiHsps) => {
      state.aiHsps = aiHsps
    },
    SET_TACTICS: (state, tactics) => {
      state.tactics = tactics
    },
    SET_AI_PHARMACY_REL: (state, rel) => {
      state.aiPharmacyRel = rel
    },
    SET_BINDS: (state, binds) => {
      state.binds = binds
    },
    SET_UNBINDS: (state, binds) => {
      state.unbinds = binds
    }
  },

  actions: {
    // 获取智能药店医院列表
    getAiHspList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_AI_HSPS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取智能规则
    getPharmacyTacticList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTacticList(params.data).then(response => {
          params.callback && params.callback()
          commit('SET_TACTICS', response)
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取智能药店信息
    getAipharmacyRel({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAipharmacyRel(params).then(response => {
          commit('SET_AI_PHARMACY_REL', response.data)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 修改智能药店信息
    editAiPharmacyRel({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        updateAiPharmacyRel(JSON.stringify(params)).then(response => {
          resolve(response)
        }).catch(function(reason) {
          reject(reason)
        })
      })
    },

    // 设置智能规则
    editTacticList({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editTacticList(JSON.stringify(params.data.list), params.data.id).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取医院绑定药店
    getBindList({ commit }, params) {
      commit('SET_BINDS', '')
      return new Promise((resolve, reject) => {
        getBindList(params).then(response => {
          params.callback && params.callback()
          commit('SET_BINDS', response)
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取医院绑定药店
    getUnBindList({ commit }, params) {
      commit('SET_UNBINDS', '')
      return new Promise((resolve, reject) => {
        getUnBindList(params.data).then(response => {
          params.callback && params.callback()
          commit('SET_UNBINDS', response)
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editBind({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editBind(params.data).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteBind({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteBind(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
