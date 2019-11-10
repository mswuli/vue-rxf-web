<template>
  <div class="printPopout">

    <div id="printDiv" ref="print">
      <div style="width: 50mm;">
        <div style="padding: 2mm 2mm 2mm 2mm; text-align: center">
          <div style="font-size: 15px; margin-bottom: 2px;">{{ prescriptionDetail.hospital.name }}</div>
          <div style="font-size: 12px;">{{ prescriptionDetail.hospital.shortName }}</div>
        </div>
        <div style="font-size: 12px;">
          <div style="line-height: 18px;">姓名：{{ prescriptionDetail.patient.name }}　{{ prescriptionDetail.patient.sexName
            }}　{{ prescriptionDetail.patient.age }}岁
          </div>
          <div style="line-height: 18px;">处方编号：{{ prescriptionDetail.prescription.code }}</div>
          <div style="font-size: 12px; font-weight: 300; height: 12px;">*******************************</div>
          <table style="font-size: 10px;">
            <thead style="text-align: center; line-height: 24px;font-size:12px;">
            <td style="width: 60px;">品名</td>
            <td style="width: 60px;">医院规格</td>
            <td style="width: 35px;">数量</td>
            <td style="width: 35px;">单价</td>
            </thead>
            <tbody style="line-height: 20px;">
            <tr>
              <td colspan="4" style="border-top: 1px dashed #000; height: 5px"></td>
            </tr>
            <tr v-for="item in prescriptionItemList" v-bind:key="item.id">
              <td>{{ item.name }}{{item.medical ? '(医保)': ''}}</td>
              <td>{{ item.hspSkuSpec }}</td>
              <td>{{ item.numTotal }}{{ item.unit }}</td>
              <td>{{ item.price }}</td>
            </tr>
            <tr v-if="isShowDiagnostic">
              <td style="line-height: normal">诊查费({{ prescriptionDetail.prescription.docName }})</td>
              <td>{{ prescriptionDetail.prescription.diagnosticAmount }}</td>
              <td>1</td>
              <td>{{ prescriptionDetail.prescription.diagnosticAmount }}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td colspan="2" style="font-size: 10px">{{ this.finalPayResult.couponAmount > 0 ? '诊查费已减免' : '' }}</td>
            </tr>
            <tr>
              <td colspan="4" style="border-bottom: 1px dashed #000; height: 5px;"></td>
            </tr>
            </tbody>
          </table>
          <table style="line-height: 20px;">
            <tr style="font-size: 18px;">
              <td>合计：</td>
              <td>{{ this.finalPayResult.totalAmount }}元</td>
            </tr>
            <tr v-if="this.finalPayResult.medicalAmount">
              <td style="font-size: 11px">&nbsp;医保</td>
              <td>{{ this.finalPayResult.medicalAmount }}元</td>
            </tr>
            <tr v-if="this.finalPayResult.paymentTypeAmount">
              <td style="font-size: 11px">&nbsp;{{this.finalPayResult.medicalAmount ? '(非医保)' : ''}}{{ this.finalPayResult.paymentCodeName }}</td>
              <td>{{ this.finalPayResult.paymentTypeAmount }}元</td>
            </tr>
          </table>
          <div style="padding: 5px 0; line-height: 18px; border-top: 1px solid #000;">
            <div>日期：{{ new Date() | dateFormat }}</div>
            <div>收银员：{{ username }}</div>
            <svg id="barcode"></svg>
          </div>
          <div style="line-height: 8px; text-align: center;">
            - - - - - - - - - - - - - - - - - - - - - - - - - - -
            - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </div>
          <div style="padding: 5px 0;font-size:10px ">
            药品属特殊商品，一经售出恕不退换。
            凭此小票一个月内索取发票，逾期无效。
            咨询服务热线：4006228918
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #printDiv {
    background: #eaeaea;
    width: 58mm;
    display: none;
    /*display: block;*/
  }
</style>

<script>
  import JsBarcode from 'jsbarcode'
  import { getLodop } from '@/utils/LodopFuncs'

  export default {
    data() {
      return {
        isShowDiagnostic: false,
        finalPayResult: {},
        prescriptionDetail: {
          pickPharmList: [],
          itemList: [],
          prescription: {},
          patient: {},
          hospital: {}
        },
        prescriptionItemList: [],
        username: ''
      }
    },
    methods: {
      open(finalPayResult, prescriptionDetail, prescriptionItemList, isPayed) {
        if (window.localStorage.account) {
          this.username = JSON.parse(window.localStorage.account).name
        }
        this.finalPayResult = finalPayResult
        this.prescriptionDetail = prescriptionDetail
        this.prescriptionItemList = prescriptionItemList
        this.finalPayResult.paymentTypeAmount = parseInt((this.finalPayResult.finalAmount - this.finalPayResult.medicalAmount) * 100) / 100
        if (!this.finalPayResult.paymentCodeName) {
          this.finalPayResult.paymentCodeName = this.finalPayResult.paymentTypeName
        }
        this.isShowDiagnostic = this.prescriptionDetail.prescriptionOrder.diagnosticAmount !== 0
        // this.paySerialId = response.data.prescriptionOrderId;
        JsBarcode('#barcode', this.finalPayResult.prescriptionOrderId, {
          format: 'CODE128',
          font: 'OCRB',
          fontSize: 14,
          textMargin: 0,
          textAlign: 'center',
          width: 1,
          height: 39
        }).render()
        this.$nextTick(() => {
          this.print()
          setTimeout(() => {
            this.print()
            if (!isPayed) {
              this.$router.push({
                path: 'pharmacyPrescriptionDosage',
                name: 'pharmacyPrescriptionDosage',
                component: () => import('@/views/prescription/manage/pharmacyPrescriptionDosage')
              })
            }
          }, 3000)
        })
      },

      /**
       * 打印小票
       */
      print() {
        try {
          const LODOP = getLodop()
          this.$nextTick(() => {
            const html = this.$refs.print.innerHTML
            // console.log(html)
            LODOP.ADD_PRINT_HTM('', '', '100%', '100%', html)
            LODOP.SET_PRINTER_INDEX('小票打印机')
            LODOP.SET_PRINT_PAGESIZE(3, '58mm', '100%', '') // 这里3表示纵向打印且纸高“按内容的高度”；纸宽58mm；页底空白6mm
            LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Width:100%;Height:100%')
            LODOP.PRINT()
          })
          this.$emit('refresh')
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
