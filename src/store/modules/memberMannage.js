import { getMemberMannage,detailMemberMannage,electPicRecord,electRecord,customLabel,addCustomer } from '@/api/memberMannage'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    memberList: {},
    detailLists:{},
    electPicRecord:{},
    electRecord:{},
    customLabel:[],
    addCustomer:{},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_MEMBER_LIST: (state, memberList) => {
      state.memberList = memberList
    },
    SET_ELECT_PIC_RECORD: (state, electPicRecord) => {
      state.electPicRecord = electPicRecord
    },
    SET_ELECT_RECORD: (state, electRecord) => {
      state.electRecord = electRecord
    },
    SET_CUSTOM_LABEL: (state, customLabel) => {
      state.customLabel = customLabel
    },
    SET_CUSTOM_LABELS:(state, customLabels)=>{
      let parentId = customLabels[0].parentId;
      state.customLabel.forEach(i=>{
        if(i.id == parentId) {
          i.content = customLabels
        }
      })
    },
    SET_ADD_CUSTOMER: (state, addCustomer) => {
      state.addCustomer = addCustomer
    },
    SET_DETAIL_LISTS: (state, detailLists) => {
      state.detailLists = detailLists
    },
  },

  actions: {
    // 获取列表
    getMemberList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getMemberMannage(params).then(response => {
          commit('SET_MEMBER_LIST', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          // console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    // 获取客户标签
    getCustomLabel({ commit }, params) {
      return new Promise((resolve, reject) => {
        customLabel(params).then(response => {
          commit('SET_CUSTOM_LABEL', response.data);
          // params.callback && params.callback()
          // console.log(response,9)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
          // params.callback && params.callback()
        })
      })
    },
    getCustomLabels({ commit }, params) {
      return new Promise((resolve, reject) => {
        customLabel(params).then(response => {
          commit('SET_CUSTOM_LABELS', response.data);
          // params.callback && params.callback()
          // console.log(response,9)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
          // params.callback && params.callback()
        })
      })
    },
    // 获取详情
    getDetailMemberMannage({ commit }, params) {
      return new Promise((resolve, reject) => {
        detailMemberMannage(params).then(response => {
          if (response.data) {
            commit('SET_DETAIL_LISTS', response.data)
          }else {
            commit('SET_DETAIL_LISTS', {})
          }
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 获取电子病历图片
    getElectronicRecord({ commit }, params) {
      return new Promise((resolve, reject) => {
        electPicRecord(params).then(response => {
          commit('SET_ELECT_PIC_RECORD', response.data)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 获取电子病历表格
    getElectRecord({ commit }, params) {
      return new Promise((resolve, reject) => {
        electRecord(params).then(response => {
          commit('SET_ELECT_RECORD', response.data)
          resolve(response)
        }).catch(function(reason) {
          // console.log(reason)
        })
      })
    },
    // 新增
    addCustomer({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        addCustomer(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
          // resolve(response)
        })
      })
    },
  }
}

export default objectStore
