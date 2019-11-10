import { login, logout } from '@/api/login'
import { currentAccount, getMenu } from '@/api/resourceManage'
import { getToken, removeToken, setToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.source).then(response => {
          const data = response.data
          window.localStorage.username = username;
          setToken(data.token_type + ' ' + data.access_token)
          commit('SET_TOKEN', data.token_type + ' ' + data.access_token)
          currentAccount({}).then(response => {
            window.localStorage.account = JSON.stringify(response.data);
            window.localStorage.roleType = response.data.mgrType;
            if (response.success) {
              let plateId = -1
              if (!response.data.orgPlateMappingVOList || response.data.orgPlateMappingVOList.length === 0) {
                plateId = -1
              } else {
                plateId = response.data.orgPlateMappingVOList[0].plateId
              }
              getMenu({ plateId: plateId }).then(resource => {
                window.localStorage.menu = JSON.stringify(resource)
                let url = '/'
                for (const m of resource) {
                  if (m.name === '药店首页' && userInfo.source === 'PHARMACY') {
                    url = m.vueName
                  }
                }
                resolve(url)
              })
            }
          })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        logout().then(response => {
          console.log(response)
          window.location.href = window.localStorage.loginHref;
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          console.log(error)
          window.location.href = window.localStorage.loginHref
          commit('SET_TOKEN', '')
          removeToken()
          // reject(error)
        })
      })
    }
  }
}

export default user
