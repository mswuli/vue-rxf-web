import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/hospital/rsHospital/list',
    method: 'get',
    params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getDoctorsByHospital(params) {
  return request({
    url: '/business/hospital/rsDoctor/listAllByHspId/' + params.params.id,
    method: 'get'
  })
}

/**
 * 获取医院类型
 * @param {*} params
 */
export function getHospitalTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/HOSPITAL_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取处方模版
 * @param {*} params
 */
export function getRsTemplateList(params) {
  return request({
    url: '/admin/additionalsettings/rsTemplate/listAll',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addHospital(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsHospital',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editHospital(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsHospital/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteHospital(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsHospital/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 获取医院科室
 * @param {*} params
 */
export function getHospitalDepartmentList(params) {
  console.log(params.id)
  return request({
    url: '/business/hospital/hspDepartment/list/' + params.id,
    method: 'get',
    params
  })
}

/**
 * 获取医院处方列表
 * @param {*} params
 */
export function getHspSkuRelList(params) {
  return request({
    url: '/business/hospital/hspSkuRel/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addDepartment(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspDepartment',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editDepartment(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspDepartment/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteDepartment(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspDepartment/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 设置管理员
 * @param {*} params
 */
export function setAdmin(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsHospital/setAdmin',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addHospitalPrescription(params) {
  console.log(params)
  return request({
    url: '/business/hospital/prescription',
    method: 'post',
    isJSON: true,
    data: params
  })
}
