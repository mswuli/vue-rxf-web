<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.code" class="filter-item" placeholder="处方编号">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.patientName" class="filter-item"
                placeholder="患者姓名">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.hspName" class="filter-item" placeholder="医院名称">
      </el-input>
      <el-button class="filter-item" @click="getPrescriptionList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="prescriptions.data"
      v-loading="listLoading"
      class="tableList"
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
          <el-button type="warning" size="mini" @click="detail(scope.row)">配药</el-button>
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

    <el-dialog
      class="cf-dialog"
      title="配药"
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
            <div class="t2">（<span id="detail_hospital_shortName">{{ prescriptionDetail.hospital.shortName }}</span>）
            </div>
            <div class="t3">处方笺</div>
          </div>
          <div class="cfj-cont">
            <div class="clearfix cf-info">
              <div class="item item2">姓名：<span id="detail_patient_name">{{ prescriptionDetail.patient.name }}</span>
              </div>
              <div class="item item2">性别：<span
                id="detail_patient_sexName">{{ prescriptionDetail.patient.sexName }}</span></div>
              <div class="item item2">年龄：<span id="detail_patient_age">{{ prescriptionDetail.patient.age }}</span></div>
              <div class="item item2">手机号：<span id="detail_patient_tel">{{ prescriptionDetail.patient.tel }}</span>
              </div>
              <div class="item">处方编号：{{ prescriptionDetail.prescription.code }}</div>
              <div class="item">身份证号：<span id="detail_patient_idCard">{{ prescriptionDetail.patient.idCard }}</span>
              </div>
              <div class="item">病情诊断：<span id="detail_prescription_tentativeDiagnosis">{{ prescriptionDetail.prescription.tentativeDiagnosis }}</span>
              </div>
              <div class="item">处方日期：<span id="detail_prescription_prescriptionTime">{{ prescriptionDetail.prescription.prescriptionTime | dateFormat }}</span>
              </div>
            </div>
            <div class="rp-info">
              <div class="t">Rp:</div>
              <div class="rp-list" id="detail_prescription_item">
                <div class="item" v-for="item in prescriptionItems" v-bind:key="item.id">
                  <div class="name clearfix">
                    <div class="pull-left">{{ item.name }} {{item.medical ? '（医保）': ''}} {{ item.specifications }}</div>
                    <div class="pull-right">数量：{{ item.numTotal }}{{ item.unit }}</div>
                  </div>
                  <div class="des">
                    <span>{{ item.usage }}</span><span>{{ item.frequency }}</span><span>{{ item.num }}</span></div>
                </div>
              </div>
            </div>
            <div class="other-info">
              补充说明：<br>
              医师签名：<span>{{ prescriptionDetail.prescription.docName }}</span><br>
              诊查费（平台代收）：<span>{{ prescriptionDetail.prescription.diagnosticAmount }}元</span><br>
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
              <table style="width: 100%">
                <tr>
                  <td>支付单号：{{ currentRow.prescriptionOrderId }}</td>
                  <td>收银员: {{ currentRow.payOperatorName }}</td>
                  <td>日期：{{ new Date() | dateFormat }}</td>
                </tr>
                <tr>
                  <td>药品总金额：{{ currentRow.drugAmount }}元</td>
                  <td>诊查费（平台代收）：{{ currentRow.diagnosticAmount }}元</td>
                  <td>处方总金额：{{ currentRow.totalAmount }}元</td>
                </tr>
                <tr>
                  <td style="font-size:20px;">应付金额: {{ currentRow.finalAmount }}元</td>
                </tr>
                <tr>
                  <td style="font-size:14px;" v-if="currentRow.medicalAmount">医保:{{currentRow.medicalAmount}}元</td>
                </tr>
                <tr>
                  <td style="font-size:14px;">{{currentRow.paymentTypeName}}: {{ parseInt((currentRow.finalAmount - (currentRow.medicalAmount ? currentRow.medicalAmount : 0))*100)  /100 }}元</td>
                </tr>
                <tr>
                  <td style="color: red">
                    {{ this.currentRow.couponAmount > 0 ? this.currentRow.memo : '' }}
                  </td>
                </tr>
              </table>

            </div>
          </div>
          <!--审方-->
          <div class="common tq">
            <div class="tit">
              <h4>审方清单</h4>
              <div class="date">{{ currentRow.dosageTime | dateFormat }}</div>
            </div>
            <div class="con">
              <el-table
                :data="prescriptionItems"
                border
                style="width: 100%">
                <el-table-column prop="name" label="药品名称"></el-table-column>
                <el-table-column prop="specifications" width="100" label="规格"></el-table-column>
                <el-table-column prop="numTotal" width="40" label="数量"></el-table-column>
                <el-table-column prop="unit" width="50" label="单位"></el-table-column>
                <el-table-column prop="hspSkuSpec" width="100" label="医院规格"></el-table-column>
                <el-table-column prop="manufacturer" width="100" label="生产厂家"></el-table-column>
                <el-table-column prop="price" width="80" label="总价(元)"></el-table-column>
                <el-table-column prop="goodsBarcode" label="药品编码"></el-table-column>
              </el-table>
              <div class="foo">
                <table style="width: 100%">
                  <tr>
                    <td>药品总金额：<strong>{{ currentRow.drugAmount }}元</strong></td>
                    <td>审方药师: {{ currentRow.dosageOperatorName }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="finish()">配药完成</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <div id="printDiv" ref="print">
      <div v-for="item in prescriptionItems" :key="item.id" class="panel"
           style="width: 70mm; height: 45mm;font-size: 10px;line-height: 14px; position: relative;">
        <div>
          <span style="font-size: 12px;">姓名：</span>
          <span style="font-size: 14px;font-weight:700; ">{{ prescriptionDetail.patient.name }}</span>
        </div>
        <div style="position: absolute; top: 8px; right: 40px;">
          <span style="margin-right: 10px">{{ prescriptionDetail.patient.sexName }}</span>
          <span>年龄: {{ prescriptionDetail.patient.age }}岁</span>
        </div>
        <div style="font-size: 14px; margin: 10px 0 5px;font-weight:700;">{{ item.name }}</div>
        <div>
          <span style="font-size:10px;">生产厂家：</span>
          <span style="font-size:12px;">{{ item.manufacturer}}</span>
        </div>
        <div>
          <span style="font-size:10px;">数量：</span>
          <span style="font-size:12px;">{{ item.numTotal }}{{ item.unit }}</span>
        </div>
        <div>
          <span style="font-size:10px;">医院规格：</span>
          <span style="font-size:12px;">{{ item.hspSkuSpec }}</span>
        </div>
        <div>
          <span style="font-size:10px;">用法：</span>
          <span style="font-size:14px;">{{ item.usage }}，{{ item.frequency }}，{{ item.num }}</span>
        </div>
        <div>
          <span style="font-size:10px;">补充说明：</span>
          <span style="font-size:12px;">{{ item.remark }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .el-row > .el-col:first-child {
    color: #999;
  }

  #printDiv {
    background: #eaeaea;
    width: 70mm;
    display: none;
  }

  .tableList {
    margin-top: 15px;
  }
</style>
<script>
  import { mapState } from 'vuex'
  import { getLodop } from '@/utils/LodopFuncs'

  export default {
    data() {
      return {
        listLoading: false,
        prescriptionDetailLoading: false,
        prescriptionShDetailLoading: false,
        param: {
          page: 1,
          limit: 10,
          searchCondition: { finish: false, orderStatus: 'DOSAGE' }
        },
        dialogVisible: false,
        mObject: {},
        mTitle: '',
        shDialogVisible: false,
        currentRow: {},
        payment: {},
        rejectMsg: '',
        rules: {
          itemName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        }
      }
    },
    filters: {},
    created() {
      this.getPrescriptionList()
    },
    computed: mapState({
      prescriptions: state => state.prescription.pharmacyPrescriptions,
      payments: state => state.prescription.payments,
      prescriptionItems: state => state.prescription.prescriptionItems,
      prescriptionDetail: state => state.prescription.prescriptionDetail,
      prescriptionShDetail: state => state.prescription.prescriptionShDetail
    }),
    methods: {
      getPrescriptionList() {
        this.listLoading = true
        this.$store
          .dispatch('getPharmacyPrescriptionList', { params: this.param })
          .then(response => {
            this.listLoading = false
          })
      },
      getPayment() {
        this.$store.dispatch('getPayment', { params: this.param })
      },
      resetSearch() {
        this.param.searchCondition = { finish: false, orderStatus: 'PAYED' }
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
      print() {
        try {
          const LODOP = getLodop()
          const html = this.$refs.print.innerHTML
          LODOP.ADD_PRINT_HTM('5mm', '5mm', '100%', '100%', html)
          LODOP.SET_PRINTER_INDEX('标签打印机')
          LODOP.SET_PRINT_PAGESIZE(1, '70mm', '50mm', '') // 1 纵(正)向打印，固定纸张；70mm：自定义纸质宽度 50mm：自定义纸张高度
          LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Width:100%;Height:100%')
          LODOP.PRINT()
        } catch (error) {
        }
      },
      detail(row) {
        console.log(row,11);
        this.dialogVisible = true
        this.currentRow = row
        this.prescriptionDetailLoading = true
        this.$store.dispatch('getPrescriptionDetail', {
          params: row,
          callback: () => {
            this.prescriptionDetailLoading = false
          }
        })
        this.getPayment()
        this.payment.finalAmount = this.currentRow.prescriptionTotalAmount
        this.getPharmacyPrescriptionItems()
      },
      getPharmacyPrescriptionItems() {
        this.$store
          .dispatch('getPharmacyPrescriptionItems', {
            params: { prescriptionId: this.currentRow.prescriptionId }
          })
          .then(response => {
          })
      },
      finish() {
        let params = {
          id: this.currentRow.id,
          pay: this.payment
        }
        this.$store
          .dispatch('prescriptionDeliver', { params: params })
          .then(response => {
            this.dialogVisible = false
            this.payment = {}
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.print()
            this.getPrescriptionList()
          })
          .then(error => {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          })
      }
    }
  }
</script>
