import { getList, addAccount, editAccount, deleteAccount, getAccountTypeList } from '@/api/account'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    accounts: {},
    accountTypes: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ACCOUNTS: (state, accounts) => {
      state.accounts = accounts
    },
    SET_ACCOUNT_TYPES: (state, accountTypes) => {
      console.log(accountTypes)
      state.accountTypes = accountTypes
    }
  },

  actions: {
    // 获取账号列表
    getAccountList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_ACCOUNTS', response)
          params.callback && params.callback()
        })
      })
    },

    // 添加账号
    addAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取平台列表
    getAccountTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAccountTypeList(params).then(response => {
          console.log(response)
          commit('SET_ACCOUNT_TYPES', response.data)
        })
      })
    },

    // 编辑账号
    editAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除账号
    deleteAccount({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteAccount(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
