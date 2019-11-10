import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/sms/smsRecord/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addRecord(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsRecord',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editRecord(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsRecord/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteRecord(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccountChargingRecord/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
