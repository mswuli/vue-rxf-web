import { getList, getOrgInfo, addOrganization, editOrganization, deleteOrganization } from '@/api/organization'
import { getToken } from '@/utils/auth'
import moment from 'moment'

const objectStore = {
  state: {
    token: getToken(),
    organizations: {
      data: []
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ORGANIZATIONS: (state, organizations) => {
      state.organizations = organizations
    }
  },

  actions: {
    // 获取列表
    getOrganizationList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          console.log(response.data)
          const rList = response.data
          function getChildrens(parentId) {
            const nodes = []
            for (const rNode of rList) {
              rNode['updateTime'] = moment(rNode['updateTime']).format('YYYY-MM-DD HH:mm:ss')
              if (rNode.parentId === parentId) {
                const childrens = getChildrens(rNode.id)
                rNode['children'] = childrens
                nodes.push(rNode)
              }
            }
            return nodes
          }
          const records = getChildrens(null) || []
          commit('SET_ORGANIZATIONS', records)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getOrgInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOrgInfo(params.data).then(response => {
          console.log(response)
          params.callback && params.callback(response)
        })
      }).catch(function(reason) {
        console.log(reason)
      })
    },

    // 添加
    addOrganization({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addOrganization(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editOrganization({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editOrganization(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteOrganization({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteOrganization(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
