import { getList, getTacticsType, getTacticsStatus, addTactic, editTactic, deleteTactic } from '@/api/tactic'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    tactics: {},
    tacticsStatus: {},
    tacticsType: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TACTICS: (state, tactics) => {
      state.tactics = tactics
    },
    SET_TACTICS_STATUS: (state, tacticsStatus) => {
      state.tacticsStatus = tacticsStatus
    },
    SET_TACTICS_TYPE: (state, types) => {
      state.tacticsType = types
    }
  },

  actions: {
    // 获取列表
    getTacticList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_TACTICS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getTacticsStatus({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTacticsStatus(params).then(response => {
          commit('SET_TACTICS_STATUS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取策略类型
    getTacticsType({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTacticsType(params).then(response => {
          commit('SET_TACTICS_TYPE', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addTactic({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addTactic(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editTactic({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editTactic(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteTactic({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteTactic(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
