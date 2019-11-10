import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/hospital/hspSkuRel/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addHspSkuRel(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspSkuRel',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editHspSkuRel(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspSkuRel/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteHspSkuRel(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspSkuRel/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
