<template>
  <div class="continuePayPopout">
    <el-dialog
      title="继续支付"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div class="pays">
        <span>医保支付: {{medicalPayResult.alreadyPay}}元。</span><span> 剩余支付: {{medicalPayResult.leavePay}}元。</span></div>

      <el-form :model="currentPaymentType" ref="payment" label-width="100px">
        <el-form-item label="支付方式" prop="currentPaymentName">
          <el-radio-group v-model="currentPaymentName">
            <el-radio-button v-for="item in filterPaymentTypeList"
                             :key="item.id"
                             :label="item.name"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="剩余应付" prop="actuallyPay">
          <el-input v-model="medicalPayResult.leavePay" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="currentPaymentName==='现金'" label="实付金额" prop="flashAmount">
          <el-input v-model="currentPaymentType.flashAmount" @change="paymentAmount()">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="currentPaymentName==='现金'" label="找零金额" prop="giveAmount">
          <el-input v-model="currentPaymentType.giveAmount" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="合计金额" prop="finalAmount">
          <el-input v-model="currentPaymentType.totalPay" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <tr style="color: #f00; font-size: 14px;">
          <td colspan="3" style="padding-left: 30px">
            <span>{{ this.currentRow.couponAmount > 0 ? this.currentRow.memo : ''}}</span>
          </td>
        </tr>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">关 闭</el-button>
          <el-button type="primary" @click="confirmPayment">确认支付</el-button>
        </span>
      <print-popout ref="printPopoutModal" @refresh="goBack"></print-popout>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
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
</style>

<script>
  import { MessageBox } from 'element-ui'
  import { mapState } from 'vuex'
  import printPopout from '../../printPopout/printPopout'

  export default {
    data() {
      return {
        canScan: true,
        dialogVisible: false,
        filterPaymentTypeList: [],
        currentPaymentType: {
          giveAmount: 0
        },
        authCode: '',
        currentRow: {},
        prescriptionDetail: {
          pickPharmList: [],
          itemList: [],
          prescription: {},
          patient: {},
          hospital: {}
        },
        currentPaymentName: '微信',
        prescriptionItemList: [],
        medicalPayResult: {},
      }
    },
    components: {
      printPopout
    },
    computed: mapState({
    }),
    methods: {
      open(medicalPayResult) {
        this.prescriptionDetail = this.$parent.prescriptionDetail
        this.currentRow = this.$parent.currentRow
        this.prescriptionItemList = this.$parent.prescriptionItemList

        this.currentPaymentType.actuallyPay = medicalPayResult.actuallyPay
        this.currentPaymentType.totalPay = medicalPayResult.totalPay
        this.medicalPayResult = medicalPayResult

        this.filterPaymentTypeList = this.$parent.paymentTypeList.filter(i => i.name.indexOf('医保') < 0)
        this.dialogVisible = true
      },
      /**
       * 输入现金支付实付金额
       */
      paymentAmount() {
        this.currentPaymentType.giveAmount = this.currentPaymentType.flashAmount - this.medicalPayResult.leavePay
        this.currentPaymentType.giveAmount = parseInt(this.currentPaymentType.giveAmount * 100) / 100
      },

      /**
       * 继续支付弹框取消
       */
      cancel() {
        this.dialogVisible = false
      },

      /**
       * 点击确认支付按钮(医保结算之后弹框->其他支付的确认按钮，第三步)
       */
      confirmPayment() {
        this.$refs['payment'].validate(valid => {
          if (valid) {
            this.bindScan()
            for (const payment of this.filterPaymentTypeList) {
              if (payment.name === this.currentPaymentName) {
                this.currentPaymentType.paymentTypeCode = payment.code
              }
            }

            if (this.currentPaymentName === '现金') {
              if (this.currentPaymentType.flashAmount === '' || this.currentPaymentType.flashAmount === undefined || this.currentPaymentType.flashAmount === null) {
                return this.$message({
                  type: 'error',
                  message: '请输入实付金额',
                  duration: 3 * 1000
                })
              }
              if (this.currentPaymentType.flashAmount < this.medicalPayResult.leavePay) {
                return this.$message({
                  type: 'error',
                  message: '不能小于剩余支付金额',
                  duration: 3 * 1000
                })
              }
            }

            if (this.currentPaymentName === '微信' || this.currentPaymentName === '支付宝') {
              this.canScan = true
              document.body.focus()
              this.$confirm(
                `<div class="el-loading-spinner" style="position: static;"><i class="el-icon-loading" style="font-size: 48px;"></i><p class="el-loading-text">收银中，请稍后</p></div>`,
                '',
                {
                  confirmButtonText: '收银成功',
                  cancelButtonText: '返回',
                  showClose: false,
                  closeOnPressEscape: false,
                  closeOnClickModal: false,
                  dangerouslyUseHTMLString: true,
                  center: true
                }
              )
                .then(() => {
                  this.unbindScan()
                  this.finishPay()
                  this.canScan = true
                  // this.dialogVisible = false
                })
                .catch(() => {
                  this.unbindScan()
                  this.canScan = true
                  // this.dialogVisible = false
                })
            } else {
              this.$confirm(
                `应收金额：<span style="color: #ff0000; font-size: 18px;">${this.medicalPayResult.leavePay}</span> 元 。<br>${this.currentRow.couponAmount > 0 ? this.currentRow.memo : ''} <br>请至收银台完成收银操作。`,
                '提示',
                {
                  confirmButtonText: '收银完成/打印',
                  cancelButtonText: '返回',
                  type: 'warning',
                  showClose: false,
                  closeOnPressEscape: false,
                  closeOnClickModal: false,
                  dangerouslyUseHTMLString: true
                }
              )
                .then(() => {
                  this.finishPay()
                })
                .catch(() => {
                  // this.dialogVisible = false
                })
            }
          } else {
            console.log('error finish!!')
            return false
          }
        })
      },
      finishPay() {
        const params = {
          id: this.currentRow.id,
          pay: this.currentPaymentType
        }
        this.$store
          .dispatch('prescriptionPay', { params: params })
          .then(response => {
            this.$message({
              message: response.msg,
              type: '',
              duration: 2 * 1000
            })
            this.currentPaymentType = {}
            this.$refs.printPopoutModal.open(response.data, this.prescriptionDetail, this.prescriptionItemList, 'unpayed')
          })
          .catch(() => {
          })
      },
      /**
       * 监控巴枪输入
       */
      bindScan() {
        let lastTime = ''
        let code = ''
        document.onkeydown = e => {
          if (!this.canScan) {
            return false
          }
          let nextCode = ''
          let nextTime = new Date().getTime()
          if (window.event) {
            nextCode = e.keyCode
          } else if (e.which) {
            nextCode = e.which
          }
          if (
            (nextCode >= 48 && nextCode <= 57) ||
            (nextCode >= 96 && nextCode <= 105)
          ) {
            var codes = {
              '48': 48,
              '49': 49,
              '50': 50,
              '51': 51,
              '52': 52,
              '53': 53,
              '54': 54,
              '55': 55,
              '56': 56,
              '57': 57,
              '96': 48,
              '97': 49,
              '98': 50,
              '99': 51,
              '100': 52,
              '101': 53,
              '102': 54,
              '103': 55,
              '104': 56,
              '105': 57
            }
            nextCode = codes[nextCode]
            nextTime = new Date().getTime()
          }
          if (nextTime && lastTime && nextTime - lastTime > 2000) {
            code = String.fromCharCode(nextCode)
          } else {
            code += String.fromCharCode(nextCode)
          }
          lastTime = nextTime
          if (nextCode === 13 && /[0-9]{18}/.test(code)) {
            this.authCode = code
            this.tradePay()
            return false
          } else {
            this.authCode = ''
          }
          if (nextCode === 13) {
            return false
          }
        }
      },
      /**
       * 线上支付(微信、支付宝，调用支付接口)
       * @returns {boolean}
       */
      tradePay() {
        const prescriptionOrderId = this.prescriptionDetail.prescriptionOrder.id
        const authCode = this.authCode
        const cScanTime = new Date().getTime()
        if (
          (this.reAuthCode && authCode === this.reAuthCode) ||
          cScanTime - this.scanTime < 5000
        ) {
          return false
        }
        this.reAuthCode = authCode
        this.scanTime = new Date().getTime()
        this.$store
          .dispatch('tradePay', { prescriptionOrderId, authCode })
          .then(response => {
            console.log(response)
            this.authCode = ''
            this.reAuthCode = ''
            if (response.data && response.data.payStatus) {
              this.$message({
                message: response.data.payMessage,
                type: 'success',
                duration: 2 * 1000
              })
              MessageBox.close()
              this.unbindScan()
              this.finishPay()
              this.canScan = true
            } else {
              this.$message({
                message: response.data.payMessage,
                type: 'error',
                duration: 2 * 1000
              })
            }
          })
      },
      unbindScan() {
        document.onkeydown = null
      },
      goBack() {
        this.dialogVisible = false
        this.$emit('refresh')
      }
    }
  }
</script>
