import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/pharmacy/finance/incomeList/list',
    method: 'get',
    params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getFinanceServiceList(params) {
  return request({
    url: '/pharmacy/finance/flow/serviceList',
    method: 'get',
    params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getFinanceSmsList(params) {
  return request({
    url: '/business/statistic/sms/list',
    method: 'get',
    params
  })
}

/**
 * 获取交接记录列表
 * @param {*} params
 */
// export function getHandoverList(params) {
//   return request({
//     url: '/business/statistic/sms/list',
//     method: 'get',
//     params
//   })
// }
// **
// * 获取申诉处方详情
// * @param {*} params
// */
export function getPrescriptionCheckDetail(params) {
  return request({
    url:`/business/pharmacy/appealRefund/prescription/order/detail/${params.id}`,
    method: 'get'
  })
}
// 获取佣金审核通过
export function getAppealRefund(params) {
  return request({
    url: `/business/pharmacy/appealRefund/pass/${params.id}`,
    method: 'put',
  })
}
// 获取佣金审核不通过

export function getAppealNoRefund(params) {
  return request({
    url: `/business/pharmacy/appealRefund/nopass/${params.param.appealRefundId}?reason=${params.param.reason}`,
    method: 'put',
  })
}
// 佣金申诉拒绝原因
export function getReject() {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/HAND_SUGGESSION',
    method: 'get'
  })
}
