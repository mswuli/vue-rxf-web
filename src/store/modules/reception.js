import { getList } from '@/api/reception'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    prescriptionInfos: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PRESCRIPTION_INFO: (state, prescriptionInfos) => {
      state.prescriptionInfos = prescriptionInfos
    }
  },

  actions: {
    // 获取角色列表
    getPrescriptionInfoList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          console.log('>>>>>1111'+response.data)
          commit('SET_PRESCRIPTION_INFO', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log('>>>>>')
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },
    clearPrescriptionInfoList({ commit }, params) {
      commit('SET_PRESCRIPTION_INFO', '')
      params.callback && params.callback()
    }
  }
}

export default objectStore
