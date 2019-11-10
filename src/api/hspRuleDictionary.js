import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/hospital/hspRuleDictionary/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addRuleDictionary(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspRuleDictionary',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editRuleDictionary(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspRuleDictionary/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteRuleDictionary(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspRuleDictionary/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
