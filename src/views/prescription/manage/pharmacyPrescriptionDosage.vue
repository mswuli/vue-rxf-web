<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.Code" class="filter-item" placeholder="处方编号">
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
      class="tabList"
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
          <el-button type="warning" size="mini" @click="detail(scope.row)">审方</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="prescriptions.total">
      </el-pagination>
    </div>

    <el-dialog
      class="cf-dialog"
      title="审方"
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
                <div class="item" v-for="item in prescriptionItemList" v-bind:key="item.id">
                  <div class="name clearfix">
                    <div class="pull-left">{{ item.name }}{{item.medical ? '（医保）': ''}} {{ item.specifications }} </div>
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
                    {{this.currentRow.couponAmount > 0 ? this.currentRow.memo : '' }}
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
                :data="prescriptionItemList"
                ref="itemTable"
                @selection-change="tableChange"
                border
                style="width: 100%">
                <el-table-column prop="name" label="药品名称"></el-table-column>
                <el-table-column prop="specifications" width="50" label="规格"></el-table-column>
                <el-table-column prop="numTotal" width="40" label="数量"></el-table-column>
                <el-table-column prop="unit" width="50" label="单位"></el-table-column>
                <el-table-column prop="hspSkuSpec" width="100" label="医院规格"></el-table-column>
                <el-table-column prop="manufacturer" width="100" label="生产厂家"></el-table-column>
                <el-table-column prop="store" width="60" label="库存"></el-table-column>
                <el-table-column prop="tinyStore" width="60" label="散装库存"></el-table-column>
                <el-table-column prop="price" width="80" label="总价(元)"></el-table-column>
                <el-table-column prop="goodsBarcode" label="药品编码"></el-table-column>
              </el-table>
              <div class="foo">
                <table style="width: 100%">
                  <tr>
                    <td>药品总金额：<strong>{{ currentRow.drugAmount }}元</strong></td>
                  </tr>
                </table>
              </div>
              <div>
                <el-form ref="currentLicensedId" label-width="120px">
                  <el-form-item style="margin-left: 0" label="审方药师：" prop="currentLicensedName">
                    <el-radio-group v-model="currentLicensedName">
                      <el-radio-button v-for="item in currentLicensedList"
                                       :key="item.id"
                                       :label="item.name"></el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-popover
          placement="top"
          width="300"
          v-model="visible2">
          <el-form :model="currentRow" :rules="rules" ref="mObject">
            <el-form-item>
              <el-input v-model="rejectMsg" placeholder="请填写拒绝的原因" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="rejectDosage">确定</el-button>
          </div>
          <el-button type="danger" slot="reference">审方不通过</el-button>
        </el-popover>
        <el-button type="primary" @click="dosage()">审方通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .el-row > .el-col:first-child {
    color: #999;
  }

  .tabList {
    margin-top: 13px;
  }
</style>


<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        listLoading: false,
        currentLicensedName: null,
        currentLicensedId: null,
        prescriptionDetailLoading: false,
        prescriptionShDetailLoading: false,
        param: {
          page: 1,
          limit: 10,
          searchCondition: { finish: false, orderStatus: 'PAYED' }
        },
        dialogVisible: false,
        mObject: {},
        mTitle: '',
        shDialogVisible: false,
        currentRow: {},

        rejectMsg: '',

        selectedItemRows: [],
        visible2: false,

        rules: {
          itemName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        }
      }
    },
    filters: {},
    mounted() {
    },
    created() {
      this.getPrescriptionList()
      this.listCurrentLicensed()
    },
    computed: mapState({
      prescriptions: state => state.prescription.pharmacyPrescriptions,
      prescriptionDetail: state => state.prescription.prescriptionDetail,
      prescriptionItemList: state => state.prescription.prescriptionItemList,
      prescriptionShDetail: state => state.prescription.prescriptionShDetail,
      currentLicensedList: state => state.pharmacy.currentLicensedList
    }),
    methods: {
      checkedAll() {
        for (let i = 0; i < this.prescriptionItemList.length; i++) {
          let row = this.prescriptionItemList[i]
          if (!(!row.store || row.store === '0')) {
            this.$refs.itemTable.toggleRowSelection(row, true)
          }
        }
      },
      checkboxT(row, index) {
        if (!row.store || row.store === '0') {
          return 0
        } else {
          return 1
        }
      },
      listCurrentLicensed() {
        this.$store
          .dispatch('listCurrentLicensed', { params: this.param })
          .then(response => {
          })
      },
      getPrescriptionList() {
        this.listLoading = true
        this.$store
          .dispatch('getPharmacyPrescriptionList', { params: this.param })
          .then(response => {
            this.listLoading = false
          })
      },
      resetSearch() {
        this.param.searchCondition = { finish: false, orderStatus: 'PICKED' }
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
      detail(row) {
        // console.log(row,8)
        this.currentLicensedName = null
        this.currentLicensedId = null
        if (this.currentLicensedList.length === 1) {
          this.currentLicensedName = this.currentLicensedList[0].name
          this.currentLicensedId = this.currentLicensedList[0].id
        }
        for (const currentLicensed of this.currentLicensedList) {
          if (currentLicensed.name === this.currentLicensedName) {
            this.currentLicensedId = currentLicensed.id
          }
        }
        this.dialogVisible = true
        this.currentRow = row
        this.prescriptionDetailLoading = true
        this.$store.dispatch('getPrescriptionDetail', {
          params: row,
          callback: () => {
            this.prescriptionDetailLoading = false
          }
        })
        this.getPrescriptionItemList(row)
      },
      getPrescriptionItemList(row) {
        this.$store
          .dispatch('getPrescriptionItemList', { params: row })
          .then(response => {
            this.$nextTick(() => {
              this.checkedAll()
            })
          })
      },
      showShDetail(row) {
        const shObject = Object.assign({}, this.currentRow)
        shObject.prescriptionPickPharmid = row.id
        this.shDialogVisible = true
        this.prescriptionShDetailLoading = true
        this.$store.dispatch('getPrescriptionShDetail', {
          params: shObject,
          callback: () => {
            this.prescriptionShDetailLoading = false
          }
        })
      },
      tableChange(selection) {
        this.selectedItemRows = selection
      },
      dosage() {
        if (!this.currentLicensedName) {
          this.$message({
            type: 'warning',
            message: '请选择审方药师',
            duration: 3 * 1000
          })
          return false
        }
        const list = []
        if (this.selectedItemRows.length) {
          for (const row of this.selectedItemRows) {
            list.push({
              skuId: row.skuId,
              numTotal: row.numTotal,
              price: row.price,
              unit: row.unit
            })
          }
        }

        for (const currentLicensed of this.currentLicensedList) {
          if (currentLicensed.name === this.currentLicensedName) {
            this.currentLicensedId = currentLicensed.id
          }
        }
        let params = {
          id: this.currentRow.id,
          licensed: this.currentLicensedId,
          list: list
        }
        this.$store
          .dispatch('prescriptionDosage', { params: params })
          .then(response => {
            this.dialogVisible = false
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.getPrescriptionList()
          })
      },
      rejectDosage() {
        if (!this.currentLicensedName) {
          this.$message({
            type: 'warning',
            message: '请选择审方药师',
            duration: 3 * 1000
          })
          return false
        }
        for (const currentLicensed of this.currentLicensedList) {
          if (currentLicensed.name === this.currentLicensedName) {
            this.currentLicensedId = currentLicensed.id
          }
        }
        let params = {
          id: this.currentRow.id,
          licensed: this.currentLicensedId,
          msg: this.rejectMsg
        }
        this.$store
          .dispatch('prescriptionDosageReject', { params: params })
          .then(response => {
            this.visible2 = false
            this.dialogVisible = false
            this.rejectMsg = ''
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.getPrescriptionList()
          })
      }
    }
  }
</script>
