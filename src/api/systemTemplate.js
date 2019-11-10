import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/additionalsettings/sysRoleTemplate/list',
    method: 'get',
    params
  })
}

/**
 * 获取菜单列表
 * @param {*} params
 */
export function getResourceList(params) {
  return request({
    url: '/admin/additionalsettings/sysRoleTemplate/list/resource/-1',
    method: 'get'
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addSystemTemplate(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/sysRoleTemplate',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editSystemTemplate(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/sysRoleTemplate/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteSystemTemplate(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/sysRoleTemplate/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
