<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="扣费时间"
        end-placeholder="扣费时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="filter-item" @click="getFinanceSmsList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeSmss.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="prescriptionCode" label="处方单号"></el-table-column>
      <el-table-column prop="pickCode" label="提取码"></el-table-column>
      <el-table-column prop="hospitalName" label="开方医院"></el-table-column>
      <el-table-column prop="prescriptionAmount" label="处方金额（元）"></el-table-column>
      <el-table-column prop="fee" label="扣费金额（元）"></el-table-column>
      <el-table-column width="152" prop="payTime" label="扣费时间">
        <template slot-scope="scope">
          {{scope.row.feeTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="交易类型">
        <template slot-scope="scope">
          短信服务费
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeSmss.total">
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
    this.getFinanceSmsList()
  },
  computed: mapState({
    financeSmss: state => state.financeIncome.financeSmss
  }),
  methods: {
    getFinanceSmsList() {
      if (this.daterange) {
        this.param.searchCondition['feeTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['feeTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getFinanceSmsList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    resetSearch() {
      this.daterange = null
      this.param.searchCondition = { page: 1, limit: 10, searchCondition: {} }
      this.getFinanceSmsList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getFinanceSmsList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getFinanceSmsList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    }
  }
}
</script>
