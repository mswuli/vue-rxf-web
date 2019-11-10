import request from '@/utils/request'

/**
 * 佣金申诉退款原因
 * @param {*} params
 */
export function getRefund() {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/REFUND_REASON',
    method: 'get'
  })
}

/**
 * 佣金申诉记录查询
 * @param {*} params
 */
export function getAppealRefundList(params) {
  return request({
    url: '/business/pharmacy/appealRefund/allPage',
    method: 'get',
    params
  })
}

/**
 * 获取申诉药店列表
 * @param params
 */
export function getAppealRefundPharmacyList(params) {
  return request({
    url: '/business/pharmacy/appealRefund/pharmacy/list',
    method: 'get'
  })
}
