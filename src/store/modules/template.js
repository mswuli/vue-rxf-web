import { getList, addTemplate, editTemplate, deleteTemplate } from '@/api/template'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    templates: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TEMPLATES: (state, templates) => {
      state.templates = templates
    }
  },

  actions: {
    // 获取列表
    getTemplateList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_TEMPLATES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
