import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/hospital/rsDoctor/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addDoctor(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsDoctor',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editDoctor(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsDoctor/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteDoctor(params) {
  console.log(params)
  return request({
    url: '/business/hospital/rsDoctor/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 获取性别列表
 * @param {*} params
 */
export function getSexList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/SEX_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取职称列表
 * @param {*} params
 */
export function getDoctorTitleList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/TITLE_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取教学职称列表
 * @param {*} params
 */
export function getTitleTeachTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/TITLE_TEACH_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取学历列表
 * @param {*} params
 */
export function getEducationBackgroundList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/EDUCATION_BACKGROUND',
    method: 'get',
    params
  })
}
