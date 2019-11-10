import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/additionalsettings/rsTactics/list',
    method: 'get',
    params
  })
}

/**
 * 获取状态列表
 * @param {*} params
 */
export function getTacticsStatus(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/TACTICS_STATUS',
    method: 'get',
    params
  })
}

/**
 * 获取策略类型
 * @param {*} params
 */
export function getTacticsType(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/TACTICS_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addTactic(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTactics',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editTactic(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTactics/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteTactic(params) {
  console.log(params)
  return request({
    url: '/admin/additionalsettings/rsTactics/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
