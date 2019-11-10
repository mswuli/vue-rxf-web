import { getList, getMenuList, getResourceType, addRes, editRes, deleteRes } from '@/api/resourceManage'
import { getToken } from '@/utils/auth'
import moment from 'moment'

const objectStore = {
  state: {
    token: getToken(),
    ress: {
      data: []
    },
    menus: {},
    resourceType: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_RESS: (state, ress) => {
      state.ress = ress
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_RESOURCE_TYPE: (state, resourceType) => {
      state.resourceType = resourceType
    }
  },

  actions: {
    // 获取列表
    getResList({ commit }, params) {
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
          commit('SET_RESS', records)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getMenuList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getMenuList(params).then(response => {
          commit('SET_MENUS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getResourceType({ commit }, params) {
      return new Promise((resolve, reject) => {
        getResourceType(params).then(response => {
          commit('SET_RESOURCE_TYPE', response)
          params.callback && params.callback()
          console.log(response,8989)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 添加
    addRes({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addRes(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editRes({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editRes(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteRes({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteRes(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
