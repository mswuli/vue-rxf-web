import request from '@/utils/request'

/**
 * 获取账号列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/permission/accountAdmin/list',
    method: 'get',
    params
  })
}

/**
 * 获取平台列表
 * @param {*} params
 */
export function getAccountTypeList(params) {
  return request({
    url: '/admin/permission/accountAdmin/listAccountAdminSource',
    method: 'get',
    params
  })
}

/**
 * 添加账号
 * @param {*} params
 */
export function addAccount(params) {
  console.log(params)
  return request({
    url: '/admin/permission/accountAdmin',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑账号
 * @param {*} params
 */
export function editAccount(params) {
  console.log(params)
  return request({
    url: '/admin/permission/accountAdmin/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除账号
 * @param {*} params
 */
export function deleteAccount(params) {
  console.log(params)
  return request({
    url: '/admin/permission/accountAdmin/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
