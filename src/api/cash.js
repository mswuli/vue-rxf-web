import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/promotion/promotionCashCoupon/list',
    method: 'get',
    params
  })
}

/**
 * 获取领取状态
 * @param {*} params
 */
export function getCashStatus(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PROMOTION_CASH_COUPON_STATUS',
    method: 'get',
    params
  })
}

/**
 * 获取使用状态
 * @param {*} params
 */
export function getCashUseStatus(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PROMOTION_CASH_COUPON_USE_STATUS',
    method: 'get',
    params
  })
}

/**
 * 获取类型
 * @param {*} params
 */
export function getCashCouponType(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PROMOTION_CASH_COUPON_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addCash(params) {
  console.log(params)
  return request({
    url: '/business/promotion/promotionCashCoupon',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editCash(params) {
  console.log(params)
  return request({
    url: '/business/promotion/promotionCashCoupon/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteCash(params) {
  console.log(params)
  return request({
    url: '/business/promotion/promotionCashCoupon/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
