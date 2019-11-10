import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
export function getList(params) {
  return request({
    url: '/business/finance/financeAccount/list',
    method: 'get',
    params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getRechargeList(params) {
  return request({
    url: '/pharmacy/finance/flow/rechargeList',
    method: 'get',
    params
  })
}

/**
 * 获取医院类型
 * @param {*} params
 */
export function getHospitalTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/HOSPITAL_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取字典类型
 * @param {*} params
 */
export function getDictionaryItem(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/CURRENCY',
    method: 'get',
    params
  })
}

/**
 * 获取银行名称列表
 * @param {*} params
 */
export function getBankNameList(params) {
  return request({
    url: '/business/finance/bankInfo/bankName/listAll',
    method: 'get',
    params
  })
}

/**
 * 获取账户卡类型
 * @param {*} params
 */
export function getCardTypeList(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/FINANCE_ACCOUNT_BANK_CARD_CARD_TYPE',
    method: 'get',
    params
  })
}

/**
 * 获取商户账户类型
 * @param {*} params
 */
export function getBusinessAccountTypes(params) {
  return request({
    url: '/admin/dict/dictionaryItem/listAll/PHARMACY_BUSINESS_ACCOUNT_TYPE',
    method: 'get',
    params
  })
}

/**
 * 添加
 * @param {*} params
 */
export function addFinanceAccount(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccount',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editFinanceAccount(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccount/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 编辑药店
 * @param {*} params
 */
export function submitAuditInfo(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccount/auditInfo/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 提交审核
 * @param {*} params
 */
export function submitAudit(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccount/audit/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteFinanceAccount(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccount/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 充值
 * @param {*} params
 */
export function chargingAccount(params) {
  console.log(params)
  return request({
    url: '/business/finance/financeAccount/' + JSON.parse(params).financeAccountId + '/charging/manager',
    method: 'post',
    isJSON: true,
    data: params
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getFinanceAccountMgtList(params) {
  return request({
    url: '/pharmacy/finance/accountMgt/list',
    method: 'get',
    params
  })
}

/**
 * 编辑
 * @param {*} params
 */
export function editFinanceAccountMgt(params) {
  console.log(params)
  return request({
    url: '/pharmacy/finance/accountMgt/' + JSON.parse(params).id,
    method: 'put',
    isJSON: true,
    data: params
  })
}

/**
 * 删除
 * @param {*} params
 */
export function deleteFinanceAccountMgt(params) {
  console.log(params)
  return request({
    url: '/pharmacy/finance/accountMgt/' + JSON.parse(params).id,
    method: 'DELETE',
    isJSON: true
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getCurrentPharmacy(params) {
  return request({
    url: '/pharmacy/finance/accountMgt/currentPharmacy',
    method: 'get'
  })
}

/**
 * 获取列表
 * @param {*} params
 */
export function getPharmacyHome(params) {
  return request({
    url: '/business/pharmacy/pharmacy/pharmacyHomePageIndex',
    method: 'get'
  })
}

/**
 * 续费
 * @param {*} params
 */
export function renewalFinanceAccount(params) {
  console.log(params)
  return request({
    url: '/pharmacy/finance/accountMgt/renewal/' + JSON.parse(params).id,
    method: 'put'
  })
}

/**
 * 获取开户行支行
 * @param {bank, province, city, queryName} params
 */
export function getSubBank(params) {
  return request({
    url: '/business/finance/bankInfo/subBank/listAll',
    method: 'get',
    params
  })
}
