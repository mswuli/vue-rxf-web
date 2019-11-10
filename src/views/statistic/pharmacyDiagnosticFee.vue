<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" v-model="param.searchCondition.prescriptionCode" class="filter-item" placeholder="处方编号">
      </el-input>
      <el-button class="filter-item" @click="getHospitalDiagnosticList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="hospitalDiagnosticFees.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="hospitalName" label="医院"></el-table-column>
      <el-table-column prop="prescriptionCode" label="处方编号"></el-table-column>
      <el-table-column prop="fee" label="诊查费(元)">
        <template slot-scope="scope">
          {{-scope.row.fee | moneyFormatter}}
        </template>
      </el-table-column>
      <el-table-column prop="feeTime" label="扣费时间">
        <template slot-scope="scope">
          {{scope.row.feeTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="pickTime" label="提取时间">
        <template slot-scope="scope">
          {{scope.row.pickTime | dateFormat}}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="hospitalDiagnosticFees.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { download } from '@/utils/export'

export default {
  data() {
    return {
      listLoading: false,
      itemListLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      itemDialogVisible: false,
      itemEditDialogVisible: false
    }
  },
  filters: {
  },
  created() {
    this.getHospitalDiagnosticList()
  },
  computed: mapState({
    hospitalDiagnosticFees: state => state.diagnosticFee.hospitalDiagnosticFees,
    hospitals: state => state.hospital.hospitals,
    hospitalDoctors: state => state.hospital.hospitalDoctors
  }),
  methods: {
    getHospitalDiagnosticList() {
      this.listLoading = true
      this.$store.dispatch('getHospitalDiagnosticList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getHospitalList(query) {
      this.$store.dispatch('clearHospitalList')
      if (query !== '') {
        this.hspLoading = true
        this.$store.dispatch('getHospitalList', { params: { page: 0, limit: 10, searchCondition: { name: query }}, callback: () => {
          this.hspLoading = false
        } })
      }
    },
    changeHsp() {
      this.mObject.hospitalId = this.mObject.hospitalName
      this.getDoctorsByHospital(this.mObject.hospitalId)
    },
    getDoctorsByHospital(hspId) {
      this.$store.dispatch('getDoctorsByHospital', { params: {id: hspId}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getHospitalDiagnosticList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getHospitalDiagnosticList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getHospitalDiagnosticList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleItemSelectionChange(val) {
      this.selectedItemRows = val
    },
    exportFile() {
      const url = '/business/statistic/diagnostic/export'
      download(url, this.param, '医院诊查费用')
    }
  }
}
</script>
