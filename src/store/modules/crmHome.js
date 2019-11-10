import { getPromotionsList,selectTemplate,getFindAlertList,editTemplate,sendMessage,queryLabel,customTemplate,selectTemp } from '@/api/crmHome'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    promotionsList:{},
    selectTemplate:{},
    findAlertList:{},
    editTemplate:{},
    sendMessage:{},
    queryLabel:{},
    customTemplate:{},
    selectTemp:{},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PROMOTIONS_LIST: (state, promotionsList) => {
      state.promotionsList = promotionsList
    },
    SET_FINDALERT_LIST: (state, findAlertList) => {
      state.findAlertList = findAlertList
    },
    SET_SELECT_TEMPLATE: (state, selectTemplate) => {
      state.selectTemplate = selectTemplate
    },
    SET_EDIT_TEMPLATE: (state, editTemplate) => {
      state.editTemplate = editTemplate
    },
    SET_SEND_MESSAGE: (state, sendMessage) => {
      state.sendMessage = sendMessage
    },
    SET_CUSTOM_TEMPLATE: (state, customTemplate) => {
      state.customTemplate = customTemplate
    },
    SET_QUERY_LABEL: (state, queryLabel) => {
      state.queryLabel = queryLabel
    },
    SET_SELECT_TEMP: (state, selectTemp) => {
      state.selectTemp = selectTemp
    },
  },

  actions: {
    // 获取列表
    getPromotionsList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPromotionsList(params).then(response => {
          commit('SET_PROMOTIONS_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          // console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 预警列表
    getFindAlertList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getFindAlertList(params).then(response => {
          commit('SET_FINDALERT_LIST', response)
          // params.callback && params.callback()
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 下拉选择模板
    getSelectTemplate({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectTemplate(params).then(response => {
          commit('SET_SELECT_TEMPLATE', response)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 编辑模板
    getEditTemplate({ commit }, params) {
      return new Promise((resolve, reject) => {
        editTemplate(params).then(response => {
          commit('SET_EDIT_TEMPLATE', response)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 新增活动/发送短信
    sendMessage({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        sendMessage(params.data).then(response => {
          // params.callback && params.callback()
          resolve(response)
        })
      })
    },
    // 根据电话查询客户标签
    getQueryLabel({ commit }, params) {
      return new Promise((resolve, reject) => {
        queryLabel(params).then(response => {
          commit('SET_QUERY_LABEL', response)
          resolve(response)
        }).catch(function(reason) {
        })
      })
    },
    // 自定义模板
    customTemplate({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        customTemplate(params.data).then(response => {
          // params.callback && params.callback()
          resolve(response)
        })
      })
    },
    // 编辑时选择模板
    getSelectTemp({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectTemp(params).then(response => {
          commit('SET_SELECT_TEMP', response.data)
          resolve(response)
        }).catch(function(reason) {
        })
      })
    },
  }
}

export default objectStore
