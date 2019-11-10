import request from '@/utils/request'

/**
 * 获取机构组织列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/organization/org/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 * @param {*} params
 */
export function getOrgInfo(params) {
  return request({
    url: '/admin/organization/orgInfo/org/' + params.code,
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addOrganization(params) {
  console.log(params)
  return request({
    url: '/admin/organization/org',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editOrganization(params) {
  console.log(params)
  return request({
    url: '/admin/organization/org/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteOrganization(params) {
  console.log(params)
  return request({
    url: '/admin/organization/org/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
