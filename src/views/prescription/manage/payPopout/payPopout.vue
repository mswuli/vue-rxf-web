<template>
  <div class="payPopout">
    <el-dialog
      class="cf-dialog"
      title="收银台"
      width="1000px"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
      v-loading="prescriptionDetailLoading">
      <div class="clearfix">
        <!--处方笺-->
        <div class="cfj">
          <h4 class="m-title">处方笺信息</h4>
          <div class="cfj-tit">
            <div class="t1"><span id="detail_hospital_name">{{ prescriptionDetail.hospital.name }}</span></div>
            <div class="t2">（<span
              id="detail_hospital_shortName">{{ prescriptionDetail.hospital.shortName }}</span>）
            </div>
            <div class="t3">处方笺</div>
          </div>
          <div class="cfj-cont">
            <div class="clearfix cf-info">
              <div class="item item2">姓名：<span
                id="detail_patient_name">{{ prescriptionDetail.patient.name }}</span>
              </div>
              <div class="item item2">性别：<span
                id="detail_patient_sexName">{{ prescriptionDetail.patient.sexName }}</span></div>
              <div class="item item2">年龄：<span id="detail_patient_age">{{ prescriptionDetail.patient.age }}</span>
              </div>
              <div class="item item2">手机号：<span
                id="detail_patient_tel">{{ prescriptionDetail.patient.tel }}</span>
              </div>
              <div class="item">处方编号：{{ prescriptionDetail.prescription.code }}</div>
              <div class="item">身份证号：<span
                id="detail_patient_idCard">{{ prescriptionDetail.patient.idCard }}</span>
              </div>
              <div class="item">病情诊断：<span id="detail_prescription_tentativeDiagnosis">{{ prescriptionDetail.prescription.tentativeDiagnosis }}</span>
              </div>
              <div class="item">处方日期：<span id="detail_prescription_prescriptionTime">{{ prescriptionDetail.prescription.prescriptionTime | dateFormat }}</span>
              </div>
            </div>
            <div class="other-info">
              补充说明：<br>
              医师签名：<span>{{ prescriptionDetail.prescription.docName }}</span><br>
              诊查费（平台代收）：<span>{{ currentRow.diagnosticAmount }}元</span><br>
              收银员：<span>{{ currentRow.payOperatorName }}</span><br>
              审方药师：<span>{{ currentRow.dosageOperatorName }}</span><br>
              发药员：<span>{{ currentRow.deliverOperatorName }}</span>
            </div>
          </div>
        </div>
        <!--处方工作台-->
        <div class="work">
          <h4 class="m-title">处方工作台</h4>
          <!--提取-->
          <div class="common tq">
            <div class="tit">
              <h4>提取</h4>
              <div class="date">{{ currentRow.pickTime | dateFormat }}</div>
            </div>
            <div class="con">
              <table style="width: 100%">
                <tr>
                  <td>处方编号：{{ currentRow.code }}</td>
                  <td>提取码: {{ currentRow.pickCode }}</td>
                  <td>操作人:{{ currentRow.pickOperatorName }}</td>
                </tr>
              </table>
            </div>
          </div>
          <!--收银-->
          <div class="common hf">
            <div class="tit">
              <h4>收银</h4>
              <div class="date">{{ currentRow.payTime | dateFormat }}</div>
            </div>
            <div class="con">
              <el-form :model="currentPaymentType" :rules="rules" ref="currentPaymentType" label-width="100px">
                <table style="width: 100%">
                  <tr>
                    <td>药品总金额：</td>
                    <td>{{ currentRow.drugAmount }}元</td>
                  </tr>
                  <tr>
                    <td>诊查费（平台代收）：</td>
                    <td>{{ currentRow.diagnosticAmount }}元</td>
                  </tr>
                  <tr>
                    <td>处方总金额：</td>
                    <td>{{ currentRow.totalAmount }}元</td>
                  </tr>
                  <tr>
                    <td style="font-size: 20px;">应付金额：</td>
                    <td>{{ currentRow.finalAmount }}元</td>
                  </tr>
                  <tr>
                    <td style="color: red">{{this.currentRow.couponAmount > 0 ? this.currentRow.memo : '' }}</td>
                  </tr>
                </table>
                <el-form-item label="支付方式" prop="currentPaymentName">
                  <el-radio-group v-model="currentPaymentName">
                    <el-radio v-for="item in paymentTypeList"
                              :key="item.id"
                              :name="item.code"
                              :label="item.name" :disabled="disableItem(item)" border></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="应付金额" prop="finalAmount">
                  <el-input v-model="currentPaymentType.finalAmount" :disabled="true">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="currentPaymentName==='现金'" label="实付金额" prop="finalAmount">
                  <el-input v-model="currentPaymentType.receiveAmount" @change="inputAmount()">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="currentPaymentName==='现金'" label="找零金额" prop="finalAmount">
                  <el-input v-model="currentPaymentType.giveAmount" :disabled="true">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="合计金额" prop="finalAmount">
                  <el-input v-model="currentPaymentType.finalAmount" :disabled="true">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="showPay()">收 银</el-button>
      </div>
    </el-dialog>
    <medical-pay-popout ref="medicalPayPopoutModal" @refresh='goBack'></medical-pay-popout>
    <print-popout ref="printPopoutModal" @refresh="goBack"></print-popout>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import { mapState } from 'vuex'
  import medicalPayPopout from './medicalPayPopout/medicalPayPopout'
  import printPopout from './printPopout/printPopout'

  export default {
    data() {
      return {
        canScan: true,
        dialogVisible: false,
        currentRow: {},
        prescriptionDetailLoading: false,
        currentPaymentType: {
          giveAmount: 0
        },
        authCode: '',
        rules: {
          currentPaymentName: []
        },
        currentPaymentName: '支付宝',
        prescriptionItemList: []
      }
    },
    components: {
      medicalPayPopout,
      printPopout
    },
    created() {
      this.getPayment()
    },
    computed: mapState({
      prescriptionDetail: state => state.prescription.prescriptionDetail,
      paymentTypeList: state => state.prescription.payments
    }),
    methods: {
      open(row) {
        this.dialogVisible = true
        this.currentRow = row
        this.prescriptionDetailLoading = true
        this.currentPaymentType.receiveAmount = this.currentRow.receiveAmount
        this.getPharmacyPrescriptionItems()
        this.getPrescriptionDetail()
        this.currentPaymentName = '支付宝'
      },
      /**
       * 获取支付方式
       */
      getPayment() {
        this.$store.dispatch('getPayment', { params: this.param })
      },
      getPrescriptionDetail() {
        this.$store.dispatch('getPrescriptionDetail', {
          params: this.currentRow,
          callback: () => {
            this.prescriptionDetailLoading = false
            this.currentPaymentType.totalAmount = this.prescriptionDetail.prescriptionOrder.totalAmount
            this.currentPaymentType.finalAmount = this.prescriptionDetail.prescriptionOrder.finalAmount
          }
        })
      },

      /**
       * 获取处方药品列表（非处方订单药品）
       */
      getPharmacyPrescriptionItems() {
        this.$store
          .dispatch('getPharmacyPrescriptionItems', {
            params: { prescriptionId: this.currentRow.prescriptionId }
          })
          .then(response => {
            this.prescriptionItemList = response.data
            for (let i = 0; i < this.prescriptionItemList.length; i++) {
              if (this.prescriptionItemList[i].medical) {
                this.hasMedical = true
                break
              }
            }
          })
      },

      /**
       * 点击收银按钮（第一步）
       */
      showPay() {
        this.$refs['currentPaymentType'].validate(valid => {
          if (valid) {
            for (const currentPaymentType of this.paymentTypeList) {
              if (currentPaymentType.name === this.currentPaymentName) {
                this.currentPaymentType.paymentTypeCode = currentPaymentType.code
              }
            }
            if (this.currentPaymentName === '现金') {
              if (this.currentPaymentType.receiveAmount === '' || this.currentPaymentType.receiveAmount === undefined || this.currentPaymentType.receiveAmount === null) {
                return this.$message({
                  type: 'error',
                  message: '请输入实付金额',
                  duration: 3 * 1000
                })
              }
              if (this.currentPaymentType.receiveAmount < this.currentPaymentType.finalAmount) {
                return this.$message({
                  type: 'error',
                  message: '不能小于应付金额',
                  duration: 3 * 1000
                })
              }
            }
            if (this.currentPaymentName === '微信' || this.currentPaymentName === '支付宝') {
              this.canScan = true
              this.bindScan()
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
                })
                .catch(() => {
                  this.unbindScan()
                  this.dialogVisible = false
                  this.canScan = true
                })
            } else if (this.currentPaymentName.indexOf('医保') !== -1) {
              if (!this.hasMedical) {
                this.$message({
                  message: '当时处方无医保药品,请选择其他支付方式！！！',
                  type: 'warning',
                  duration: 2 * 1000
                })
                return
              }
              this.$refs.medicalPayPopoutModal.open()
            } else {
              this.$confirm(
                `应收金额：<span style="color: #ff0000; font-size: 18px;">${this.currentRow.finalAmount}</span> 元 。<br>${this.currentRow.couponAmount > 0 ? this.currentRow.memo : ''} <br>请至收银台完成收银操作。`,
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
                  this.dialogVisible = false
                })
            }
          } else {
            console.log('error finish!!')
            return false
          }
        })
      },

      /**
       * 输入现金支付实付金额
       */
      inputAmount() {
        this.currentPaymentType.giveAmount = this.currentPaymentType.receiveAmount - this.currentPaymentType.finalAmount
        this.currentPaymentType.giveAmount = parseInt(this.currentPaymentType.giveAmount * 100) / 100
      },
      /**
       * 监听支付方式是否可编辑
       * @param item
       * @returns {boolean}
       */
      disableItem(item) {
        return false
        // if (item.name.indexOf('医保') >= 0) {
        //   return !this.hasMedical
        // }
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
            // this.dialogVisible = false
            // this.$emit('refresh')
          })
          .catch(() => {
            // this.dialogVisible = false
            // this.$emit('refresh')
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
      unbindScan() {
        document.onkeydown = null
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
      goBack() {
        this.dialogVisible = false
        this.$emit('refresh')
      }
    }
  }
</script>
