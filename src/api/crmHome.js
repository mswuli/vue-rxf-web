import requests from '@/utils/requests'
/**
 * 获取促销活动列表
 * @param {*} params
 */
export function getPromotionsList(params) {
  return requests({
    url: '/business/activity/marketing/promotions',
    method: 'get',
    params,
  })
}
// 下拉选择模板

export function selectTemplate(params) {
  return requests({
    url: `/business/activity/template/listAll/${params.templateStatus}/${params.type}`,
    method: 'get',
  })
}
// 预警列表
export function getFindAlertList(params) {
  return requests({
    url: '/business/activity/marketing/findAlertList',
    method: 'get',
    params,
  })
}
// 编辑活动模板
export function editTemplate(params) {
  return requests({
    url: '/business/activity/template',
    method: 'put',
    data: params,
    isJSON: true,
  })
}
// 新增活动/发送短信
export function sendMessage(params) {
  // console.log(params)
  return requests({
    url: '/business/activity/marketing',
    method: 'post',
    isJSON: true,
    data: params
  })
}
// 根据电话号码查询客户标签
export function queryLabel(params) {
  return requests({
    url: "/patientlabeltree/labelTrees",
    method: 'get',
    params,
  })
}
// 自定义模板
export function customTemplate(params) {
  return requests({
    url: '/business/activity/template',
    method: 'post',
    isJSON: true,
    data: params
  })
}
//编辑时选择模板
export function selectTemp(params) {
  return requests({
    url: "/business/activity/smsTemplate/getSmsTemplateList",
    method: 'get',
    params,
  })
}
