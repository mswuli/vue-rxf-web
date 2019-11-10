import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/sysFileUploadRecord/list',
    method: 'get',
    params
  })
}

/**
 * 获取请求方式
 * @param {*} params
 */
export function getOperateTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/FILE_OPERATE_TYPE',
    method: 'get',
    params
  })
}
