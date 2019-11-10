import { getList, addTemplate, editTemplate, deleteTemplate, getTemplateTypeList } from '@/api/smsTemplate'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    smsTemplates: {},
    templateTypes: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SMS_TEMPLATES: (state, smsTemplates) => {
      state.smsTemplates = smsTemplates
    },
    SET_TEMPLATE_TYPES: (state, templateTypes) => {
      state.templateTypes = templateTypes
    }
  },

  actions: {
    // 获取列表
    getSMSTemplateList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_SMS_TEMPLATES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取模版类型列表
    getTemplateTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTemplateTypeList(params).then(response => {
          console.log(response.data)
          commit('SET_TEMPLATE_TYPES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addSMSTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editSMSTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteSMSTemplate({ commit }, params) {
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
