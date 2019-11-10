import request from '@/utils/request'

/**
 * 添加药店药品信息
 * @param {*} params
 */
export function addPharmacyGoods(params) {
  console.log(params)
  return request({
    url: '/business/pharmacy/pharmacyItemInfo/itemStore',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/pharmacy/pharmacyItemInfo/list',
    method: 'get',
    params
  })
}

/**
 * 获取药店首页信息
 * @param {*} params
 */
export function getPharmacyHomeInfo(params) {
  return request({
    url: '/business/pharmacy/pharmacy/pharmacyHomePageIndex',
    method: 'get',
    params
  })
}

/**
 * 获取药店充值二维码
 * @param {*} params
 */
export function getSaasPayQrcode(params) {
  return request({
    url: '/business/pay/saasPay',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 更新拆零库存
 * @param {*} params
 */
export function updPharmacyItemStore(params) {
  return request({
    url: `/business/pharmacy/pharmacyItemStore/updCdt/${JSON.parse(params).skuId}`,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 上下架
 * @param {*} params
 */
export function marketable(params) {
  return request({
    url: `/business/pharmacy/pharmacyItemInfo/batch/${params.id}`,
    method: 'put',
    isJSON: true,
    data: JSON.stringify({
      marketable: params.marketable
    })
  })
}

/**
 * 使用优惠券
 * @param {*} params
 */
export function useCashCoupon(params) {
  return request({
    url: `/business/pharmacy/pharmacy/useCashCoupon/${JSON.parse(params).id}`,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 获取支付结果
 * @param {*} params
 */
export function getPayStatus(params) {
  return request({
    url: `/business/pay/businessTransaction/${params.outTradeNo}`,
    method: 'get'
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deletePharmacyGoods(params) {
  console.log(params)
  return request({
    url: '/business/item/itemSkuInfo/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}
