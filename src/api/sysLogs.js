import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/admin/sysLog/list',
    method: 'get',
    params
  })
}

/**
 * 获取请求方式
 * @param {*} params
 */
export function getTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/SYS_LOG_METHOD',
    method: 'get',
    params
  })
}
