import { getList, addHspSkuRel, editHspSkuRel, deleteHspSkuRel } from '@/api/hospitalVariety'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    hspSkuRels: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_HSPSKURELS: (state, hspSkuRels) => {
      state.hspSkuRels = hspSkuRels
    }
  },

  actions: {
    // 获取列表
    getHspSkuRelList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_HSPSKURELS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addHspSkuRel({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addHspSkuRel(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editHspSkuRel({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editHspSkuRel(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteHspSkuRel({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteHspSkuRel(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
