import request from '@/utils/request'

/**
 * 获取账号列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/dict/dictionaryType/list',
    method: 'get',
    params
  })
}

/**
 * 获取字典类型
 * @param {*} params
 */
export function getTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/SYS_DICTIONARY_TYPE_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加账号
 * @param {*} params
 */
export function addDictionary(params) {
  console.log(params)
  return request({
    url: '/admin/dict/dictionaryType',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑账号
 * @param {*} params
 */
export function editDictionary(params) {
  console.log(params)
  return request({
    url: '/admin/dict/dictionaryType/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除账号
 * @param {*} params
 */
export function deleteDictionary(params) {
  console.log(params)
  return request({
    url: '/admin/dict/dictionaryType/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 获取字典详情
 * @param {*} params
 */
export function getDictionaryItemList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/' + params,
    method: 'get'
  })
}

/**
 * 添加字典详情
 * @param {*} params
 */
export function addDictionaryItem(params) {
  console.log(params)
  return request({
    url: '/admin/dict/dictionaryItem',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑字典详情
 * @param {*} params
 */
export function editDictionaryItem(params) {
  console.log(params)
  return request({
    url: '/admin/dict/dictionaryItem/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除字典详情
 * @param {*} params
 */
export function deleteDictionaryItem(params) {
  console.log(params)
  return request({
    url: '/admin/dict/dictionaryItem/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
