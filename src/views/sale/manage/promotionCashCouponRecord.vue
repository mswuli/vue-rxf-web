<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.pharmacyName" class="filter-item" placeholder="药店名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.couponName" class="filter-item" placeholder="券名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.couponNumber" class="filter-item" placeholder="券编码">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.couponCode" class="filter-item" placeholder="券激活码">
      </el-input>
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="使用开始时间"
        end-placeholder="使用结束时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="filter-item" @click="getPromotionCashCouponRecordList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="promotionCashCouponRecords.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="financeAccountId" width="200" label="账户ID"></el-table-column>
      <el-table-column prop="financeAccountVO.pharmacyName" width="180" label="药店名称"></el-table-column>
      <el-table-column prop="cashCouponId" width="180" label="券ID"></el-table-column>
      <el-table-column prop="promotionCashCouponVO.couponName" width="150" label="券名称"></el-table-column>
      <el-table-column prop="promotionCashCouponVO.couponCode" width="150" label="激活码"></el-table-column>
      <el-table-column prop="useTime" label="使用时间">
        <template slot-scope="scope">
          {{scope.row.useTime | dateFormat}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="promotionCashCouponRecords.total">
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
      dialogVisible: false,
      mTitle: '',
      daterange: null,
      mObject: {
      }
    }
  },
  filters: {
  },
  created() {
    this.getPromotionCashCouponRecordList()
  },
  computed: mapState({
    promotionCashCouponRecords: state => state.promotionCashCouponRecord.promotionCashCouponRecords
  }),
  methods: {
    getPromotionCashCouponRecordList() {
      if (this.daterange) {
        this.param.searchCondition['useTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['useTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getPromotionCashCouponRecordList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.daterange = null
      this.getPromotionCashCouponRecordList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getPromotionCashCouponRecordList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getPromotionCashCouponRecordList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    exportFile() {
      const url = '/business/promotion/promotionCashCouponRecord/export'
      download(url, this.param, '现金券使用记录')
    }
  }
}
</script>
