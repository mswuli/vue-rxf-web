import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/hospital/hspAiPharmacy/list/hospital',
    method: 'get',
    params
  })
}

/**
 * 获取智能规则
 * @param {*} params
 */
export function getTacticList(params) {
  return request({
    url: '/business/hospital/hspAiPharmacy/tactics/' + params.id,
    method: 'get'
  })
}

/**
 * 智能规则设置
 * @param {*} params
 */
export function editTacticList(params, id) {
  console.log(params)
  return request({
    url: '/business/hospital/hspAiPharmacy/tactics/' + id,
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 获取绑定药店
 * @param {*} params
 */
export function getBindList(params) {
  return request({
    url: '/business/hospital/hspAiPharmacy/list/bind/' + params.params.id,
    method: 'get'
  })
}

/**
 * 获取未绑定药店
 * @param {*} params
 */
export function getUnBindList(params) {
  return request({
    url: '/business/hospital/hspAiPharmacy/list/unbind/' + params.params.id,
    method: 'get',
    params
  })
}

/**
 * 绑定药店
 * @param {*} params
 */
export function editBind(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspAiPharmacy/' + params.id + '?hspAiPharmacyIdArrayStr=' + params.hspAiPharmacyIdArrayStr,
    method: 'put'
  })
}

/**
 * 删除医院药店绑定关系
 * @param {*} params
 */
export function deleteBind(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspAiPharmacy/' + JSON.parse(params).hid + '/' + JSON.parse(params).pid,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 智能药店信息
 * @param {*} params
 */
export function getAipharmacyRel(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspAiPharmacy/aipharmacyRel/' + params.hid + '/' + params.pid,
    method: 'get'
  })
}

/**
 * 修改智能药店信息
 * @param {*} params
 */
export function updateAiPharmacyRel(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspAiPharmacyRel/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}
