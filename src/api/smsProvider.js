import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/sms/smsProvider/list',
    method: 'get',
    params
  })
}

/**
 * 获取服务商列表
 * @param {*} params
 */
export function getProviderCodeList(params) {
  return request({
    url: '/business/sms/smsProvider/listAll',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addProvider(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsProvider',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editProvider(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsProvider/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteProvider(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsProvider/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
