import requests from '@/utils/requests'

/**
 * 获取会员管理台账
 * @param {*} params
 */
export function getMemberMannage(params) {
  return requests({
    url: 'business/pharmacy/customer/management/list',
    method: 'get',
    params,
  })
}
// 查看详情
export function detailMemberMannage(params) {
  return requests({
    url: `/business/pharmacy/customer/management/${params.tel}`,
    method: 'get',
  })
}
// 查看电子病历图片版
export function electPicRecord (params) {
  return requests({
    url: `/business/pharmacy/customer/medical/recordsPic/${params.tel}`,
    method: 'get',
  })
}
// 查看电子病历表格版
export function electRecord (params) {
  return requests({
    url: `/business/pharmacy/customer/medical/records/${params.tel}`,
    method: 'get',
  })
}
// 查询客户标签
export function customLabel (params) {
  return requests({
    url: '/business/activity/template/AllCustomerClient',
    method: 'get',
    params,
  })
}
// 新增会员管理

export function addCustomer(params) {
  return requests({
    url: '/business/pharmacy/customer/management/addCustomDetailInfo',
    method: 'post',
    isJSON: true,
    data: params
  })
}
