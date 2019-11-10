import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/item/itemDrugBaseInfo/list',
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
 * 获取产品类别
 * @param {*} params
 */
export function getProductTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/ITEM_DRUG_BASE_INFO_PRODUCT_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addGoods(params) {
  console.log(params)
  return request({
    url: '/business/item/itemDrugBaseInfo',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editGoods(params) {
  console.log(params)
  return request({
    url: '/business/item/itemDrugBaseInfo/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteGoods(params) {
  console.log(params)
  return request({
    url: '/business/item/itemDrugBaseInfo/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
