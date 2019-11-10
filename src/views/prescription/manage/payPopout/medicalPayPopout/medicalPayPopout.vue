<template>
  <div class="medicalPayPopout">
    <el-dialog
      title="医保药品支付(诊查费和服务费已收取,请继续完成操作)"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        @row-click="handleChange"
        @selection-change="handleSelect"
        :data="cachePrescriptionItemList"
        border
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="品名"></el-table-column>
        <el-table-column label="厂家">
          <template slot-scope="scope">
            {{scope.row.manufacturer }}
          </template>
        </el-table-column>
        <el-table-column prop="hspSkuSpec" label="医院规格">
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            {{scope.row.numTotal }}{{scope.row.unit}}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
      </el-table>
      <tr style="color: #f00; font-size: 20px;">
        <td style="font-size: 14px;">
          <span>应收金额：{{this.currentRow.totalAmount}} 元</span>
        </td>
        <td style="padding: 10px 20px 10px 10px">
          <span>医保：<span v-model="applyAmount">{{this.applyAmount}}</span>元</span>
        </td>
        <td style="padding: 10px 20px 10px 10px">
          <span>非医保：<span v-model="applyAmount">{{parseInt((this.currentRow.finalAmount -this.applyAmount) * 100) / 100}}</span>元</span>
        </td>
      </tr>
      <tr style="color: #f00; font-size: 14px;">
        <td colspan="3">
          <span>{{ this.currentRow.couponAmount > 0 ? this.currentRow.memo : ''}}</span>
        </td>
      </tr>
      <tr style="color: #f00; font-size: 14px;" hidden>
        <td colspan="3">
          请至医保系统完成收银操作。
        </td>
      </tr>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goBack">关 闭</el-button>
        <el-button type="primary" @click="medicalAccount">医保结算</el-button>
      </span>
    </el-dialog>
    <continue-pay-popout ref="continuePayPopoutModal" @refresh="goBack"></continue-pay-popout>
    <print-popout ref="printPopoutModal" @refresh="goBack"></print-popout>
  </div>
</template>

<script>
  import continuePayPopout from './continuePayPopout/continuePayPopout'
  import printPopout from '../printPopout/printPopout'

  export default {
    data() {
      return {
        dialogVisible: false,
        currentRow: {},
        prescriptionItemList: [],
        prescriptionDetail: {
          pickPharmList: [],
          itemList: [],
          prescription: {},
          patient: {},
          hospital: {}
        },
        paymentTypeList: [],
        cachePrescriptionItemList: [],
        applyAmount: 0,
        currentPaymentType: {},
        applyDetail: {
          pickPharmacyId: '',
          paymentType: '',
          prescriptionItemSet: []
        },
        multipleSelection: []
      }
    },
    computed: {},
    components: {
      continuePayPopout,
      printPopout
    },
    methods: {
      open() {
        this.prescriptionDetail = this.$parent.prescriptionDetail
        this.currentRow = this.$parent.currentRow
        this.paymentTypeList = this.$parent.paymentTypeList
        this.prescriptionItemList = this.$parent.prescriptionItemList
        this.currentPaymentType = this.$parent.currentPaymentType
        if (this.prescriptionItemList && this.prescriptionItemList.length > 0) {

          this.cachePrescriptionItemList = this.prescriptionItemList.map(item => ({ ...item }))
          this.applyAmount = 0
          for (let p in this.cachePrescriptionItemList) {
            const prescriptionItem = this.cachePrescriptionItemList[p]
            if (prescriptionItem.medical) {
              this.$nextTick(() => {
                this.$refs.multipleTable.toggleRowSelection(prescriptionItem, true)
              })
              this.applyAmount = this.applyAmount + parseFloat(prescriptionItem.price) * parseInt(prescriptionItem.numTotal)
            } else {
              this.cachePrescriptionItemList.splice(p, 1)
              p--
            }
          }
          this.applyAmount = parseInt(this.applyAmount * 100) / 100

          const params = {
            id: this.currentRow.id,
            pay: this.currentPaymentType
          }
          this.$store.dispatch('getPrescriptionSystemDeduction', { params: params })
          this.dialogVisible = true
        }
      },

      /**
       * 医保支付弹框页面事件监听
       * @param val
       */
      handleSelect(val) {
        let valId = []
        for (let i = 0; i < val.length; i++) {
          valId.push(val[i])
        }
        this.multipleSelection = valId
        // console.log(this.multipleSelection, 33)
        if (this.multipleSelection.length === 0) {
          this.applyAmount = 0
        } else {
          this.applyAmount = 0
          for (let i = 0; i < this.multipleSelection.length; i++) {
            const prescriptionItem = this.multipleSelection[i]
            this.applyAmount = this.applyAmount + parseFloat(prescriptionItem.price) * parseInt(prescriptionItem.numTotal)
          }
          this.applyAmount = parseInt(this.applyAmount * 100) / 100
        }
      },
      /**
       * 医保支付弹框页面--列表选择按钮事件监听
       * @param row
       * @param event
       * @param column
       */
      handleChange(row, event, column) {
        let flag = false
        if (this.multipleSelection.length > 0) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].id == row, id) {
              flag = true
              this.removeByValue(this.multipleSelection, row.id)
              break
            }
          }
          if (flag === true) {
            this.$refs.multipleTable.toggleRowSelection(row, false)
          } else {
            this.$refs.multipleTable.toggleRowSelection(row, true)
            this.multipleSelection.push(row)
          }
        } else {
          this.$refs.multipleTable.toggleRowSelection(row, true)
          this.multipleSelection.push(row)
        }
      },

      /**
       * 点击医保结算按钮(选择医保支付后弹框页面的确认按钮,第二步)
       */
      medicalAccount() {
        this.applyDetail.pickPharmacyId = this.currentRow.id
        this.applyDetail.paymentType = this.currentPaymentType.paymentTypeCode
        this.applyDetail.prescriptionItemSet = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.applyDetail.prescriptionItemSet.push(this.multipleSelection[i].id)
        }
        this.$store.dispatch('getMedicalAccount', { data: this.applyDetail }).then(response => {
          if (!response.data.finish) {
            this.$refs.continuePayPopoutModal.open(response.data)
          } else {
            this.$confirm(
              `应收金额：<span style="color: #ff0000; font-size: 18px;">${this.currentRow.finalAmount}</span> 元 。<br>${this.currentRow.couponAmount > 0 ? this.currentRow.memo : ''} <br>请至收银台完成收银操作。`,
              '提示',
              {
                confirmButtonText: '收银完成/打印',
                cancelButtonText: '关闭',
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
              })
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
       * 医保支付弹框返回
       */
      goBack() {
        this.dialogVisible = false
        this.$emit('refresh')
      }
    }

  }
</script>
