import { getCurrentAccountAdminPermission, getList, getAccountRoleList, getRoleTypeList, addRole, editRole, deleteRole, getPermissionList,
  saveResource, saveOrg, getOrganizationList, getAuthUserList, getAuthExcludeUserList, bindUser, unbindUser } from '@/api/role'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    roles: {},
    accountRoles: {},
    currentAccountAdminPermission: {},
    roleOrganizations: [],
    roleTypes: {},
    resourceList: [],
    orgList: [],
    selectedResourceList: [],
    selectedOrgList: [],
    roleUserList: [],
    roleExcludeUserList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ACCOUNT_ROLES: (state, roles) => {
      state.accountRoles = roles
    },
    SET_CURRENT_ACCOUNT_ADMIN_PERMISSION: (state, permission) => {
      state.currentAccountAdminPermission = permission
    },
    SET_ROLE_ORGS: (state, roleOrganizations) => {
      state.roleOrganizations = roleOrganizations
    },
    SET_ROLE_TYPES: (state, roleTypes) => {
      state.roleTypes = roleTypes
    },
    SET_RESOURCE_LIST: (state, list) => {
      state.resourceList = list
    },
    SET_ORG_LIST: (state, list) => {
      state.orgList = list
    },
    SET_SELECTED_RESOURCE_LIST: (state, list) => {
      state.selectedResourceList = list
    },
    SET_SELECTED_ORG_LIST: (state, list) => {
      state.selectedOrgList = list
    },
    SET_ROLE_USERS: (state, list) => {
      state.roleUserList = list
    },
    SET_ROLE_EXCLUDE_USERS: (state, list) => {
      state.roleExcludeUserList = list
    }
  },

  actions: {
    // 获取角色列表
    getCurrentAccountAdminPermission({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCurrentAccountAdminPermission(params).then(response => {
          console.log(response.data)
          commit('SET_CURRENT_ACCOUNT_ADMIN_PERMISSION', response)
          const rList = response.data.orgList
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
          const orgList = getChildrens('-1')
          console.log(orgList)
          commit('SET_ROLE_ORGS', orgList)
          if (!response.data.canSelectSource) {
            commit('SET_ROLES', {
              data: {
                id: 1,
                code: response.data.sourceCode,
                name: response.data.sourceName
              }
            })
          }
          resolve(response)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 获取角色列表
    getRoleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          console.log(response.data)
          commit('SET_ROLES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取账号下的角色列表
    getAccountRoleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAccountRoleList(params).then(response => {
          console.log(response.data)
          commit('SET_ACCOUNT_ROLES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取组织列表
    getRoleOrganizationList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOrganizationList(params).then(response => {
          console.log(response.data)
          const rList = response.data
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
          const orgList = getChildrens(null)
          commit('SET_ROLE_ORGS', orgList)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取角色分类列表
    getRoleTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleTypeList(params).then(response => {
          console.log(response.data)
          commit('SET_ROLE_TYPES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加角色
    addRole({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addRole(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑角色
    editRole({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editRole(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 绑定角色
    bindUser({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        bindUser(params.data).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 解绑角色
    unbindUser({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        unbindUser(params.data).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除角色
    deleteRole({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteRole(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取权限列表
    getPermissionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPermissionList(params.row).then(response => {
          console.log(response.data)
          const rList = response.data['baseResourceList']
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

          const oList = response.data['baseOrgList']
          function getOChildrens(parentId) {
            const nodes = []
            for (const rNode of oList) {
              if (rNode.parentId === parentId) {
                const childrens = getOChildrens(rNode.id)
                rNode['children'] = childrens
                nodes.push(rNode)
              }
            }
            return nodes
          }

          const baseResourceList = getChildrens('-1', 'baseResourceList')
          const baseOrgList = getOChildrens('-1', 'baseOrgList')

          commit('SET_RESOURCE_LIST', baseResourceList)
          commit('SET_ORG_LIST', baseOrgList)

          const resourceList = []
          const rsList = response.data['resourceList']
          const hasChild = (item, list) => {
            let isIn = false
            for (const i of list) {
              if (i.parentId === item.id) {
                console.log(1)
                isIn = true
              }
            }
            return isIn
          }
          for (const rs of rsList) {
            if (!hasChild(rs, rsList)) {
              resourceList.push(rs.id)
            }
          }

          const orgList = []
          const osList = response.data['orgList']
          for (const os of osList) {
            if (!hasChild(os, osList)) {
              orgList.push(os.id)
            }
          }

          commit('SET_SELECTED_RESOURCE_LIST', resourceList)
          commit('SET_SELECTED_ORG_LIST', orgList)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 保存授权功能菜单
    saveResource({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        saveResource(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 保存授权数据权限
    saveOrg({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        saveOrg(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 获取角色分配用户列表
    getAuthUserList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAuthUserList(params).then(response => {
          commit('SET_ROLE_USERS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取角色分配用户列表
    getAuthExcludeUserList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAuthExcludeUserList(params).then(response => {
          commit('SET_ROLE_EXCLUDE_USERS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
