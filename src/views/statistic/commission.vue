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

      <el-button class="filter-item" @click="getCommissionList()" type="primary" icon="el-icon-search">搜索
      </el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <!--<el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>-->
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacyCommissionFees.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="prescriptionCode" label="处方编码"></el-table-column>
      <el-table-column prop="pharmacyName" label="药店名称"></el-table-column>
      <el-table-column prop="pickCode" label="取药码"></el-table-column>
      <el-table-column prop="prescriptionAmount" label="处方金额（元）"></el-table-column>
      <el-table-column prop="fee" label="扣费金额（元）"></el-table-column>
      <el-table-column prop="feeTime" label="扣费时间">
        <template slot-scope="scope">
          {{scope.row.feeTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="交易类型">
        <template slot-scope="scope">
          处方佣金
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]"
                     :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pharmacyCommissionFees.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { download } from '@/utils/export'
  import moment from 'moment'

  export default {
    data() {
      return {
        listLoading: false,
        itemListLoading: false,
        param: { page: 1, limit: 10, searchCondition: {} },
        dialogVisible: false,
        itemDialogVisible: false,
        itemEditDialogVisible: false,
        hspLoading: false,
        daterange:null
      }
    },
    filters: {},
    created() {
      this.getCommissionList()
    },
    computed: mapState({
      pharmacyCommissionFees: state => state.commissionFee.pharmacyCommissionFees,
      hospitals: state => state.hospital.hospitals
    }),
    methods: {
      getCommissionList() {
        if (this.daterange) {
          this.param.searchCondition['feeTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
          this.param.searchCondition['feeTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
        }
        this.listLoading = true
        this.$store.dispatch('getCommissionList', {
          params: this.param, callback: () => {
            this.listLoading = false
          }
        })
      },
      getHospitalList(query) {
        this.$store.dispatch('clearHospitalList')
        if (query !== '') {
          this.hspLoading = true
          this.$store.dispatch('getHospitalList', {
            params: { page: 0, limit: 10, searchCondition: { name: query } }, callback: () => {
              this.hspLoading = false
            }
          })
        }
      },
      changeHsp() {
        this.mObject.hospitalId = this.mObject.hospitalName
        // this.getDoctorsByHospital(this.mObject.hospitalId)
      },
      // getDoctorsByHospital(hspId) {
      //   this.$store.dispatch('getDoctorsByHospital', { params: {id: hspId}})
      // },
      resetSearch() {
        this.daterange = null
        this.param.searchCondition = { page: 1, limit: 10, searchCondition: {} }
        this.getCommissionList()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getCommissionList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getCommissionList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      handleItemSelectionChange(val) {
        this.selectedItemRows = val
      },
      // exportFile() {
      //   const url = '/business/statistic/commission/export'
      //   download(url, this.param, '医院诊查费用')
      // }
    }
  }
</script>
