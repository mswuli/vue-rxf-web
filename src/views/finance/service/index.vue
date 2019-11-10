<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="支付时间"
        end-placeholder="支付时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="filter-item" @click="getFinanceServiceList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeServices.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="id" label="支付单号"></el-table-column>
      <el-table-column prop="payAmount" label="支付金额（元）"></el-table-column>
      <el-table-column width="152" prop="payTime" label="支付时间">
        <template slot-scope="scope">
          {{scope.row.payTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="服务类型"></el-table-column>
      <el-table-column width="202" prop="serviceTime" label="服务时间"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeServices.total">
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
      }
    }
  },
  filters: {
  },
  created() {
    this.getFinanceServiceList()
  },
  computed: mapState({
    financeServices: state => state.financeIncome.financeServices
  }),
  methods: {
    getFinanceServiceList() {
      if (this.daterange) {
        this.param.searchCondition['payTimeStartSearch'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['payTimeEndSearch'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getFinanceServiceList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.daterange = null
      this.getFinanceServiceList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getFinanceServiceList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getFinanceServiceList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    }
  }
}
</script>
