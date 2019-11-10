import requests from '@/utils/requests'

/**
 * 获取消费记录列表
 * @param {*} params
 */
export function getSaleList (params) {
  return requests({
    url: '/business/consumption/customer/management/list',
    method: 'get',
    params,
  })
}
// 新增消费记录
export function addSales(params) {
  return requests({
    url: '/business/consumption/customer/management/addConsumption',
    method: 'post',
    isJSON: true,
    data: params
  })
}
// 编辑消费记录
export function editSales(params) {
  return requests({
    url: '/business/consumption/customer/management/updateConsumption',
    method: 'put',
    isJSON: true,
    data: params
  })
}
