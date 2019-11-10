import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/pharmacy/pharmacyAssistant/list',
    method: 'get',
    params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getManageList(params) {
  return request({
    url: '/business/pharmacy/pharmacyAssistant/manage/list',
    method: 'get',
    params
  })
}

/**
 * 获取状态
 * @param {*} params
 */
export function getPharmacyAssistantStatusList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PHARMACY_ASSISTANT_STATUS',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addPharmacyAssistant(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacyAssistant',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editPharmacyAssistant(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacyAssistant/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 提交审核
 * @param {*} params
 */
export function registAssistant(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacyAssistant/registAssistant/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deletePharmacyAssistant(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacyAssistant/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
