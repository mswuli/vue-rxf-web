import { getList, getHospitalTypeList, getRsTemplateList, addHospital, editHospital, deleteHospital, getHospitalDepartmentList
  , addDepartment, editDepartment, deleteDepartment, setAdmin, getHspSkuRelList, getDoctorsByHospital, addHospitalPrescription } from '@/api/hospital'
import { getToken } from '@/utils/auth'

const objectStore = {
  state: {
    token: getToken(),
    hospitals: {},
    hospitalDoctors: {},
    hspSkuRels: {},
    hospitalTypes: {},
    hospitalDepartments: {
      data: []
    },
    hospitalDepartmentTrees: [],
    rsTemplate: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_HOSPITALS: (state, hospitals) => {
      state.hospitals = hospitals
    },
    SET_HOSPITAL_DOCTORS: (state, hospitalDoctors) => {
      state.hospitalDoctors = hospitalDoctors
    },
    SET_HSP_SKU_REL: (state, skuRels) => {
      state.hspSkuRels = skuRels
    },
    SET_HOSPITAL_TYPES: (state, types) => {
      state.hospitalTypes = types
    },
    SET_HOSPITAL_DEPARTMENTS: (state, departments) => {
      state.hospitalDepartments = departments
    },
    SET_HOSPITAL_DEPARTMENT_TREE: (state, departments) => {
      state.hospitalDepartmentTrees = departments
    },
    RS_TEMPLATE: (state, rsTemplate) => {
      state.rsTemplate = rsTemplate
    }
  },

  actions: {
    // 获取列表
    getHospitalList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getList(params).then(response => {
          commit('SET_HOSPITALS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取列表
    getDoctorsByHospital({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDoctorsByHospital(params).then(response => {
          commit('SET_HOSPITAL_DOCTORS', response)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 清空医院列表
    clearHospitalList() {
      this.commit('SET_HOSPITALS', '')
    },

    // 设置医院列表
    setHospitalList({ commit }, params) {
      console.log(params)
      commit('SET_HOSPITALS', params)
    },

    // 获取药店类型列表
    getHospitalTypeList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getHospitalTypeList(params).then(response => {
          console.log(response)
          commit('SET_HOSPITAL_TYPES', response.data)
        }).catch(function(reason) {
          console.log(reason)
        })
      })
    },

    // 获取医院处方列表
    getHspSkuRelList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getHspSkuRelList(params).then(response => {
          console.log(response)
          resolve(response)
          commit('SET_HSP_SKU_REL', response)
        }).catch(reason => {
          console.log(reason)
          reject(reason)
        })
      })
    },

    // 获取处方模版
    getRsTemplateList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRsTemplateList(params).then(response => {
          console.log(response)
          commit('RS_TEMPLATE', response.data)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取科室列表
    getHospitalDepartmentList({ commit }, params) {
      console.log(params)
      return new Promise((resolve, reject) => {
        getHospitalDepartmentList(params).then(response => {
          console.log(response)
          commit('SET_HOSPITAL_DEPARTMENTS', response)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 获取科室列表
    getHospitalDepartmentTreeList({ commit }, params) {
      console.log(params)
      return new Promise((resolve, reject) => {
        getHospitalDepartmentList(params).then(response => {
          console.log(response)
          const rList = response.data
          commit('SET_HOSPITAL_DEPARTMENTS', response)
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
          const records = getChildrens(null) || []
          commit('SET_HOSPITAL_DEPARTMENT_TREE', records)
          params.callback && params.callback()
        }).catch(function(reason) {
          console.log(reason)
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addHospital({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addHospital(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addHospitalPrescription({ commit }, params) {
      // console.log(params.data)
      return new Promise((resolve, reject) => {
        addHospitalPrescription(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback(response)
          console.log(response,222)
        }).catch(function (reason) {
          console.log(reason,444)
          params.call && params.call(reason)
        })
      })
    },

    // 编辑
    editHospital({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        editHospital(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteHospital({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteHospital(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 添加
    addDepartment({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        addDepartment(JSON.stringify(params.data)).then(response => {
          // console.log(response,333)
          params.callback && params.callback()
        })
      })
    },

    // 编辑
    editDepartment({ commit }, params) {
      return new Promise((resolve, reject) => {
        params.data.parent = null
        editDepartment(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 删除
    deleteDepartment({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        deleteDepartment(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    },

    // 设置管理员
    setHospitalAdmin({ commit }, params) {
      console.log(params.data)
      return new Promise((resolve, reject) => {
        setAdmin(JSON.stringify(params.data)).then(response => {
          params.callback && params.callback()
        })
      })
    }
  }
}

export default objectStore
