<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select style="width:120px;" v-model="param.searchCondition.pharmacyId" filterable placeholder="药店">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacys.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 120px;" v-model="param.searchCondition.financeAccountName" class="filter-item" placeholder="入账账户">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.paymentsAccount" class="filter-item" placeholder="付款人">
      </el-input>
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="充值时间"
        end-placeholder="充值时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="filter-item" @click="getFinanceChargingList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeChargings.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column fixed prop="financeAccountName" width="150" label="入账账户"></el-table-column>
      <el-table-column fixed prop="paymentsAccount" width="150" label="付款人"></el-table-column>
      <el-table-column width="152" prop="chargeTime" label="充值时间">
        <template slot-scope="scope">
          {{scope.row.chargeTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="chargeNumber" width="150" label="充值编号"></el-table-column>
      <el-table-column prop="payType" width="150" label="支付类型"></el-table-column>
      <el-table-column prop="memo" width="150" label="说明"></el-table-column>
      <el-table-column prop="amount" width="150" label="充值金额（元）"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeChargings.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { download } from '@/utils/export'

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      daterange: null,

      rules: {
        itemName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getFinanceChargingList()
    this.getPharmacyList()
  },
  computed: mapState({
    financeChargings: state => state.financeCharging.financeChargings,
    pharmacys: state => state.pharmacy.pharmacys
  }),
  methods: {
    getFinanceChargingList() {
      if (this.daterange) {
        this.param.searchCondition['chargeTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['chargeTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getFinanceChargingList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getPharmacyList() {
      this.$store.dispatch('getPharmacyList', { params: { page: 0, limit: 10000, searchCondition: {}}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.daterange = null
      this.getFinanceChargingList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getFinanceChargingList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getFinanceChargingList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    exportFile() {
      const url = '/business/finance/financeAccountChargingRecord/export'
      download(url, this.param, 'CZJL')
    }
  }
}
</script>
