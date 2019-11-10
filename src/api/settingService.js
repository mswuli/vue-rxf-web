import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/additionalsettings/serviceManage/list',
    method: 'get',
    params
  })
}

/**
 * 获取服务状态
 * @param {*} params
 */
export function getServiceStatus(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/SERVICE_FEE_STATUS',
    method: 'get',
    params
  })
}

/**
 * 获取收费标准
 * @param {*} params
 */
export function getServiceFee(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/SERVICE_FEE_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addService(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTemplate',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editService(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTemplate/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteService(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTemplate/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
