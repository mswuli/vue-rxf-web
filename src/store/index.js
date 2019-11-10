import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import organization from './modules/organization'
import resource from './modules/resource'
import role from './modules/role'
import account from './modules/account'
import dictionary from './modules/dictionary'
import sysFileUploadRecord from './modules/sysFileUploadRecord'
import sysLogs from './modules/sysLogs'
import goods from './modules/goods'
import goodsSpu from './modules/goodsspu'
import goodsSku from './modules/goodssku'
import pharmacy from './modules/pharmacy'
import pharmacyGoods from './modules/pharmacyGoods'
import clerkManage from './modules/clerkManage'
import hospital from './modules/hospital'
import prescription from './modules/prescription'
import hspRuleDictionary from './modules/hspRuleDictionary'
import diagnosticFee from './modules/diagnosticfee'
import commissionFee from './modules/commissionfee'
import financeAccount from './modules/financeAccount'
import financeCharging from './modules/financeCharging'
import financeIncome from './modules/financeIncome'
import financeTradingFlow from './modules/financeTradingFlow'
import doctor from './modules/doctor'
import tactic from './modules/tactic'
import template from './modules/template'
import systemTemplate from './modules/systemTemplate'
import settingService from './modules/settingService'
import smsProvider from './modules/smsProvider'
import smsTemplate from './modules/smsTemplate'
import smsRecord from './modules/smsRecord'
import common from './modules/common'
import cash from './modules/cash'
import hspSkuRel from './modules/hospitalVariety'
import hspAiPharmacy from './modules/smartPharmacy'
import resourceManage from './modules/resourceManage'
import reception from './modules/reception'
import getters from './getters'
import promotionCashCouponRecord from './modules/promotionCashCouponRecord'
import appealRefund from './modules/pharmacy/appealRefund'
import marketMannage from './modules/marketMannage'
import memberMannage from './modules/memberMannage'
import memberSales from './modules/memberSales'
import crmHome from './modules/crmHome'
import templateInfo from './modules/templateInfo'
import markingInfo from './modules/markingInfo'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    organization,
    resource,
    role,
    account,
    dictionary,
    sysFileUploadRecord,
    sysLogs,
    goods,
    goodsSpu,
    goodsSku,
    pharmacy,
    pharmacyGoods,
    clerkManage,
    hospital,
    prescription,
    hspRuleDictionary,
    diagnosticFee,
    financeAccount,
    financeCharging,
    financeIncome,
    financeTradingFlow,
    doctor,
    tactic,
    template,
    systemTemplate,
    settingService,
    smsProvider,
    smsTemplate,
    smsRecord,
    common,
    cash,
    hspSkuRel,
    hspAiPharmacy,
    resourceManage,
    promotionCashCouponRecord,
    reception,
    commissionFee,
    appealRefund,
    marketMannage,
    memberMannage,
    memberSales,
    crmHome,
    templateInfo,
    markingInfo
  },
  getters
})

export default store
