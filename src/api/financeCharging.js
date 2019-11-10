import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/finance/financeAccountChargingRecord/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addFinanceCharging(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccountChargingRecord',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editFinanceCharging(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccountChargingRecord/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteFinanceCharging(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccountChargingRecord/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
