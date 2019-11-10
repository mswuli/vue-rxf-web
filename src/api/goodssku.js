import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/item/itemSkuInfo/list',
    method: 'get',
    params
  })
}

/**
 * 获取药品类别
 * @param {*} params
 */
export function getTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/ITEM_DRUG_BASE_INFO_IDENTIFICATION',
    method: 'get',
    params
  })
}

/**
 * 获取处方类型
 * @param {*} params
 */
export function getSkuTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/ITEM_SKU_INFO_CF_PROPERTY',
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
export function addGoodsSku(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSkuInfo',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editGoodsSku(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSkuInfo/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteGoodsSku(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSkuInfo/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getItemTinyRate(params) {
  return request({
    url: '/business/item/itemTinyRate/listAll/' + params.params.id,
    method: 'get'
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getItemTinyRateUnit(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/ITEM_TINY_RATE_UNIT',
    method: 'get'
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addTinyRate(params) {
  console.log(params)
  return request({
    url: '/business/item/itemTinyRate',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editTinyRate(params) {
  console.log(params)
  return request({
    url: '/business/item/itemTinyRate/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteTinyRate(params) {
  console.log(params)
  return request({
    url: '/business/item/itemTinyRate/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
