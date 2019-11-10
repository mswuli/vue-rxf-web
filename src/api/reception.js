import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} params
 */
export function getList(params) {
  console.log(params)
  return request({
    url: '/business/hospital/reception/prescriptionInfo/1111111111111111111/' + params.code,
    method: 'get',
    params
  })
}
