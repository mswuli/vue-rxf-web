import { getList, getTypeList, getProductTypeList, addGoods, editGoods, deleteGoods } from '@/api/goods'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    goods: {},
    goodsTypes: {},
    productTypes: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_GOODS: (state, goods) => {
      state.goods = goods
    },
    SET_GOODS_TYPES: (state, types) => {
      state.goodsTypes = types
    },
    SET_PRODUCT_TYPES: (state, types) => {
      state.productTypes = types
    }
  },

  actions: {
    // 获取列表
    getGoodsList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_GOODS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取类型列表
    getGoodsTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeList(params).then(response => {
          console.log(response)
          commit('SET_GOODS_TYPES', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取产品类别列表
    getProductTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getProductTypeList(params).then(response => {
          console.log(response)
          commit('SET_PRODUCT_TYPES', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addGoods({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addGoods(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editGoods({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editGoods(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteGoods({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteGoods(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
