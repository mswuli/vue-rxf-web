<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="未收银" name="unpay">
          <el-table
            @selection-change="handleSelectionChange"
            :data="prescriptions.data"
            v-loading="listLoading"
            class="listing"
            border
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="code" width="150" label="处方编号"></el-table-column>
            <el-table-column prop="pickCode" width="150" label="处方提取码"></el-table-column>
            <el-table-column prop="patientName" width="100" label="患者姓名"></el-table-column>
            <el-table-column prop="docName" width="150" label="医生姓名"></el-table-column>
            <el-table-column prop="hspName" width="150" label="医院名称"></el-table-column>
            <el-table-column prop="departName" label="科室名称"></el-table-column>
            <el-table-column prop="diagnosticAmount" width="105" label="诊查费（元）"></el-table-column>
            <el-table-column prop="totalAmount" width="110" label="处方总金额（元）"></el-table-column>
            <el-table-column width="152" prop="prescriptionTime" label="处方开具时间">
              <template slot-scope="scope">
                {{scope.row.prescriptionTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="112">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="pay(scope.row)">收银</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="param.page" :page-sizes="[10,20,30, 50]"
                           :page-size="param.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="prescriptions.total">
            </el-pagination>
          </div>
          <pay-popout ref="payPoputModal" @refresh="getPrescriptionList"></pay-popout>
        </el-tab-pane>
        <el-tab-pane label="已收银" name="payed">
          <el-table
            @selection-change="handlePayedSelectionChange"
            :data="prescriptions.data"
            v-loading="payedListLoading"
            class="tablist"
            border
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="code" width="150" label="处方编号"></el-table-column>
            <el-table-column prop="pickCode" width="150" label="处方提取码"></el-table-column>
            <el-table-column prop="patientName" width="100" label="患者姓名"></el-table-column>
            <el-table-column prop="docName" width="150" label="医生姓名"></el-table-column>
            <el-table-column prop="hspName" width="150" label="医院名称"></el-table-column>
            <el-table-column prop="departName" label="科室名称"></el-table-column>
            <el-table-column prop="diagnosticAmount" width="80" label="诊查费（元）"></el-table-column>
            <el-table-column prop="totalAmount" width="80" label="处方总金额（元）"></el-table-column>
            <el-table-column width="152" prop="prescriptionTime" label="处方开具时间">
              <template slot-scope="scope">
                {{scope.row.prescriptionTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="112">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="printPayed(scope.row)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handlePayedSizeChange" @current-change="handlePayedCurrentChange"
                           :current-page="payedParam.page" :page-sizes="[10,20,30, 50]" :page-size="payedParam.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="prescriptions.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <print-popout ref="printPopoutModal" @refresh="goBack"></print-popout>
  </div>
</template>

<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .el-row > .el-col:first-child {
    color: #999;
  }

  .listing {
    margin-top: 13px;
  }

  .tablist {
    margin-top: 13px;
  }

  .btns {
    height: 50px;

    .el-button {
      float: right;
      margin: 0px 10px;
    }
  }

  /deep/ .el-radio.is-bordered {
    border: 0px;
    padding: 12px 0px 0px 9px;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import payPopout from './payPopout/payPopout'
  import printPopout from './payPopout/printPopout/printPopout'

  export default {
    data() {
      return {
        activeName: 'unpay',
        listLoading: false,
        payedListLoading: false,
        param: {
          page: 1,
          limit: 10,
          searchCondition: { finish: false, orderStatus: 'PICKED' }
        },
        payedParam: {
          page: 1,
          limit: 10,
          searchCondition: { finish: false, orderStatus: 'PAYED' }
        },

        multipleSelection: [],
        hasMedical: false,
        applyAmount: ''
      }
    },
    components: {
      payPopout,
      printPopout
    },
    filters: {},
    created() {
      this.getPrescriptionList()
    },
    computed: mapState({
      prescriptions: state => state.prescription.pharmacyPrescriptions,
      prescriptionShDetail: state => state.prescription.prescriptionShDetail,
      prescriptionDetail: state => state.prescription.prescriptionDetail
    }),
    methods: {
      /**
       * 切换待收银/已收银
       */
      handleClick(tab, event) {
        this.prescriptions.data = null
        if (tab.name === 'unpay') {
          this.getPrescriptionList()
        } else {
          this.getPayedPrescriptionList()
        }
      },
      /**
       * 获取待收银的处方（已提取未收银）
       */
      getPrescriptionList() {
        this.listLoading = true
        this.$store
          .dispatch('getPharmacyPrescriptionList', { params: this.param })
          .then(response => {
            this.listLoading = false
          })
      },
      /**
       * 获取已收银的处方
       */
      getPayedPrescriptionList() {
        this.payedListLoading = true
        this.$store
          .dispatch('getPharmacyPrescriptionList', { params: this.payedParam })
          .then(response => {
            this.payedListLoading = false
          })
      },
      /**
       * 重置待收银搜索
       */
      resetSearch() {
        this.param.searchCondition = { finish: false, orderStatus: 'DOSAGE' }
        this.getPrescriptionList()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getPrescriptionList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getPrescriptionList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      /**
       * 重置已收银搜索
       */
      resetPayedSearch() {
        this.payedParam.searchCondition = { finish: false, orderStatus: 'PAYED' }
        this.getPayedPrescriptionList()
      },
      handlePayedSizeChange(size) {
        this.payedParam.limit = size
        this.getPayedPrescriptionList()
      },
      handlePayedCurrentChange(page) {
        this.payedParam.page = page
        this.getPayedPrescriptionList()
      },
      handlePayedSelectionChange(val) {
        this.selectedRows = val
      },
      /**
       * 收银按钮，打开支付弹框
       * @param row
       */
      pay(row) {
        this.$refs.payPoputModal.open(row)
      },
      printPayed(row) {
        this.$store
          .dispatch('getPharmacyPrescriptionItems', {
            params: { prescriptionId: row.prescriptionId }
          })
          .then(response => {
            this.$store.dispatch('getPrescriptionDetail', {
              params: row, callback: () => {
                this.$nextTick(() => {
                  this.$refs.printPopoutModal.open(row, this.prescriptionDetail, response.data, 'payed')
                })
              }
            })
          })
      },
      goBack() {
      }
    }
  }
</script>
