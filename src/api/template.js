import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/additionalsettings/rsTemplate/list',
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
export function editTemplate(params) {
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
export function deleteTemplate(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTemplate/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
