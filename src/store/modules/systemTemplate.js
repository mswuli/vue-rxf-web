import { getList, getResourceList, addSystemTemplate, editSystemTemplate, deleteSystemTemplate } from '@/api/systemTemplate'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    systemTemplates: {},
    resources: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SYSTEM_TEMPLATE: (state, templates) => {
      state.systemTemplates = templates
    },
    SET_SYS_RESOURCES: (state, resources) => {
      state.resources = resources
    }
  },

  actions: {
    // 获取列表
    getSystemTemplateList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_SYSTEM_TEMPLATE', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取菜单列表
    getSysResourceList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getResourceList(params).then(response => {
          console.log(response.data.baseResourceList)
          const rList = response.data.baseResourceList
          function getChildrens(parentId) {
            const nodes = []
            for (const rNode of rList) {
              if (rNode.parentId === parentId) {
                const childrens = getChildrens(rNode.id)
                rNode['children'] = childrens
                nodes.push(rNode)
              }
            }
            return nodes
          }
          const baseResourceList = getChildrens('-1', 'baseResourceList')
          commit('SET_SYS_RESOURCES', baseResourceList)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addSystemTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addSystemTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editSystemTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editSystemTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteSystemTemplate({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteSystemTemplate(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
