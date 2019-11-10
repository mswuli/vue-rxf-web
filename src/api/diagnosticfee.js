import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/hospital/hspDiagnosticFee/list',
    method: 'get',
    params
  })
}

/**
 * 获取医院诊查费用
 * @param {*} params
 */
export function getDiagnosticList(params) {
  return request({
    url: '/business/statistic/diagnostic/list',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addItem(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspDiagnosticFee',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editItem(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspDiagnosticFee/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteItem(params) {
  console.log(params)
  return request({
    url: '/business/hospital/hspDiagnosticFee/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
