import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/sms/smsTemplate/list',
    method: 'get',
    params
  })
}

/**
 * 获取模版类型列表
 * @param {*} params
 */
export function getTemplateTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/SMS_TEMPLATE_TEMPLATE_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addTemplate(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsTemplate',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editTemplate(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsTemplate/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteTemplate(params) {
  console.log(params)
  return request({
    url: '/business/sms/smsTemplate/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
