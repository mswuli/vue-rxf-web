import { getList, getItemTinyRate, getItemTinyRateUnit, getTypeList, getSkuTypeList, getStatusList, addGoodsSku, editGoodsSku, deleteGoodsSku, addTinyRate, editTinyRate, deleteTinyRate } from '@/api/goodssku'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    goodsSkus: {},
    itemTinyRates: {},
    itemTinyRateUnits: {},
    goodsTypes: {},
    skuTypes: {},
    goodsStatus: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_GOODS: (state, goodsSku) => {
      state.goodsSkus = goodsSku
    },
    SET_ITEM_TINY_RATE: (state, goodsItems) => {
      state.itemTinyRates = goodsItems
    },
    SET_ITEM_TINY_RATE_UNITS: (state, goodsItemUnits) => {
      state.itemTinyRateUnits = goodsItemUnits.data
    },
    SET_GOODS_TYPES: (state, types) => {
      state.goodsTypes = types
    },
    SET_SKU_TYPES: (state, types) => {
      state.skuTypes = types
    },
    SET_GOODS_STATUS: (state, status) => {
      state.goodsStatus = status
    }
  },

  actions: {
    // 获取列表
    getGoodsSkuList({ commit }, params) {
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
    // 获取列表
    getItemTinyRate({ commit }, params) {
      commit('SET_ITEM_TINY_RATE', '')
      return new Promise((resolve, reject) => {
        getItemTinyRate(params).then(response => {
          commit('SET_ITEM_TINY_RATE', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取列表
    getItemTinyRateUnit({ commit }, params) {
      return new Promise((resolve, reject) => {
        getItemTinyRateUnit(params).then(response => {
          commit('SET_ITEM_TINY_RATE_UNITS', response)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 清空商品列表
    clearGoodsSkuList() {
      this.commit('SET_GOODS', '')
    },

    // 设置商品列表
    setGoodsSkuList({ commit }, params) {
      console.log(params)
      commit('SET_GOODS', params)
    },

    // 获取类型列表
    getGoodsSkuTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeList(params).then(response => {
          console.log(response)
          commit('SET_GOODS_TYPES', response.data)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 获取处方类别列表
    getSkuTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getSkuTypeList(params).then(response => {
          console.log(response)
          commit('SET_SKU_TYPES', response.data)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 获取状态列表
    getSkuStatusList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getStatusList(params).then(response => {
          console.log(response)
          commit('SET_GOODS_STATUS', response.data)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 添加
    addGoodsSku({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addGoodsSku(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editGoodsSku({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editGoodsSku(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteGoodsSku({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteGoodsSku(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addTinyRate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addTinyRate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editTinyRate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editTinyRate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteTinyRate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteTinyRate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
