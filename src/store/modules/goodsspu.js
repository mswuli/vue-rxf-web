import { getList, getStatusList, addGoodsSpu, editGoodsSpu, deleteGoodsSpu } from '@/api/goodsspu'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    goodsSpus: {},
    goodsStatus: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_GOODS_SPU: (state, spu) => {
      state.goodsSpus = spu
    },
    SET_GOODS_STATUS: (state, status) => {
      state.goodsStatus = status
    }
  },

  actions: {
    // 获取列表
    getGoodsSpuList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_GOODS_SPU', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取状态列表
    getStatusList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getStatusList(params).then(response => {
          console.log(response)
          commit('SET_GOODS_STATUS', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addGoodsSpu({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addGoodsSpu(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editGoodsSpu({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editGoodsSpu(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteGoodsSpu({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteGoodsSpu(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
