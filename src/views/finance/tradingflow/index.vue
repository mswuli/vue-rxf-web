<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select style="width:250px;" v-model="param.searchCondition.financeAccountVO.pharmacyId" filterable placeholder="请选择药店">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacys.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="交易时间"
        end-placeholder="交易时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="filter-item" @click="getFinanceTradingFlowList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeTradingFlows.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="financeAccountVO.pharmacyName" label="药店名称"></el-table-column>
      <el-table-column prop="tradingNumber" label="流水号"></el-table-column>
      <el-table-column prop="tradingTypeName" label="交易类型"></el-table-column>
      <el-table-column prop="objId" label="关联对象ID"></el-table-column>
      <el-table-column prop="hspName" label="医院"></el-table-column>
      <el-table-column prop="prescriptionCode" label="处方单编号"></el-table-column>
      <el-table-column prop="pickCode" label="提取码"></el-table-column>
      <el-table-column width="152" prop="tradingTime" label="交易时间">
        <template slot-scope="scope">
          {{scope.row.tradingTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="tradingAmount" label="交易金额（元）"></el-table-column>
      <el-table-column prop="memo" label="备注"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeTradingFlows.total">
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
      param: { page: 1, limit: 10, searchCondition: { financeAccountVO: { pharmacyId: null }}},
      daterange: null,

      rules: {
      }
    }
  },
  filters: {
  },
  created() {
    this.getFinanceTradingFlowList()
    this.getPharmacyList()
  },
  computed: mapState({
    financeTradingFlows: state => state.financeTradingFlow.financeTradingFlows,
    pharmacys: state => state.pharmacy.pharmacys
  }),
  methods: {
    getFinanceTradingFlowList() {
      if (this.daterange) {
        this.param.searchCondition['tradingTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['tradingTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getFinanceTradingFlowList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getPharmacyList() {
      this.$store.dispatch('getPharmacyList', { params: { page: 0, limit: 10000, searchCondition: {}}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.daterange = null
      this.getFinanceTradingFlowList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getFinanceTradingFlowList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getFinanceTradingFlowList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    exportFile() {
      const url = '/business/finance/financeAccountTradingFlow/export'
      download(url, this.param, '交易记录')
    }
  }
}
</script>
