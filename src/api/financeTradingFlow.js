import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/finance/financeAccountTradingFlow/list',
    method: 'get',
    params
  })
}
