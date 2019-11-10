import { getList, saveResourcePool } from '@/api/resource'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    resources: [],
    selectedPTList: [],
    selectedYYList: [],
    selectedYDList: [],
    selectedJGList: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_RESOURCES: (state, resources) => {
      const rList = resources.resourceListMap.default
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
      state.resources = getChildrens('-1')

      if (resources.orgResourcePoolMap && resources.orgResourcePoolMap.PLATFORM) {
        const selectedPT = resources.orgResourcePoolMap.PLATFORM
        const selectedPTList = []
        for (const node of selectedPT) {
          if (node && node.id && (node.parentId !== '-1' || node.type === 'page')) {
            selectedPTList.push(node.id)
          }
        }
        state.selectedPTList = selectedPTList
      }

      if (resources.orgResourcePoolMap && resources.orgResourcePoolMap.HOSPITAL) {
        const selectedYY = resources.orgResourcePoolMap.HOSPITAL
        const selectedYYList = []
        for (const node of selectedYY) {
          if (node && node.id && (node.parentId !== '-1' || node.type === 'page')) {
            selectedYYList.push(node.id)
          }
        }
        state.selectedYYList = selectedYYList
      }

      if (resources.orgResourcePoolMap && resources.orgResourcePoolMap.PHARMACY) {
        const selectedYD = resources.orgResourcePoolMap.PHARMACY
        const selectedYDList = []
        for (const node of selectedYD) {
          if (node && node.id && (node.parentId !== '-1' || node.type === 'page')) {
            selectedYDList.push(node.id)
          }
        }
        state.selectedYDList = selectedYDList
      }
      if (resources.orgResourcePoolMap && resources.orgResourcePoolMap.SUPERVISION) {
        const selectedJG = resources.orgResourcePoolMap.SUPERVISION
        const selectedJGList = []
        for (const node of selectedJG) {
          if (node && node.id && (node.parentId !== '-1' || node.type === 'page')) {
            selectedJGList.push(node.id)
          }
        }
        state.selectedJGList = selectedJGList
      }
    }
  },

  actions: {
    // 获取列表
    getResourceList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_RESOURCES', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 保存授权功能菜单
    saveResourcePool({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        saveResourcePool(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
