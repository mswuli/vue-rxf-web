<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.pickCode" class="filter-item" placeholder="提取码">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.hspName" class="filter-item" placeholder="医院名称">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.pickStatus" placeholder="提取状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="未提取" value="0"></el-option>
        <el-option label="已提取" value="1"></el-option>
        <el-option label="已过期" value="-1"></el-option>
      </el-select>
      <el-button class="filter-item" @click="getPrescriptionList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="prescriptions.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="152" prop="prescriptionTime" label="处方开具时间">
        <template slot-scope="scope">
          {{scope.row.prescriptionTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column fixed prop="hspName" width="150" label="医院名称"></el-table-column>
      <el-table-column prop="departName" label="科室名称"></el-table-column>
      <el-table-column prop="docName" width="150" label="医生名称"></el-table-column>
      <el-table-column prop="prescriptionTypeName" width="150" label="处方类型"></el-table-column>
      <el-table-column prop="pickCode" width="150" label="处方提取码"></el-table-column>
      <el-table-column prop="patientName" width="100" label="患者"></el-table-column>
      <el-table-column prop="idCard" width="162" label="身份证号"></el-table-column>
      <el-table-column prop="patientTel" width="110" label="手机号"></el-table-column>
      <el-table-column prop="creator" width="80" label="提取状态">
        <template slot-scope="scope">
          <span v-if="scope.row.pickStatus == 0">未提取</span>
          <span v-else-if="scope.row.pickStatus == 1">已提取</span>
          <span v-else>已过期</span>
        </template>
      </el-table-column>
      <el-table-column prop="diagnosticAmount" width="80" label="诊查费（元）"></el-table-column>
      <el-table-column prop="totalAmount" width="80" label="处方总金额（元）"></el-table-column>
      <el-table-column prop="pharmacyName" width="150" label="提取药店"></el-table-column>
      <el-table-column prop="operResultName" width="80" label="审核状态"></el-table-column>
      <el-table-column prop="operator" width="120" label="审核药剂师"></el-table-column>
      <el-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row)">查看处方单</el-button>
          <el-button type="warning" v-if="scope.row.orderStatus==='PICKED'" size="mini" @click="picked(scope.row)">
            核对/调配
          </el-button>
          <el-button type="warning" v-if="scope.row.orderStatus==='DOSAGE'" size="mini" @click="showDosage(scope.row)">
            核对/发药
          </el-button>
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
      title="处方详情"
      width="90%"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
      v-loading="prescriptionDetailLoading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>患者信息</span>
            </div>
            <el-row>
              <el-col :span="6">姓名</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.name }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">年龄</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.age }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">性别</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.sexName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">身高</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.height }}CM</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">体重</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.weight }}KG</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">婚姻状况</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.maritalStatusName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">身份证号</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.idCard }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">联系方式</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.tel }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">地址</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.address }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">微信openId</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.openId }}</el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12" style="float: right">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>处方基本信息</span>
            </div>
            <el-row>
              <el-col :span="6">处方编号</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.id }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">所属医院</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.hspName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">科室名称</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.departName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">处方类型</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.prescriptionTypeName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">初诊/复诊</el-col>
              <el-col :span="18">
                <template>
                  <span v-if="prescriptionDetail.prescription.firstVisit">初诊</span>
                  <span v-else>初诊</span>
                </template>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">批准文号</el-col>
              <el-col :span="18">没有字段</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">是否慢病</el-col>
              <el-col :span="18">
                <template>
                  <span v-if="prescriptionDetail.prescription.chronicDiseases">是</span>
                  <span v-else>否</span>
                </template>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">主诉</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.materialCause }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">现病史</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.historyPresentIllness }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">既往史</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.historyPastIllness }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">过敏史</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.allergicHistory }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">家族史</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.familyMedicalHistory }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">初步诊断</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.tentativeDiagnosis }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">医嘱</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.docAdvice }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">检查资料</el-col>
              <el-col :span="18"></el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>药品信息</span>
            </div>
            <el-table
              :data="prescriptionDetail.itemList"
              style="width: 100%">
              <el-table-column prop="skuId" label="药品ID"></el-table-column>
              <el-table-column prop="skuName" label="药品名称"></el-table-column>
              <el-table-column prop="specifications" label="规格"></el-table-column>
              <el-table-column prop="usage" label="用法"></el-table-column>
              <el-table-column prop="numTotal" label="应取/实取">
                <template slot-scope="scope">
                  {{ scope.row.numTotal }} / {{ scope.row.pickNum }}
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>处方提取信息</span>
            </div>
            <el-table
              :data="prescriptionDetail.pickPharmList"
              style="width: 100%">
              <el-table-column prop="updateTime" label="提取时间">
                <template slot-scope="scope">
                  {{scope.row.updateTime | dateFormat}}
                </template>
              </el-table-column>
              <el-table-column prop="pharmacyName" label="提取药店"></el-table-column>
              <el-table-column prop="pickStatus" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.pickStatus">已提取</span>
                  <span v-else>未提取</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="142">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showShDetail(scope.row)">查看审核详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="审核详情"
      :close-on-click-modal=false
      :visible.sync="shDialogVisible">
      <el-table
        :data="prescriptionShDetail"
        v-loading="prescriptionShDetailLoading"
        border
        style="width: 100%">
        <el-table-column prop="operator" label="操作人"></el-table-column>
        <el-table-column prop="funcName" label="操作名称"></el-table-column>
        <el-table-column prop="operResultName" label="操作结果"></el-table-column>
        <el-table-column prop="operTime" width="155" label="操作时间">
          <template slot-scope="scope">
            {{scope.row.operTime | dateFormat}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="核对/调配"
      :close-on-click-modal=false
      :visible.sync="pickedDialogVisible">
      <el-form :model="currentRow" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="处方编号" prop="prescriptionId">
          <el-input disabled v-model="currentRow.prescriptionId"></el-input>
        </el-form-item>
        <el-form-item label="处方编号" prop="prescriptionOrderId">
          <el-input disabled v-model="currentRow.prescriptionOrderId"></el-input>
        </el-form-item>
        <el-form-item label="提取码" prop="pickCode">
          <el-input disabled v-model="currentRow.pickCode"></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="pickOperatorName">
          <el-input disabled v-model="currentRow.pickOperatorName"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        ref="itemTable"
        :data="prescriptionItems"
        border
        @selection-change="tableChange"
        style="width: 100%">
        <el-table-column type="selection" :selectable='checkboxT' width="55"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="goodsBarcode" label="药品编码"></el-table-column>
        <el-table-column prop="specifications" label="规格"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="store" label="库存"></el-table-column>
        <el-table-column prop="numTotal" label="数量"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pickedDialogVisible = false">关 闭</el-button>
        <el-popover
          placement="top"
          width="300"
          v-model="visible2">
          <el-form :model="currentRow" :rules="rules" ref="mObject">
            <el-form-item>
              <el-input placeholder="请填写拒绝的原因" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" v-model="rejectMsg" size="mini" @click="rejectDosage">确定</el-button>
          </div>
          <el-button type="danger" slot="reference">拒 绝</el-button>
        </el-popover>
        <el-button type="primary" @click="dosage()">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="核对/发药"
      width="600px"
      :close-on-click-modal=false
      :visible.sync="dosageDialogVisible"
      v-loading="prescriptionDetailLoading">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="支付方式" prop="paymentTypeCode">
          <el-select v-model="payment.paymentTypeCode" placeholder="支付方式">
            <el-option
              v-for="item in payments"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应付金额" prop="finalAmount">
          <el-input v-model="payment.finalAmount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dosageDialogVisible = false">关 闭</el-button>
        <el-popover
          placement="top"
          width="300"
          v-model="visible3">
          <el-form :model="currentRow" :rules="rules" ref="mObject">
            <el-form-item>
              <el-input v-model="rejectMsg" placeholder="请填写拒绝的原因" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="rejectFinish">确定</el-button>
          </div>
          <el-button type="danger" slot="reference">拒 绝</el-button>
        </el-popover>
        <el-button type="primary" @click="finish()">提 交</el-button>
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
</style>


<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        listLoading: false,
        prescriptionDetailLoading: false,
        prescriptionShDetailLoading: false,
        param: { page: 1, limit: 10, searchCondition: {} },
        dialogVisible: false,
        mObject: {},
        mTitle: '',
        shDialogVisible: false,
        currentRow: {},

        visible2: false,
        visible3: false,

        payment: {},

        pickedDialogVisible: false,
        dosageDialogVisible: false,

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
      checkedAll() {
        for (let i = 0; i < this.prescriptionItems.length; i++) {
          let row = this.prescriptionItems[i]
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
      getPayment() {
        this.$store.dispatch('getPayment', { params: this.param })
      },
      getPrescriptionList() {
        this.listLoading = true
        this.$store
          .dispatch('getPharmacyPrescriptionList', { params: this.param })
          .then(response => {
            this.listLoading = false
          })
      },
      getPharmacyPrescriptionItems() {
        this.$store
          .dispatch('getPharmacyPrescriptionItems', {
            params: { prescriptionId: this.currentRow.prescriptionId }
          })
          .then(response => {
            this.$nextTick(() => {
              this.checkedAll()
            })
          })
      },
      resetSearch() {
        this.param.searchCondition = {}
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
      tableChange(selection) {
        this.selectedItemRows = selection
      },
      detail(row) {
        this.dialogVisible = true
        this.currentRow = row
        this.prescriptionDetailLoading = true
        this.$store.dispatch('getPrescriptionDetail', {
          params: row,
          callback: () => {
            this.prescriptionDetailLoading = false
          }
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
      picked(row) {
        this.currentRow = row
        this.pickedDialogVisible = true
        this.getPharmacyPrescriptionItems()
      },
      showDosage(row) {
        this.currentRow = row
        this.dosageDialogVisible = true
        this.getPharmacyPrescriptionItems()
        this.getPayment()
      },
      dosage() {
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
        let params = {
          id: this.currentRow.id,
          list: list
        }
        this.$store
          .dispatch('prescriptionDosage', { params: params })
          .then(response => {
            this.pickedDialogVisible = false
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.getPrescriptionList()
          })
          .then(error => {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          })
      },
      rejectDosage() {
        let params = {
          id: this.currentRow.id,
          msg: this.rejectMsg
        }
        this.$store
          .dispatch('prescriptionDosageReject', { params: params })
          .then(response => {
            this.visible2 = false
            this.pickedDialogVisible = false
            this.rejectMsg = ''
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.getPrescriptionList()
          })
          .then(error => {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          })
      },
      finish() {
        let params = {
          id: this.currentRow.id,
          pay: this.payment
        }
        this.$store
          .dispatch('prescriptionFinish', { params: params })
          .then(response => {
            this.dosageDialogVisible = false
            this.payment = {}
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.getPrescriptionList()
          })
          .then(error => {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          })
      },
      rejectFinish() {
        let params = {
          id: this.currentRow.id,
          msg: this.rejectMsg
        }
        this.$store
          .dispatch('prescriptionFinishReject', { params: params })
          .then(response => {
            this.visible3 = false
            this.dosageDialogVisible = false
            this.rejectMsg = ''
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
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
