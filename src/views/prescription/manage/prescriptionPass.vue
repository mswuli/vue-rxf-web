<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.pickCode" class="filter-item" placeholder="提取码">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.hspName" class="filter-item" placeholder="医院名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.code" class="filter-item" placeholder="处方编号">
      </el-input>
      <el-button class="filter-item" @click="getPrescriptionPass()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="prescriptionPass.data"
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
      <el-table-column prop="docName"  label="医生名称"></el-table-column>
      <el-table-column prop="prescriptionTypeName" width="150" label="处方类型"></el-table-column>
      <el-table-column prop="code" width="120" label="处方编号"></el-table-column>
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
      <el-table-column prop="totalAmount" width="100" label="处方总金额（元）"></el-table-column>
      <el-table-column prop="pharmacyName" width="150" label="提取药店"></el-table-column>
      <el-table-column fixed="right" label="操作" width="112">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row)">查看处方单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="prescriptionPass.total">
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
              <el-col :span="6">就诊卡号</el-col>
              <el-col :span="18">{{ prescriptionDetail.patient.patientMedicalCard }}</el-col>
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
              <el-col :span="18">{{ prescriptionDetail.prescription.code }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">提取码</el-col>
              <el-col v-if="prescriptionDetail.prescriptionPick == null" :span="18"></el-col>
              <el-col v-else-if="prescriptionDetail.prescriptionPick.code == null" :span="18">{{ prescriptionDetail.prescriptionPick.codeBackup }}</el-col>
              <el-col v-else :span="18">{{ prescriptionDetail.prescriptionPick.code }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">提取状态</el-col>
              <el-col v-if="prescriptionDetail.prescriptionPick == null" :span="18"></el-col>
              <el-col v-else-if="prescriptionDetail.prescriptionPick.pickStatus == 0" :span="18">未提取</el-col>
              <el-col v-else-if="prescriptionDetail.prescriptionPick.pickStatus == 1" :span="18">已提取</el-col>
              <el-col v-else-if="prescriptionDetail.prescriptionPick.pickStatus == -1" :span="18">已过期</el-col>
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
            <el-row>
              <el-col :span="6">诊查费（元）</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.diagnosticAmount }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">药品金额（元）</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.drugAmount }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">处方总金额（元）</el-col>
              <el-col :span="18">{{ prescriptionDetail.prescription.totalAmount }}</el-col>
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
              <el-table-column prop="numTotal" label="数量">
                <template slot-scope="scope">
                  {{ scope.row.numTotal }} {{ scope.row.unit }}
                </template>
              </el-table-column>
              <el-table-column prop="price" width="100" label="总价（元）"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>处方提取记录</span>
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
                  <span v-if="scope.row.finish">/已完成</span>
                  <span v-else>/未完成</span>
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
        param: {page: 1, limit: 10, searchCondition: {}},
        dialogVisible: false,
        mObject: {},
        mTitle: '',
        shDialogVisible: false,
        currentRow: {},

        rules: {
          itemName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        }
      }
    },
    filters: {},
    created() {
      this.getPrescriptionPass()
    },
    computed: mapState({
      prescriptionPass: state => state.prescription.prescriptionPass,
      prescriptionDetail: state => state.prescription.prescriptionDetail,
      prescriptionShDetail: state => state.prescription.prescriptionShDetail
    }),
    methods: {
      getPrescriptionPass() {
        this.listLoading = true
        this.$store.dispatch('getPrescriptionPass', {
          params: this.param, callback: () => {
            this.listLoading = false
            // console.log(this.prescriptionPass)
          }
        })
      },
      resetSearch() {
        this.param.searchCondition = {}
        this.getPrescriptionPass()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getPrescriptionPass()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getPrescriptionPass()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      detail(row) {
        this.dialogVisible = true
        this.currentRow = row
        this.prescriptionDetailLoading = true
        this.$store.dispatch('getPrescriptionDetail', {
          params: row, callback: () => {
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
          params: shObject, callback: () => {
            this.prescriptionShDetailLoading = false
          }
        })
      }
    }
  };
</script>
