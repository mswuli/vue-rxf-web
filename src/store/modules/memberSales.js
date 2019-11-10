import { getSaleList,addSales,editSales} from '@/api/memberSales'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    saleList: {},
    addSales:{},
    editSales:{},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SALE_LIST: (state, saleList) => {
      state.saleList = saleList
    },
    SET_ADD_SALES: (state, addSales) => {
      state.addSales = addSales
    },
    clear: (state, a) => {
      state.addSales = a
    },
    SET_EDIT_SALES: (state, editSales) => {
      state.editSales = editSales
    },
  },

  actions: {
    // 获取列表
    getSaleList({commit}, params) {
      return new Promise((resolve, reject) => {
        getSaleList(params).then(response => {
          commit('SET_SALE_LIST', response)
          params.callback && params.callback(response)
        }).catch(function (reason) {
          // console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 新增
    addSales({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        addSales(JSON.stringify(params.data)).then(response => {
          commit('SET_ADD_SALES', response)
          params.callback && params.callback()
          // resolve(response)
        })
      })
    },
    // 清空新增信息
    delDetail({
         commit
       }) {
      commit('clear', {})
    },
    // 编辑会员消费
    editSales({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        editSales(JSON.stringify(params.data)).then(response => {
          commit('SET_EDIT_SALES', response)
          params.callback && params.callback()
          // resolve(response)
        })
      })
    },
  }
}
export default objectStore
