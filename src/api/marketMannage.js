import requests from '@/utils/requests'
/**
 * 获取活动列表
 * @param {*} params
 */
export function getMarketList(params) {
  return requests({
    url: '/business/activity/marketing/list',
    method: 'get',
    params,
  })
}
// 查看活动列表详情
export function getDetailList(params) {
  return requests({
    url: `/business/activity/marketing/${params.id}`,
    method: 'get',
    // params,
  })
}
// 删除活动列表
export function deleteList(params) {
  return requests({
    url: `/business/activity/marketing/${params.id}`,
    method: 'DELETE',
    // isJSON: true
  })
}
// 获取模板详情
export function getDetailTemplate(params) {
  return requests({
    url: `/business/activity/template/${params.id}`,
    method: 'get',
    // params,
  })
}
//活动名称下拉选择
export function getNameList(params) {
  return requests({
    url: '/business/activity/marketing/findActivitysList',
    method: 'get',
    params,
  })
}
// 删除活动模板
export function deleteTemplate(params) {
  // console.log(params)
  return requests({
    url: `business/activity/template/${params.id}`,
    method: 'DELETE',
    isJSON: true
  })
}


