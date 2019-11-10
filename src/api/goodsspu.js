import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/item/itemSpuInfo/list',
    method: 'get',
    params
  })
}

/**
 * 获取状态列表
 * @param {*} params
 */
export function getStatusList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/ITEM_SKU_INFO_STATUS',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addGoodsSpu(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSpuInfo',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editGoodsSpu(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSpuInfo/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteGoodsSpu(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSpuInfo/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
