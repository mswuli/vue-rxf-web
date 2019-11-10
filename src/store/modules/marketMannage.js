import { getMarketList, getDetailList,deleteList,getDetailTemplate,getNameList,deleteTemplate } from '@/api/marketMannage'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    marketList: {},
    detailList:{},
    deleteList:{},
    detailTemplate:{},
    nameList:{},
    deleteTemplate:{},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_MARKET_LIST: (state, marketList) => {
      state.marketList = marketList
    },
    SET_DETAIL_LIST: (state, detailList) => {
      state.detailList = detailList
    },
    SET_DETAIL_TEMPLATE: (state, detailTemplate) => {
      state.detailTemplate = detailTemplate
    },
    clear: (state, a) => {
      state.detailTemplate = a
    },
    SET_NAME_LIST: (state, nameList) => {
      state.nameList = nameList
    },
  },

  actions: {
    // 获取列表
    getMarketList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getMarketList(params).then(response => {
          commit('SET_MARKET_LIST', response)
          // params.callback && params.callback()
          resolve(response)
        }).catch(function(reason) {
          params.callback && params.callback()
        })
      })
    },
    // 获取详情列表
    getDetailList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDetailList(params).then(response => {
          commit('SET_DETAIL_LIST', response.data)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 删除列表
    getDeleteList({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteList(params).then(response => {
          params.callback && params.callback(response)
        })
      })
    },
    // 获取模板详情
    getDetailTemplate({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDetailTemplate(params).then(response => {
          commit('SET_DETAIL_TEMPLATE', response.data)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 清空模板详情信息
    delDetailTemplate({commit}) {
      commit('clear', {})
    },
    // 获取活动名称
    getNameList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNameList(params).then(response => {
          commit('SET_NAME_LIST', response)
          // params.callback && params.callback()
          resolve(response)
        }).catch(function(reason) {
          // params.callback && params.callback()
        })
      })
    },
    // 删除模板活动
    deleteTemplate({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteTemplate(params).then(response => {
          params.callback && params.callback(response)
        })
      })
    },
  }
}

export default objectStore
