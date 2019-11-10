import { getList, getTypeList, addDictionary, editDictionary, deleteDictionary, getDictionaryItemList, addDictionaryItem, editDictionaryItem, deleteDictionaryItem } from '@/api/dictionary'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    dictionarys: {},
    dictionaryTypes: {},
    dictionaryItems: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_DICTIONARYS: (state, dictionarys) => {
      state.dictionarys = dictionarys
    },
    SET_DICTIONARY_TYPES: (state, types) => {
      state.dictionaryTypes = types
    },
    SET_DICTIONARY_ITEMS: (state, items) => {
      state.dictionaryItems = items
    }
  },

  actions: {
    // 获取列表
    getDictionaryList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_DICTIONARYS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取类型列表
    getTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTypeList(params).then(response => {
          console.log(response)
          commit('SET_DICTIONARY_TYPES', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addDictionary({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addDictionary(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editDictionary({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editDictionary(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteDictionary({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteDictionary(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取字典详情
    getDictionaryItemList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDictionaryItemList(params.type).then(response => {
          console.log(response)
          commit('SET_DICTIONARY_ITEMS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteDictionaryItem({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteDictionaryItem(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addDictionaryItem({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addDictionaryItem(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editDictionaryItem({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editDictionaryItem(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
