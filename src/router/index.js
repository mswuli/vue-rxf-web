import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/hospital/login',
    component: () => import('@/views/login/indexhospital'),
    hidden: true
  },
  {
    path: '/pharmacy/login',
    component: () => import('@/views/login/indexpharmacy'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/hospitalHelpdesk',
    component: () => import('@/views/hospitalHelpdesk/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard')
    }]
  },

  {
    path: '/system',
    component: Layout,
    // redirect: '/system/organization',
    name: 'System',
    meta: {
      title: '系统',
      icon: 'system'
    },
    children: [{
      path: 'mechanism',
      name: 'OrganizationMechanism',
      component: () => import('@/views/system/organization/mechanism'),
      meta: {
        title: '机构管理'
      }
    },
    {
      path: 'resource',
      name: 'OrganizationResource',
      component: () => import('@/views/system/organization/resource'),
      meta: {
        title: '机构资源池'
      }
    },
    {
      path: 'role',
      name: 'PermissionRole',
      component: () => import('@/views/system/permission/role'),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: 'account',
      name: 'PermissionAccount',
      component: () => import('@/views/system/permission/account'),
      meta: {
        title: '账号管理'
      }
    },
    {
      path: 'resourceManage',
      name: 'ResourceManage',
      component: () => import('@/views/system/resourceManage'),
      meta: {
        title: '资源管理'
      }
    },
    {
      path: 'dictionary',
      name: 'Dictionary',
      component: () => import('@/views/system/dictionary'),
      meta: {
        title: '数据字典'
      }
    },
    {
      path: 'bindRecord',
      name: 'DictionaryBindRecord',
      component: () => import('@/views/system/bindRecord'),
      meta: {
        title: '批量绑定操作记录'
      }
    },
    {
      path: 'systemTemplate',
      name: 'SetterSystemTemplate',
      component: () => import('@/views/setter/systemTemplate'),
      meta: {
        title: '系统角色模板设置'
      }
    },
    {
      path: 'logs',
      name: 'MonitorLogs',
      component: () => import('@/views/monitor/logs'),
      meta: {
        title: '访问日志'
      }
    },
    {
      path: 'clerkManage',
      name: 'clerkManage',
      component: () => import('@/views/pharmacy/manage/clerkManage'),
      meta: {
        title: '药店店员管理'
      }
    }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    // redirect: '/monitor/logs',
    name: 'Monitor',
    meta: {
      title: '监控',
      icon: 'monitor'
    },
    alwaysShow: true,
    children: [{
      path: 'logs',
      name: 'MonitorLogs',
      component: () => import('@/views/monitor/logs'),
      meta: {
        title: '访问日志'
      }
    }]
  },
  {
    path: '/statistic',
    component: Layout,
    // redirect: '/statistic/hspDiagnosticFee',
    name: 'Statistic',
    meta: {
      title: '统计查询',
      icon: 'monitor'
    },
    alwaysShow: true,
    children: [{
      path: 'hspDiagnosticFee',
      name: 'HspDiagnosticFee',
      component: () => import('@/views/statistic/hspDiagnosticFee'),
      meta: {
        title: '医院诊查费用'
      }
    }, {
      path: 'pharmacyDiagnosticFee',
      name: 'pharmacyDiagnosticFee',
      component: () => import('@/views/statistic/pharmacyDiagnosticFee'),
      meta: {
        title: '诊查费用明细'
      }
    },
    {
      path: 'commission',
      name: 'CommissionManage',
      component: () => import('@/views/statistic/commission'),
      meta: {
        title: '佣金费用明细'
      }
    },
    {
      path: 'sms',
      name: 'SmsManage',
      component: () => import('@/views/finance/sms'),
      meta: {
        title: '短信扣费明细'
      }
    }
      // {
      //   path: 'commissionRefund',
      //   name: 'CommissionRefund',
      //   component: () => import('@/views/statistic/commissionRefund'),
      //   meta: {
      //     title: '佣金申诉退款'
      //   }
      // }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    // redirect: '/goods/list',
    name: 'Goods',
    meta: {
      title: '药品',
      icon: 'goods'
    },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'GoodsList',
      component: () => import('@/views/goods/list'),
      meta: {
        title: '药品基础信息管理'
      }
    },
    {
      path: 'spu',
      name: 'GoodsSpu',
      component: () => import('@/views/goods/spu'),
      meta: {
        title: '药品SPU信息管理'
      }
    },
    {
      path: 'sku',
      name: 'GoodsSku',
      component: () => import('@/views/goods/sku'),
      meta: {
        title: '药品SKU信息管理'
      }
    },
    {
      path: 'itemTinyUnitConversion',
      name: 'ItemTinyUnitConversion',
      component: () => import('@/views/goods/itemTinyUnitConversion'),
      meta: {
        title: '药品拆零单位换算'
      }
    }
    ]
  },
  {
    path: '/pharmacy',
    component: Layout,
    // redirect: '/pharmacy/list',
    name: 'Pharmacy',
    meta: {
      title: '药店',
      icon: 'pharmacy'
    },
    children: [{
      path: 'list',
      name: 'PharmacyList',
      component: () => import('@/views/pharmacy/manage/list'),
      meta: {
        title: '药店管理'
      }
    },
    {
      path: 'goods',
      name: 'PharmacyGoods',
      component: () => import('@/views/pharmacy/manage/goods'),
      meta: {
        title: '药店药品管理'
      }
    },
    {
      path: 'service',
      name: 'PharmacyService',
      component: () => import('@/views/pharmacy/manage/service'),
      meta: {
        title: '药店服务管理'
      }
    },
    {
      path: 'home',
      name: 'PharmacyHome',
      component: () => import('@/views/pharmacy/manage/home'),
      meta: {
        title: '药店首页'
      }
    },
    {
      path: 'items',
      name: 'PharmacyItem',
      component: () => import('@/views/pharmacy/manage/items'),
      meta: {
        title: '药店商品列表'
      }
    },
    {
      path: 'account',
      name: 'AccountManage',
      component: () => import('@/views/finance/account'),
      meta: {
        title: '账户管理'
      }
    },
    {
      path: 'clerkReview',
      name: 'clerkReview',
      component: () => import('@/views/pharmacy/manage/clerkReview'),
      meta: {
        title: '药店店员审核'
      }
    },
    {
      path: 'checkrefund',
      name: 'checkRefund',
      component: () => import('@/views/pharmacy/manage/checkrefund'),
      meta: {
        title: '药店申诉审核'
      }
    }
    ]
  },
  {
    path: '/hospital',
    component: Layout,
    // redirect: '/hospital/manage/list',
    name: 'Hospital',
    meta: {
      title: '医院',
      icon: 'hospital'
    },
    children: [{
      path: 'list',
      name: 'HospitalList',
      component: () => import('@/views/hospital/manage/list'),
      meta: {
        title: '医院管理'
      }
    },
    {
      path: 'hospitalVariety',
      name: 'HospitalVariety',
      component: () => import('@/views/hospital/manage/hospitalVariety'),
      meta: {
        title: '医院品种维护'
      }
    },
    {
      path: 'manage/smartPharmacy',
      name: 'SmartPharmacy',
      component: () => import('@/views/hospital/manage/smartPharmacy'),
      meta: {
        title: '智能药店'
      }
    },
    {
      path: 'manage/hspDiagnosticFee',
      name: 'HspDiagnosticFee',
      component: () => import('@/views/hospital/manage/diagnosticfee'),
      meta: {
        title: '医生诊查费'
      }
    },
    {
      path: 'doctor',
      name: 'DoctorManage',
      component: () => import('@/views/doctor/manage'),
      meta: {
        title: '医生管理'
      }
    }
    ]
  },
  {
    path: '/prescription',
    component: Layout,
    // redirect: '/prescription/manage',
    name: 'Prescription',
    meta: {
      title: '处方',
      icon: 'prescription'
    },
    alwaysShow: true,
    children: [
      {
        path: 'prescription',
        name: 'Prescription',
        component: () => import('@/views/hospital/manage/prescription'),
        meta: {
          title: '开方'
        }
      },
      {
        path: 'prescriptionPass',
        name: 'prescriptionPass',
        component: () => import('@/views/prescription/manage/prescriptionPass'),
        meta: {
          title: '已审处方'
        }
      },
      {
        path: 'manage',
        name: 'PrescriptionManage',
        component: () => import('@/views/prescription/manage'),
        meta: {
          title: '处方管理'
        }
      },
      {
        path: 'pharmacyPrescription',
        name: 'PharmacyPrescription',
        component: () => import('@/views/prescription/manage/pharmacyPrescription'),
        meta: {
          title: '处方管理'
        }
      },
      {
        path: 'pharmacyPrescriptionHistory',
        name: 'PharmacyPrescriptionHistory',
        component: () => import('@/views/prescription/manage/pharmacyPrescriptionHistory'),
        meta: {
          title: '历史处方'
        }
      },
      {
        path: 'pharmacyPrescriptionDosage',
        name: 'PharmacyPrescriptionPicked',
        component: () => import('@/views/prescription/manage/pharmacyPrescriptionDosage'),
        meta: {
          title: '待核对/调配列表'
        }
      },
      {
        path: 'pharmacyPrescriptionPay',
        name: 'pharmacyPrescriptionPay',
        component: () => import('@/views/prescription/manage/pharmacyPrescriptionPay'),
        meta: {
          title: '待核对/收银列表'
        }
      },
      {
        path: 'pharmacyPrescriptionDeliver',
        name: 'PharmacyPrescriptionDosage',
        component: () => import('@/views/prescription/manage/pharmacyPrescriptionDeliver'),
        meta: {
          title: '待核对/发药列表'
        }
      },
      {
        path: 'hspRuleDictionary',
        name: 'HspRuleDictionary',
        component: () => import('@/views/prescription/manage/hspRuleDictionary'),
        meta: {
          title: '处方智慧引擎'
        }
      },
      {
        path: 'pick',
        name: 'pick',
        component: () => import('@/views/prescription/manage/pick'),
        meta: {
          title: '处方提取'
        }
      }
    ]
  },
  {
    path: '/pharmacyprescription',
    component: Layout,
    // redirect: '/pharmacyprescription/manage',
    name: 'Prescription',
    meta: {
      title: '处方管理',
      icon: 'prescription'
    },
    alwaysShow: true,
    children: [{
      path: 'prescription',
      name: 'Prescription',
      component: () => import('@/views/hospital/manage/prescription'),
      meta: {
        title: '开处方'
      }
    },
    {
      path: 'manage',
      name: 'PrescriptionManage',
      component: () => import('@/views/prescription/manage'),
      meta: {
        title: '处方管理'
      }
    },
    {
      path: 'pharmacyPrescription',
      name: 'PharmacyPrescription',
      component: () => import('@/views/prescription/manage/pharmacyPrescription'),
      meta: {
        title: '处方管理'
      }
    },
    {
      path: 'pharmacyPrescriptionHistory',
      name: 'PharmacyPrescriptionHistory',
      component: () => import('@/views/prescription/manage/pharmacyPrescriptionHistory'),
      meta: {
        title: '历史处方'
      }
    },
    {
      path: 'pharmacyPrescriptionDosage',
      name: 'pharmacyPrescriptionDosage',
      component: () => import('@/views/prescription/manage/pharmacyPrescriptionDosage'),
      meta: {
        title: '待核对/审核列表'
      }
    },
    {
      path: 'pharmacyPrescriptionPay',
      name: 'pharmacyPrescriptionPay',
      component: () => import('@/views/prescription/manage/pharmacyPrescriptionPay'),
      meta: {
        title: '收银'
      }
    },
    {
      path: 'pharmacyPrescriptionDeliver',
      name: 'pharmacyPrescriptionDeliver',
      component: () => import('@/views/prescription/manage/pharmacyPrescriptionDeliver'),
      meta: {
        title: '待核对/配药列表'
      }
    },
    {
      path: 'hspRuleDictionary',
      name: 'HspRuleDictionary',
      component: () => import('@/views/prescription/manage/hspRuleDictionary'),
      meta: {
        title: '处方智慧引擎'
      }
    },
    {
      path: 'pick',
      name: 'pick',
      component: () => import('@/views/prescription/manage/pick'),
      meta: {
        title: '处方提取'
      }
    },
    {
      path: 'pharmacyPrescriptionRefund',
      name: 'pharmacyPrescriptionRefund',
      component: () => import('@/views/prescription/manage/pharmacyPrescriptionRefund'),
      meta: {
        title: '退款'
      }
    }
    ]
  },
  {
    path: '/pharmacyhome',
    component: Layout,
    // redirect: '/pharmacyhome',
    name: 'Prescription',
    meta: {
      title: '药店首页管理',
      icon: 'prescription'
    },
    children: [{
      path: '',
      name: 'PharmacyHome',
      component: () => import('@/views/pharmacy/manage/home'),
      meta: {
        title: '药店首页'
      }
    }]
  },
  {
    path: '/pharmacyaccountmanagement',
    component: Layout,
    // redirect: '/pharmacyaccountmanagement',
    name: 'pharmacyaccountmanagement',
    meta: {
      title: ' 位置管理',
      icon: 'prescription'
    },
    children: [{
      path: '',
      name: 'AccountmanagementManage',
      component: () => import('@/views/finance/accountmanagement'),
      meta: {
        title: ''
      }
    }]
  },
  {
    path: '/pharmacyitems',
    component: Layout,
    // redirect: '/pharmacyitems',
    name: 'pharmacyaccountmanagement',
    meta: {
      title: '处方商品管理',
      icon: 'prescription'
    },
    children: [{
      path: '',
      name: 'PharmacyItem',
      component: () => import('@/views/pharmacy/manage/items'),
      meta: {
        title: '处方商品管理'
      }
    }]
  },
  {
    path: '/pharmacygoods',
    component: Layout,
    // redirect: '/pharmacygoods',
    name: 'pharmacygoods',
    meta: {
      title: '药品管理',
      icon: 'prescription'
    },
    children: [{
      path: '',
      name: 'PharmacyGoods',
      component: () => import('@/views/prescription/manage/goods'),
      meta: {
        title: ''
      }
    }]
  },
  {
    path: '/finance',
    component: Layout,
    // redirect: '/finance/account',
    name: 'Finance',
    meta: {
      title: '财务',
      icon: 'finance'
    },
    alwaysShow: true,
    children: [{
      path: 'account',
      name: 'AccountManage',
      component: () => import('@/views/finance/account'),
      meta: {
        title: '账户管理'
      }
    },
    {
      path: 'charging',
      name: 'ChargingManage',
      component: () => import('@/views/finance/charging'),
      meta: {
        title: '账户充值管理'
      }
    },
    {
      path: 'tradingFlow',
      name: 'TradingFlowsManage',
      component: () => import('@/views/finance/tradingflow'),
      meta: {
        title: '消费记录'
      }
    },
    {
      path: 'income',
      name: 'IncomeManage',
      component: () => import('@/views/finance/income'),
      meta: {
        title: '收入列表'
      }
    },
    {
      path: 'service',
      name: 'ServiceManage',
      component: () => import('@/views/finance/service'),
      meta: {
        title: '服务费明细'
      }
    },

    {
      path: 'accountrecharge',
      name: 'AccountrechargeManage',
      component: () => import('@/views/finance/accountrecharge'),
      meta: {
        title: '账户充值'
      }
    },
    {
      path: 'accountservicerenewal',
      name: 'AccountservicerenewalManage',
      component: () => import('@/views/finance/accountservicerenewal'),
      meta: {
        title: '服务费续费'
      }
    }
    ]
  },
  {
    path: '/pharmacyfinance',
    component: Layout,
    // redirect: '/pharmacyfinance/account',
    name: 'Finance',
    meta: {
      title: '费用管理',
      icon: 'finance'
    },
    alwaysShow: true,
    children: [{
      path: 'account',
      name: 'AccountManage',
      component: () => import('@/views/finance/account'),
      meta: {
        title: '账户管理'
      }
    },
    {
      path: 'commissionRefund',
      name: 'CommissionRefund',
      component: () => import('@/views/finance/commissionRefund'),
      meta: {
        title: '佣金申诉退款'
      }
    },
    {
      path: 'charging',
      name: 'ChargingManage',
      component: () => import('@/views/finance/charging'),
      meta: {
        title: '账户充值'
      }
    },
    {
      path: 'tradingFlow',
      name: 'TradingFlowsManage',
      component: () => import('@/views/finance/tradingflow'),
      meta: {
        title: '消费记录'
      }
    },
    {
      path: 'income',
      name: 'IncomeManage',
      component: () => import('@/views/finance/income'),
      meta: {
        title: '销售对账明细'
      }
    },
    {
      path: 'service',
      name: 'ServiceManage',
      component: () => import('@/views/finance/service'),
      meta: {
        title: '服务费明细'
      }
    },
    {
      path: 'commission',
      name: 'CommissionManage',
      component: () => import('@/views/finance/commission'),
      meta: {
        title: '处方服务明细'
      }
    },
    {
      path: 'sms',
      name: 'SmsManage',
      component: () => import('@/views/finance/sms'),
      meta: {
        title: '短信扣费明细'
      }
    },
    {
      path: 'accountmanagement',
      name: 'AccountmanagementManage',
      component: () => import('@/views/finance/accountmanagement'),
      meta: {
        title: '账户管理'
      }
    },
    {
      path: 'accountrecharge',
      name: 'AccountrechargeManage',
      component: () => import('@/views/finance/accountrecharge'),
      meta: {
        title: '账户充值'
      }
    },
    {
      path: 'accountservicerenewal',
      name: 'AccountservicerenewalManage',
      component: () => import('@/views/finance/accountservicerenewal'),
      meta: {
        title: '服务费续费'
      }
    }
    ]
  },
  {
    path: '/sale',
    component: Layout,
    // redirect: '/sale/manage',
    name: 'Sale',
    meta: {
      title: '促销',
      icon: 'sale'
    },
    alwaysShow: true,
    children: [{
      path: 'manage',
      name: 'index',
      component: () => import('@/views/sale/manage'),
      meta: {
        title: '现金券'
      }
    },
    {
      path: 'promotionCashCouponRecord',
      name: 'promotionCashCouponRecord',
      component: () => import('@/views/sale/manage/promotionCashCouponRecord'),
      meta: {
        title: '现金券使用记录'
      }
    }
    ]
  },
  {
    path: '/doctor',
    component: Layout,
    // redirect: '/doctor/manage',
    name: 'Doctor',
    meta: {
      title: '医生',
      icon: 'doctor'
    },
    alwaysShow: true,
    children: [{
      path: 'manage',
      name: 'DoctorManage',
      component: () => import('@/views/doctor/manage'),
      meta: {
        title: '医生管理'
      }
    }]
  },
  {
    path: '/setter',
    component: Layout,
    // redirect: '/setter/template',
    name: 'Tactics',
    meta: {
      title: '综合设置',
      icon: 'setter'
    },
    alwaysShow: true,
    children: [{
      path: 'template',
      name: 'SetterTemplate',
      component: () => import('@/views/setter/template'),
      meta: {
        title: '处方模板管理'
      }
    },
    {
      path: 'service',
      name: 'SetterService',
      component: () => import('@/views/setter/service'),
      meta: {
        title: '费用设置'
      }
    }
    ]
  },
  {
    path: '/decision',
    component: Layout,
    // redirect: '/decision/tactics',
    name: 'Tactics',
    meta: {
      title: '决策',
      icon: 'setter'
    },
    alwaysShow: true,
    children: [{
      path: 'tactics',
      name: 'SetterTactics',
      component: () => import('@/views/setter/tactics'),
      meta: {
        title: '策略设置'
      }
    },
    {
      path: 'manage/smartPharmacy',
      name: 'SmartPharmacy',
      component: () => import('@/views/hospital/manage/smartPharmacy'),
      meta: {
        title: '智能决策'
      }
    }
    ]
  },
  {
    path: '/sms',
    component: Layout,
    // redirect: '/sms/provider',
    name: 'Sms',
    meta: {
      title: '短信',
      icon: 'sms'
    },
    alwaysShow: true,
    children: [{
      path: 'provider',
      name: 'Provider',
      component: () => import('@/views/sms/provider'),
      meta: {
        title: '短信服务商'
      }
    },
    {
      path: 'template',
      name: 'Template',
      component: () => import('@/views/sms/template'),
      meta: {
        title: '短信模板'
      }
    },
    {
      path: 'record',
      name: 'Record',
      component: () => import('@/views/sms/record'),
      meta: {
        title: '短信记录'
      }
    }
    ]
  },
  {
    path: '/memberMannage',
    component: Layout,
    name: 'memberMannage',
    meta: {
      title: '会员管理',
      icon: 'pharmacy'
    },
    children: [{
      path: '',
      name: 'member',
      component: () => import('@/views/member/memberMannage'),
      meta: {
        title: ''
      }
    }]
  },
  {
    path: '/memberSales',
    component: Layout,
    name: 'memberSales',
    meta: {
      title: '会员消费',
      icon: 'pharmacy'
    },
    children: [{
      path: '',
      name: 'member',
      component: () => import('@/views/member/memberSales'),
      meta: {
        title: ''
      }
    }]
  },
  {
    path: '/marketMannage',
    component: Layout,
    name: 'marketMannage',
    meta: {
      title: '营销管理',
      icon: 'pharmacy'
    },
    children: [{
      path: '',
      name: 'member',
      component: () => import('@/views/member/marketMannage'),
      meta: {
        title: ''
      }
    }]
  },
  {
    path: '/crmHome',
    component: Layout,
    name: 'crmHome',
    meta: {
      title: 'CRM首页',
      icon: 'pharmacy'
    },
    children: [{
      path: '',
      name: 'CRM',
      component: () => import('@/views/CRM/crmHome'),
      meta: {
        title: ''
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
