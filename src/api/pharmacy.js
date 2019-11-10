import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/pharmacy/pharmacy/list',
    method: 'get',
    params
  })
}

/**
 * 获取药店类型
 * @param {*} params
 */
export function getPharmacyTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PHARMACY_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取审核状态
 * @param {*} params
 */
export function getPharmacyStatusList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PHARMACY_VERIFY_STATUS',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addPharmacy(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacy',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editPharmacy(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacy/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deletePharmacy(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacy/' + JSON.parse(params).id,
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
    url: '/business/pharmacy/pharmacyAssistant/setAdmin',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 获取执业药师
 * @param {*} params
 */
export function listCurrentLicensed(params) {
  return request({
    url: '/business/pharmacy/pharmacyAssistant/licensed/list',
    method: 'get',
    isJSON: true,
    data: params
  })
}

export function getPharmacyTitleList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PHARMACY_TITLE',
    method: 'get',
    params
  })
}

/**
 * 获取药店服务
 * @param {*} params
 */
export function getPharmacyServices(params) {
  return request({
    url: '/business/pharmacy/pharmacyServiceManage/service/listAll/' + params.params.id,
    method: 'get',
    params
  })
}

/**
 * 获取药店服务详情
 * @param {*} params
 */
export function getServiceDetail(params) {
  return request({
    url: '/business/pharmacy/pharmacyServiceDetail/list',
    method: 'get',
    params
  })
}

/**
 * 获取药店服务详情
 * @param {*} params
 */
export function getServiceCdt(params) {
  return request({
    url: '/admin/additionalsettings/serviceManageDetail/listServiceCdt',
    method: 'get',
    params
  })
}

/**
 * 提交药店续费服务
 * @param {*} params
 */
export function postServiceCdt(params) {
  return request({
    url: '/business/pharmacy/pharmacyServiceManage',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 提交药店告警
 * @param {*} params
 */
export function getNotification(params) {
  return request({
    url: '/business/pharmacy/pharmacy/notification?pharmacyId='+ params.pharmacyId,
    method: 'get',
  })
}

/**
 * 药房交接
 * @param {*} params
 */
export function  postHandover(params) {
  return request({
    url: '/business/pharmacy/handover',
    method: 'post',
    data:params
  })
}
// **
// * 药房交接列表展示
// * @param {*} params
// */
export function  getHandoverList(params) {
  return request({
    url: '/business/pharmacy/handover/listAll' ,
    method: 'get',
    params
  })
}
// **
// * 佣金申诉退款记录
// * @param {*} params
// */
export function  appealRefund(params) {
  return request({
    url: '/business/pharmacy/appealRefund',
    method: 'post',
    isJSON: true,
    data:params.params
  })
}
// **
// * 佣金申诉退款原因
// * @param {*} params
// *
export function getRefund() {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/REFUND_REASON',
    method: 'get'
  })
}
// **
// * 佣金申诉记录查询
// * @param {*} params
// *
export function getRefundQuery(params) {
  return request({
    url: '/business/pharmacy/appealRefund/listPage',
    method: 'get',
    params
  })
}
