import { getList, addDoctor, editDoctor, deleteDoctor, getSexList, getDoctorTitleList, getTitleTeachTypeList, getEducationBackgroundList } from '@/api/doctor'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    doctors: {},
    sexTypes: {},
    doctorTitles: {},
    titleTeachTypes: {},
    educationBackgrounds: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_DOCTORS: (state, doctors) => {
      state.doctors = doctors
    },
    SET_SEX_TYPES: (state, sexTypes) => {
      state.sexTypes = sexTypes.data
    },
    SET_DOCTOR_TITLES: (state, titles) => {
      state.doctorTitles = titles.data
    },
    SET_TITLE_TEACH_TYPES: (state, titles) => {
      state.titleTeachTypes = titles.data
    },
    SET_EDUCATION_BACKGROUNDS: (state, titles) => {
      state.educationBackgrounds = titles.data
    }
  },

  actions: {
    // 获取列表
    getDoctorList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_DOCTORS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取性别列表
    getSexList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getSexList(params).then(response => {
          commit('SET_SEX_TYPES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取职称列表
    getDoctorTitleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDoctorTitleList(params).then(response => {
          commit('SET_DOCTOR_TITLES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取教学职称列表
    getTitleTeachTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTitleTeachTypeList(params).then(response => {
          commit('SET_TITLE_TEACH_TYPES', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取学历列表
    getEducationBackgroundList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getEducationBackgroundList(params).then(response => {
          commit('SET_EDUCATION_BACKGROUNDS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addDoctor({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addDoctor(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editDoctor({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editDoctor(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteDoctor({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteDoctor(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
