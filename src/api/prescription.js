import request from '@/utils/request'

export function getUnpickPrescriptionList(params) {
  return request({
    url: '/business/prescription/pharmacy/unpick/list',
    method: 'get',
    params
  })
}

/**
 * 获取处方列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/prescription/prescription/list',
    method: 'get',
    params
  })
}

/**
 * 获取支付方式
 * @param {*} params
 */
export function getPayment() {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PRESCRIPTION_PAYMENT_TYPE',
    method: 'get'
  })
}

/**
 * 获取处方详情
 * @param {*} params
 */
export function getPrescriptionDetail(params) {
  return request({
    url: '/business/prescription/prescription/detail/' + params.params.prescriptionId,
    method: 'get'
  })
}

/**
 * 获取处方详情商品
 * @param {*} params
 */
export function getPrescriptionItemList(params) {
  return request({
    url: '/business/prescription/pharmacy/prescriptionItemList?prescriptionId=' + params.params.prescriptionId,
    method: 'get'
  })
}

/**
 * 获取处方详情
 * @param {*} params
 */
export function getPrescriptionShDetail(params) {
  return request({
    url: '/business/prescription/prescriptionVerify/' + params.params.prescriptionPickPharmid,
    method: 'get'
  })
}

/**
 * 提取
 * @param {*} params
 */
export function pickByCode(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/pick/' + params.params.code,
    method: 'post'
  })
}
/**
 * 系统预支付
 * @param {*} params
 */
// export function prescriptionSystemDeduction(params) {
//   console.log(params,6)
//   return request({
//     url: '/business/prescription/pharmacy/systemDeduction/' + params.params.id,
//     method: 'post',
//     isJSON: true,
//     data: JSON.stringify(params.params.pay)
//   })
// }
/**
 * 系统预支付
 * @param {*} params
 */
export function prescriptionSystemDeduction(params) {
  // console.log(params,6)
  return request({
    url: '/business/prescription/pharmacy/systemDeduction/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: JSON.stringify(params.params.pay)
  })
}

/**
 * 支付
 * @param {*} params
 */
export function prescriptionPay(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/pay/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: JSON.stringify(params.params.pay)
  })
}

/**
 * 支付失败
 * @param {*} params
 */
export function prescriptionPayReject(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/payReject/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: JSON.stringify(params.params.pay)
  })
}

/**
 * 审方通过
 * @param {*} params
 */
export function prescriptionDosage(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/dosage/' + params.params.licensed + '/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: JSON.stringify(params.params.list)
  })
}

/**
 * 审方拒绝
 * @param {*} params
 */
export function prescriptionDosageReject(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/dosageReject/' + params.params.licensed + '/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: params.params.msg
  })
}

/**
 * 配药
 * @param {*} params
 */
export function prescriptionDeliver(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/deliver/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: JSON.stringify(params.params.pay)
  })
}

/**
 * @deprecated
 * 完成
 * @param {*} params
 */
export function prescriptionFinish(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/finish/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: JSON.stringify(params.params.pay)
  })
}

/**
 * @deprecated
 * 完成拒绝
 * @param {*} params
 */
export function prescriptionFinishReject(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/finishReject/' + params.params.id,
    method: 'post',
    isJSON: true,
    data: params.params.msg
  })
}

/**
 * 支付
 * @param {*} params
 */
export function tradePay(params) {
  console.log(params)
  return request({
    url: `/business/pay/saasPay/tradePay/${params.prescriptionOrderId}?authCode=${params.authCode}`,
    method: 'post',
    isJSON: true
  })
}

/**
 * 退款
 * @param {*} params
 */
export function prescriptionRefund(params) {
  return request({
    url: '/business/prescription/pharmacy/refund/' + params.pickPharm,
    method: 'post'
  })
}

/**
 * 获取退款详情
 * @param {*} params
 */
export function getPrescriptionRefundDetail(params) {
  return request({
    url: '/business/prescription/prescription/orderDetail/' + params.id,
    method: 'get'
  })
}

/**
 * 获取药店处方列表
 * @param {*} params
 */
export function getPharmacyPrescriptionList(params) {
  return request({
    url: '/business/prescription/pharmacy/list',
    method: 'get',
    params
  })
}

/**
 * 获取药店处方药品
 * @param {*} params
 */
export function getPharmacyPrescriptionItems(params) {
  return request({
    url: '/business/prescription/pharmacy/prescriptionItemList?prescriptionId=' + params.params.prescriptionId,
    method: 'get'
  })
}

/**
 * 药品名称查询
 * @param {*} params
 */
export function drugName(params) {
  return request({
    url: '/business/item/itemSkuInfo/bsSuggest?itemName=' + params.drugNameSearch,
    method: 'get'
  })
}

/**
 * 获取已审处方列表
 * @param {*} params
 */
export function getPassList(params) {
  return request({
    url: '/business/prescription/prescription/verify/list',
    method: 'get',
    params
  })
}
// 医保结算接口
export function medicalAccount(params) {
  console.log(params)
  return request({
    url: '/business/prescription/pharmacy/medicalPay',
    method: 'put',
    isJSON: true,
    data: params
  })
}
