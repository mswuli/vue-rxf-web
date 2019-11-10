import { getList, addRuleDictionary, editRuleDictionary, deleteRuleDictionary } from '@/api/hspRuleDictionary'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    hspRuleDictionarys: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_RULE_DICTIONARYS: (state, ruleDictionarys) => {
      state.hspRuleDictionarys = ruleDictionarys
    }
  },

  actions: {
    // 获取列表
    getRuleDictionaryList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_RULE_DICTIONARYS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    clearRuleDictionaryList() {
      this.commit('SET_RULE_DICTIONARYS', '')
    },

    // 添加
    addRuleDictionary({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addRuleDictionary(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editRuleDictionary({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editRuleDictionary(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteRuleDictionary({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteRuleDictionary(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
