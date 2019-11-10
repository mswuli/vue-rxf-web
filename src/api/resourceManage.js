import request from '@/utils/request'

/**
 * 获取机构组织列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/resource/all',
    method: 'get',
    params
  })
}

/**
 * 获取机构组织列表
 * @param {*} params
 */
export function getMenuList(params) {
  return request({
    url: '/admin/resource/listAll/menu',
    method: 'get',
    params
  })
}

/**
 * 获取机构组织列表
 * @param {*} params
 */
export function getResourceType(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/RESOURCE_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addRes(params) {
  console.log(params)
  return request({
    url: '/admin/resource',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editRes(params) {
  console.log(params)
  return request({
    url: '/admin/resource/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteRes(params) {
  console.log(params)
  return request({
    url: '/admin/resource/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 初始化权限
 * @param {*} params
 */
export function currentAccount(params) {
  return request({
    url: '/security/currentAccount',
    method: 'put'
  })
}

/**
 * 获取菜单
 * @param {*} params
 */
export function getMenu(params) {
  return request({
    url: `/security/resource/${params.plateId}`,
    method: 'get'
  })
}

