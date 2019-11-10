<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" v-model="code" class="filter-item" placeholder="请输入提取码"
                @keyup.enter.native="pickByCode">
      </el-input>
      <el-button class="filter-item" @click.native.prevent="pickByCode()" type="primary" icon="el-icon-search">提取
      </el-button>
    </div>

    <pay-popout ref="payPoputModal" @refresh="code = ''"></pay-popout>

  </div>
</template>


<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .financ {
    margin-top: 13px;
  }

  .el-row > .el-col:first-child {
    color: #999;
  }

  #printDiv {
    background: #eaeaea;
    width: 58mm;
    display: none;
    /*display: block;*/
  }

  .listing {
    margin-top: 13px;
  }

  .tablist {
    margin-top: 13px;
  }

  .pays {
    font-size: 16px;
    margin-left: 30px;
    height: 40px
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
  import {mapState} from 'vuex'
  import {getLodop} from '@/utils/LodopFuncs'
  import {MessageBox} from 'element-ui'
  import JsBarcode from 'jsbarcode'
  import payPopout from './payPopout/payPopout'

  export default {
    data() {
      return {
        alDialogVisible: false,
        isShowDiagnostic: true,
        listLoading: false,
        tableVisible: false,
        payDialogVisible: false,
        unpickPrescriptionParam: {
          page: 1,
          limit: 10,
          searchCondition: {}
        },
        code: '',
        prescriptionOrderDetailLoading: false,
        param: {
          page: 1,
          limit: 10,
          searchCondition: {finish: false, orderStatus: 'PICKED'}
        },
        dialogVisible: false,
        shDialogVisible: false,
        visible2: false,
        rejectMsg: '',
        selectedItemRows: [],
        cachePrescriptionItemList: [],
        prescriptionOrderDetail: {
          prescription: {},
          patient: {},
          hospital: {},
          prescriptionOrder: {},
          itemList: {}
        },
        payment: {
          giveAmount: 0
        },

        username: '',

        paymentName: '支付宝',
        paySerialId: '',

        canScan: true,
        authCode: '',
        reAuthCode: '',
        scanTime: new Date().getTime(),
        multipleSelection: [],
        filterPaymentName: [],
        hasMedical: false,
        applyAmount: "",
        applyDetail: {
          pickPharmacyId: "",
          paymentType: "",
          prescriptionItemSet: [],
        },
        currentRow:{}
      }
    },
    created() {
    },
    computed: mapState({
    }),
    components: {
      payPopout
    },
    methods: {
      pickByCode() {
        if (this.code === null || this.code === '') {
          return this.$message({
            type: 'error',
            message: '请输入提取码',
            duration: 3 * 1000
          })
        }
        this.$store
          .dispatch('pickByCode', {params: {code: this.code}})
          .then(response => {
            this.dialogVisible = true
            // this.prescriptionOrderDetailLoading = true
            this.prescriptionOrderDetail = response.data

            this.$store
              .dispatch('getPharmacyPrescriptionList', { params: { page: 1, limit: 1, searchCondition: {id: this.prescriptionOrderDetail.prescriptionOrder.prescriptionPickPharmId, finish: false, orderStatus: 'PICKED' } }})
              .then(response => {
                if (response.data) {
                  this.$refs.payPoputModal.open(response.data[0])
                }
              })

            this.payment.totalAmount = this.prescriptionOrderDetail.prescriptionOrder.totalAmount
            this.payment.finalAmount = this.prescriptionOrderDetail.prescriptionOrder.finalAmount
            this.payment.receiveAmount = this.prescriptionOrderDetail.prescriptionOrder.receiveAmount
          })
      }
    }
  }
</script>
