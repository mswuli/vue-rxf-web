import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} params
 */
export function getCurrentAccountAdminPermission() {
  return request({
    url: '/security/currentAccountAdminPermission',
    method: 'get'
  })
}

/**
 * 获取角色列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params
  })
}

/**
 * 获取账号下的角色列表
 * @param {*} params
 */
export function getAccountRoleList(params) {
  return request({
    url: '/admin/role/list/' + params.id,
    method: 'get',
    params
  })
}

/**
 * 获取组织列表
 * @param {*} params
 */
export function getOrganizationList(params) {
  return request({
    url: '/admin/organization/org/all',
    method: 'get',
    params
  })
}

/**
 * 获取角色分类
 * @param {*} params
 */
export function getRoleTypeList(params) {
  return request({
    url: '/admin/role/listRoleType',
    method: 'get',
    params
  })
}

/**
 * 添加角色
 * @param {*} params
 */
export function addRole(params) {
  console.log(params)
  return request({
    url: '/admin/role',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑角色
 * @param {*} params
 */
export function editRole(params) {
  console.log(params)
  return request({
    url: '/admin/role/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除角色
 * @param {*} params
 */
export function deleteRole(params) {
  console.log(params)
  return request({
    url: '/admin/role/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 获取权限列表
 * @param {*} params
 */
export function getPermissionList(params) {
  console.log(params)
  return request({
    url: 'admin/role/permission/' + params.id,
    method: 'get'
  })
}

/**
 * 保存授权功能菜单
 * @param {*} params
 */
export function saveResource(params) {
  return request({
    url: '/admin/role/permission/batch/resource',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 保存授权数据权限
 * @param {*} params
 */
export function saveOrg(params) {
  return request({
    url: '/admin/role/permission/batch/org',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 获取角色分配用户列表
 * @param {*} params
 */
export function getAuthUserList(params) {
  return request({
    url: '/admin/permission/accountAdmin/list/' + params.params.id,
    method: 'get',
    params
  })
}

/**
 * 获取角色分配用户列表
 * @param {*} params
 */
export function getAuthExcludeUserList(params) {
  return request({
    url: '/admin/permission/accountAdmin/list/exclude/' + params.params.id,
    method: 'get',
    params
  })
}

/**
 * 绑定用户
 * @param {*} params
 */
export function bindUser(params) {
  return request({
    url: '/admin/role/permission/bind',
    method: 'put',
    params
  })
}

/**
 * 解绑用户
 * @param {*} params
 */
export function unbindUser(params) {
  return request({
    url: '/admin/role/permission/unbind',
    method: 'DELETE',
    params
  })
}
