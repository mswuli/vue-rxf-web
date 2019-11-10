import request from '@/utils/request'

/**
 * 获取机构组织列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/organization/orgResourcePool/allOrgResourcePool',
    method: 'get',
    params
  })
}

/**
 * 保存
 * @param {*} params
 */
export function saveResourcePool(params) {
  return request({
    url: '/admin/organization/orgResourcePool/batch',
    method: 'post',
    isJSON: true,
    data: params
  })
}
